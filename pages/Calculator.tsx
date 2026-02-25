import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { subscribeEmailFirestore } from '@/lib/emailSubscription';
import { onAuthStateChange, getCurrentUser } from '@/lib/firebaseAuth';
import type { User } from 'firebase/auth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CalculatorInputs, { type CalculatorInputValues } from '@/components/Calculator/CalculatorInputs';
import CalculatorResults, { type CalculationResults } from '@/components/Calculator/CalculatorResults';
import CalculatorCharts from '@/components/Calculator/CalculatorCharts';

const Calculator: React.FC = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState<CalculatorInputValues>({
    propertyPrice: 250000,
    depositAmount: 62500,
    depositPercent: 25,
    interestRate: 4.5,
    mortgageTerm: 25,
    monthlyRent: 1200,
    monthlyExpenses: 200,
    annualAppreciation: 3.5,
    annualRentIncrease: 2.5,
  });

  const [isAdvancedUnlocked, setIsAdvancedUnlocked] = useState(false);
  const [unlockEmail, setUnlockEmail] = useState('');
  const [unlockLoading, setUnlockLoading] = useState(false);
  const [unlockMessage, setUnlockMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Calculate results
  const results: CalculationResults = useMemo(() => {
    const loanAmount = inputs.propertyPrice - inputs.depositAmount;
    const monthlyRate = inputs.interestRate / 100 / 12;
    const totalPayments = inputs.mortgageTerm * 12;

    // Monthly mortgage payment (repayment mortgage)
    let monthlyPayment = 0;
    if (monthlyRate > 0 && totalPayments > 0) {
      monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
        (Math.pow(1 + monthlyRate, totalPayments) - 1);
    } else if (totalPayments > 0) {
      monthlyPayment = loanAmount / totalPayments;
    }

    const totalRepayment = monthlyPayment * totalPayments;
    const totalInterest = totalRepayment - loanAmount;

    // Yields
    const annualRent = inputs.monthlyRent * 12;
    const annualExpenses = inputs.monthlyExpenses * 12;
    const grossYield = inputs.propertyPrice > 0 ? (annualRent / inputs.propertyPrice) * 100 : 0;
    const netYield = inputs.propertyPrice > 0 ? ((annualRent - annualExpenses) / inputs.propertyPrice) * 100 : 0;

    // Cash flow
    const monthlyCashFlow = inputs.monthlyRent - monthlyPayment - inputs.monthlyExpenses;
    const annualCashFlow = monthlyCashFlow * 12;

    // ROI (first year): (annual cash flow + first year equity gain) / deposit
    const firstYearEquityGain = monthlyPayment * 12 - totalInterest / inputs.mortgageTerm;
    const firstYearAppreciation = inputs.propertyPrice * (inputs.annualAppreciation / 100);
    const roi = inputs.depositAmount > 0
      ? ((annualCashFlow + firstYearAppreciation) / inputs.depositAmount) * 100
      : 0;

    // Break-even: months to recover deposit from cash flow
    const breakEvenMonths = monthlyCashFlow > 0
      ? Math.ceil(inputs.depositAmount / monthlyCashFlow)
      : monthlyCashFlow === 0 ? 0 : -1;

    const ltv = inputs.propertyPrice > 0 ? (loanAmount / inputs.propertyPrice) * 100 : 0;

    return {
      loanAmount,
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalInterest: Math.round(totalInterest),
      totalRepayment: Math.round(totalRepayment),
      grossYield,
      netYield,
      monthlyCashFlow: Math.round(monthlyCashFlow * 100) / 100,
      annualCashFlow: Math.round(annualCashFlow),
      roi,
      breakEvenMonths,
      ltv,
    };
  }, [inputs]);

  // Generate 25-year projection data
  const projectionData = useMemo(() => {
    const data = [];
    let propertyValue = inputs.propertyPrice;
    let mortgageBalance = results.loanAmount;
    let cumulativeCashFlow = 0;
    let currentMonthlyRent = inputs.monthlyRent;
    let totalRentCollected = 0;
    const monthlyRate = inputs.interestRate / 100 / 12;

    for (let year = 0; year <= 25; year++) {
      const equity = propertyValue - mortgageBalance;
      const annualRent = currentMonthlyRent * 12;
      const annualMortgage = results.monthlyPayment * 12;
      const annualExpenses = inputs.monthlyExpenses * 12;
      const annualCashFlow = annualRent - annualMortgage - annualExpenses;

      data.push({
        year,
        propertyValue: Math.round(propertyValue),
        equity: Math.round(Math.max(0, equity)),
        totalRentCollected: Math.round(totalRentCollected),
        cumulativeCashFlow: Math.round(cumulativeCashFlow),
        mortgageBalance: Math.round(Math.max(0, mortgageBalance)),
        annualRent: Math.round(annualRent),
        annualMortgage: Math.round(annualMortgage),
        annualCashFlow: Math.round(annualCashFlow),
      });

      // Update for next year
      propertyValue *= (1 + inputs.annualAppreciation / 100);
      currentMonthlyRent *= (1 + inputs.annualRentIncrease / 100);
      totalRentCollected += annualRent;
      cumulativeCashFlow += annualCashFlow;

      // Reduce mortgage balance (simplified annual calculation)
      for (let month = 0; month < 12; month++) {
        if (mortgageBalance > 0) {
          const interestPayment = mortgageBalance * monthlyRate;
          const principalPayment = results.monthlyPayment - interestPayment;
          mortgageBalance -= principalPayment;
        }
      }
      if (mortgageBalance < 0) mortgageBalance = 0;
    }

    return data;
  }, [inputs, results]);

  const handleUnlockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!unlockEmail) return;

    setUnlockLoading(true);
    setUnlockMessage(null);

    try {
      const result = await subscribeEmailFirestore(unlockEmail, 'calculator-advanced', {
        referrer: window.location.href,
      });

      if (result.success) {
        setUnlockMessage({ 
          text: result.message || 'Advanced features unlocked! Enjoy your full analysis.', 
          type: 'success' 
        });
        setIsAdvancedUnlocked(true);
        // Store in localStorage so it persists
        localStorage.setItem('calculator_unlocked', 'true');
        localStorage.setItem('calculator_email', unlockEmail);
      } else {
        setUnlockMessage({ 
          text: result.error || 'Something went wrong. Please try again.', 
          type: 'error' 
        });
      }
    } catch (err: any) {
      console.error('Error subscribing email:', err);
      setUnlockMessage({ 
        text: err.message || 'Something went wrong. Please try again.', 
        type: 'error' 
      });
    } finally {
      setUnlockLoading(false);
    }
  };

  // Check localStorage on mount and listen for auth changes
  useEffect(() => {
    const unlocked = localStorage.getItem('calculator_unlocked');
    if (unlocked === 'true') {
      setIsAdvancedUnlocked(true);
    }

    // Listen for auth state changes
    const unsubscribe = onAuthStateChange((currentUser) => {
      setUser(currentUser);
      // Pre-fill email with authenticated user's email if input is empty
      if (currentUser?.email) {
        setUnlockEmail(prev => prev || currentUser.email || '');
      }
    });

    // Also check current user immediately
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      if (currentUser.email) {
        setUnlockEmail(prev => prev || currentUser.email || '');
      }
    }

    return () => unsubscribe();
  }, []);

  // Preset scenarios
  const presets = [
    { label: 'First-Time Buyer', price: 200000, deposit: 10, rate: 4.5, term: 30, rent: 900, expenses: 150, appreciation: 3, rentIncrease: 2 },
    { label: 'Buy-to-Let', price: 250000, deposit: 25, rate: 5.0, term: 25, rent: 1200, expenses: 200, appreciation: 3.5, rentIncrease: 2.5 },
    { label: 'London Property', price: 500000, deposit: 20, rate: 4.5, term: 25, rent: 2200, expenses: 400, appreciation: 4, rentIncrease: 3 },
    { label: 'Northern Powerhouse', price: 150000, deposit: 25, rate: 4.5, term: 25, rent: 800, expenses: 120, appreciation: 4, rentIncrease: 3 },
  ];

  const applyPreset = (preset: typeof presets[0]) => {
    const depositAmount = Math.round(preset.price * (preset.deposit / 100));
    setInputs({
      propertyPrice: preset.price,
      depositAmount,
      depositPercent: preset.deposit,
      interestRate: preset.rate,
      mortgageTerm: preset.term,
      monthlyRent: preset.rent,
      monthlyExpenses: preset.expenses,
      annualAppreciation: preset.appreciation,
      annualRentIncrease: preset.rentIncrease,
    });
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />



      {/* Hero Header */}
      <section className="pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 mb-4">
              <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span className="text-amber-400 text-sm font-medium">Free Investment Tool</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Property Investment
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
                Calculator
              </span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-4">
              Model your property investment with real numbers. Calculate mortgage payments, rental yields, ROI, and see 25-year wealth projections.
            </p>
            {!user && (
              <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                <span>No account needed to use the calculator.</span>
                <span>•</span>
                <button
                  onClick={() => navigate('/auth?redirect=/calculator')}
                  className="text-amber-400 hover:text-amber-300 font-medium hover:underline transition-colors"
                >
                  Sign in
                </button>
                <span>to save your calculations</span>
              </div>
            )}
          </div>

          {/* Preset Scenarios */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {presets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => applyPreset(preset)}
                className="bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 hover:border-amber-500/30 text-slate-300 hover:text-white px-4 py-2 rounded-xl text-sm font-medium transition-all hover:-translate-y-0.5"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Calculator */}
      <section className="px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Inputs Column */}
            <div className="lg:col-span-5">
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 lg:sticky lg:top-24">
                <CalculatorInputs values={inputs} onChange={setInputs} />
              </div>
            </div>

            {/* Results Column */}
            <div className="lg:col-span-7 space-y-8">
              <CalculatorResults results={results} isAdvancedUnlocked={isAdvancedUnlocked} />

              <CalculatorCharts
                projectionData={projectionData}
                isAdvancedUnlocked={isAdvancedUnlocked}
                monthlyPayment={results.monthlyPayment}
                monthlyRent={inputs.monthlyRent}
                monthlyExpenses={inputs.monthlyExpenses}
                depositAmount={inputs.depositAmount}
                loanAmount={results.loanAmount}
              />

              {/* Email Gate for Advanced Features */}
              {!isAdvancedUnlocked && (
                <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/30 rounded-2xl p-8">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
                        <svg className="w-10 h-10 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-xl font-bold text-white mb-2">Unlock Advanced Analysis</h3>
                      <p className="text-slate-400 text-sm mb-4">
                        Get access to ROI calculations, break-even timeline, 25-year wealth projections, and detailed charts. Plus receive a free chapter of "Build Wealth Through Property".
                      </p>
                      <form onSubmit={handleUnlockSubmit} className="flex flex-col sm:flex-row gap-3">
                        <input
                          type="email"
                          value={unlockEmail}
                          onChange={(e) => setUnlockEmail(e.target.value)}
                          placeholder="Enter your email address"
                          className="flex-1 px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all text-sm"
                          required
                          disabled={unlockLoading}
                        />
                        <button
                          type="submit"
                          disabled={unlockLoading}
                          className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-6 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/25 whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                        >
                          {unlockLoading ? (
                            <>
                              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                              Unlocking...
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                              </svg>
                              Unlock Free
                            </>
                          )}
                        </button>
                      </form>
                      {unlockMessage && (
                        <p className={`mt-3 text-sm font-medium ${unlockMessage.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                          {unlockMessage.text}
                        </p>
                      )}
                      <p className="text-slate-500 text-xs mt-2">No spam. Just clarity. Unsubscribe anytime.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Book CTA */}
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-8">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <img
                    src="https://d64gsuwffb70l.cloudfront.net/6973e5e8bbb2ae01621a037e_1770743948016_23a5e51b.png"
                    alt="Build Wealth Through Property"
                    className="w-28 rounded-lg shadow-xl shadow-black/30"
                  />
                  <div className="text-center sm:text-left">
                    <h3 className="text-xl font-bold text-white mb-2">Go Beyond the Numbers</h3>
                    <p className="text-slate-400 text-sm mb-4">
                      A calculator shows you the maths. The book teaches you the mindset, strategy, and discipline to build lasting wealth through property.
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                      <Link
                        to="/book-purchase"
                        className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-6 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/25 text-sm inline-flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        Get the Book
                      </Link>
                      <Link
                        to="/"
                        className="bg-slate-700 hover:bg-slate-600 text-white font-medium px-6 py-3 rounded-xl transition-all text-sm inline-flex items-center gap-2 border border-slate-600"
                      >
                        Learn More
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="bg-slate-800/30 border border-slate-700/30 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-slate-500 text-sm leading-relaxed">
                  <span className="text-slate-400 font-medium">Disclaimer:</span> This calculator is for illustrative purposes only and does not constitute financial advice. Actual returns may vary based on market conditions, property location, tenant occupancy, maintenance costs, tax implications, and other factors. Always seek professional advice before making investment decisions. Past performance is not indicative of future results.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer compact />

    </div>
  );
};

export default Calculator;
