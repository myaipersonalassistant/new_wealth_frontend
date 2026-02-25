import React from 'react';

export interface CalculationResults {
  loanAmount: number;
  monthlyPayment: number;
  totalInterest: number;
  totalRepayment: number;
  grossYield: number;
  netYield: number;
  monthlyCashFlow: number;
  annualCashFlow: number;
  roi: number;
  breakEvenMonths: number;
  ltv: number;
}

interface CalculatorResultsProps {
  results: CalculationResults;
  isAdvancedUnlocked: boolean;
}

const formatCurrency = (value: number) => {
  if (Math.abs(value) >= 1000000) {
    return `£${(value / 1000000).toFixed(2)}M`;
  }
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(value);
};

const ResultCard: React.FC<{
  label: string;
  value: string;
  subtext?: string;
  icon: React.ReactNode;
  highlight?: boolean;
  positive?: boolean;
  negative?: boolean;
}> = ({ label, value, subtext, icon, highlight, positive, negative }) => (
  <div className={`relative overflow-hidden rounded-2xl p-5 border transition-all hover:-translate-y-0.5 ${
    highlight
      ? 'bg-gradient-to-br from-amber-500/15 to-amber-600/5 border-amber-500/30'
      : 'bg-slate-800/60 border-slate-700/50 hover:border-slate-600'
  }`}>
    <div className="flex items-start justify-between mb-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
        highlight ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-700/50 text-slate-400'
      }`}>
        {icon}
      </div>
      {(positive || negative) && (
        <div className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
          positive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
        }`}>
          {positive ? 'Positive' : 'Negative'}
        </div>
      )}
    </div>
    <p className="text-slate-400 text-sm mb-1">{label}</p>
    <p className={`text-2xl font-bold ${
      highlight ? 'text-amber-400' : positive ? 'text-emerald-400' : negative ? 'text-red-400' : 'text-white'
    }`}>
      {value}
    </p>
    {subtext && <p className="text-slate-500 text-xs mt-1">{subtext}</p>}
  </div>
);

const LockedCard: React.FC<{ label: string }> = ({ label }) => (
  <div className="relative overflow-hidden rounded-2xl p-5 border border-slate-700/50 bg-slate-800/40">
    <div className="absolute inset-0 backdrop-blur-[2px] bg-slate-900/60 flex flex-col items-center justify-center z-10">
      <svg className="w-6 h-6 text-amber-500/60 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
      <span className="text-amber-400/80 text-xs font-medium">Unlock with email</span>
    </div>
    <p className="text-slate-500 text-sm mb-1">{label}</p>
    <p className="text-slate-600 text-2xl font-bold">--</p>
  </div>
);

const CalculatorResults: React.FC<CalculatorResultsProps> = ({ results, isAdvancedUnlocked }) => {
  const cashFlowPositive = results.monthlyCashFlow >= 0;
  const breakEvenYears = Math.floor(results.breakEvenMonths / 12);
  const breakEvenRemainingMonths = results.breakEvenMonths % 12;

  const getBreakEvenValue = () => {
    if (results.breakEvenMonths < 0) return 'N/A';
    if (results.breakEvenMonths === 0) return results.monthlyCashFlow > 0 ? 'Immediate' : 'N/A';
    if (results.breakEvenMonths >= 600) return '50+ years';
    return `${breakEvenYears}y ${breakEvenRemainingMonths}m`;
  };

  const getBreakEvenSubtext = () => {
    if (results.breakEvenMonths < 0) return 'Negative cash flow';
    if (results.breakEvenMonths === 0) return results.monthlyCashFlow > 0 ? 'Cash flow positive from day one' : 'No cash flow';
    return `${results.breakEvenMonths} months to recover deposit`;
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Key Metrics
        </h3>
        <p className="text-slate-400 text-sm mt-1">Your investment analysis at a glance</p>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard
          label="Monthly Mortgage Payment"
          value={formatCurrency(results.monthlyPayment)}
          subtext={`${formatCurrency(results.loanAmount)} loan at ${results.ltv.toFixed(0)}% LTV`}
          highlight
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          }
        />

        <ResultCard
          label="Monthly Cash Flow"
          value={`${cashFlowPositive ? '+' : ''}${formatCurrency(results.monthlyCashFlow)}`}
          subtext={`${formatCurrency(results.annualCashFlow)}/year after all costs`}
          positive={cashFlowPositive}
          negative={!cashFlowPositive}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        <ResultCard
          label="Gross Rental Yield"
          value={`${results.grossYield.toFixed(2)}%`}
          subtext="Annual rent / property price"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        />

        <ResultCard
          label="Net Rental Yield"
          value={`${results.netYield.toFixed(2)}%`}
          subtext="After expenses, before mortgage"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
            </svg>
          }
        />
      </div>

      {/* Advanced Metrics */}
      <div>
        <div className="flex items-center gap-2 mb-4 mt-8">
          <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Advanced Analysis</h4>
          {!isAdvancedUnlocked && (
            <span className="bg-amber-500/10 text-amber-400 text-xs font-medium px-2 py-0.5 rounded-full border border-amber-500/20">
              Unlock below
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {isAdvancedUnlocked ? (
            <>
              <ResultCard
                label="Return on Investment"
                value={`${results.roi.toFixed(1)}%`}
                subtext="Annual return on cash invested"
                highlight
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                }
              />

              <ResultCard
                label="Break-even Timeline"
                value={getBreakEvenValue()}
                subtext={getBreakEvenSubtext()}
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />

              <ResultCard
                label="Total Interest Paid"
                value={formatCurrency(results.totalInterest)}
                subtext={`Over the full mortgage term`}
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                }
              />

              <ResultCard
                label="Total Repayment"
                value={formatCurrency(results.totalRepayment)}
                subtext={`Principal + interest over term`}
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                }
              />
            </>
          ) : (
            <>
              <LockedCard label="Return on Investment" />
              <LockedCard label="Break-even Timeline" />
              <LockedCard label="Total Interest Paid" />
              <LockedCard label="Total Repayment" />
            </>
          )}
        </div>
      </div>

      {/* Mortgage Breakdown Bar */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5 mt-6">
        <h4 className="text-white font-medium text-sm mb-4">Monthly Breakdown</h4>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-400">Mortgage Payment</span>
              <span className="text-white font-medium">{formatCurrency(results.monthlyPayment)}</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (results.monthlyPayment / (results.monthlyPayment + results.monthlyPayment * 0.3)) * 100)}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-400">Rental Income</span>
              <span className="text-emerald-400 font-medium">+{formatCurrency(results.monthlyCashFlow + results.monthlyPayment)}</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, ((results.monthlyCashFlow + results.monthlyPayment) / (results.monthlyPayment + results.monthlyPayment * 0.3)) * 100)}%` }}
              />
            </div>
          </div>
          <div className="pt-2 border-t border-slate-700/50">
            <div className="flex justify-between text-sm">
              <span className="text-slate-300 font-medium">Net Cash Flow</span>
              <span className={`font-bold ${results.monthlyCashFlow >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {results.monthlyCashFlow >= 0 ? '+' : ''}{formatCurrency(results.monthlyCashFlow)}/mo
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorResults;
