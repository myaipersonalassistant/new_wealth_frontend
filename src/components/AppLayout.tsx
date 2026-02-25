import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChange, getUserProfile, ensureUserProfile, type UserProfile } from '@/lib/firebaseAuth';
import type { User } from 'firebase/auth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { TrustSignals, WhyThisBookExists, WhoThisBookIsFor, WhatYoullLearn } from '@/components/BookContent';
import { FrameworkSection, AboutAuthorSection, GetBookSection, FreeResourceSection, FAQSection, FinalCTASection, MasterclassSection } from '@/components/BookFeatures';

import BookReviewsSection from '@/components/Reviews/BookReviewsSection';





// Custom SVG Icons for each benefit
const WealthPathwaysIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
    <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="2" className="text-amber-500/30" />
    <path d="M20 44V32M20 32L12 24M20 32L28 24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500" />
    <path d="M44 44V32M44 32L36 24M44 32L52 24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500" />
    <path d="M32 44V20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-amber-500" />
    <circle cx="32" cy="16" r="4" fill="currentColor" className="text-amber-500" />
    <circle cx="12" cy="20" r="3" fill="currentColor" className="text-amber-500" />
    <circle cx="52" cy="20" r="3" fill="currentColor" className="text-amber-500" />
    <circle cx="28" cy="20" r="3" fill="currentColor" className="text-amber-500" />
    <circle cx="36" cy="20" r="3" fill="currentColor" className="text-amber-500" />
  </svg>
);

const PredictableIncomeIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
    <rect x="8" y="12" width="48" height="44" rx="4" stroke="currentColor" strokeWidth="2" className="text-amber-500/30" />
    <path d="M8 24H56" stroke="currentColor" strokeWidth="2" className="text-amber-500/30" />
    <rect x="16" y="16" width="8" height="4" rx="1" fill="currentColor" className="text-amber-500" />
    <circle cx="32" cy="40" r="10" stroke="currentColor" strokeWidth="3" className="text-amber-500" />
    <path d="M32 34V46M28 38H36M28 42H36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-amber-500" />
  </svg>
);

const LeverageIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
    <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="2" className="text-amber-500/30" />
    <path d="M16 40L32 24L48 40" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500" />
    <circle cx="16" cy="44" r="6" stroke="currentColor" strokeWidth="2" className="text-amber-500" />
    <circle cx="48" cy="44" r="10" stroke="currentColor" strokeWidth="2" className="text-amber-500" />
    <path d="M32 24V16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-amber-500" />
    <path d="M28 16H36" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-amber-500" />
  </svg>
);

const StoreOfValueIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
    <rect x="12" y="20" width="40" height="36" rx="4" stroke="currentColor" strokeWidth="3" className="text-amber-500" />
    <rect x="8" y="16" width="48" height="8" rx="2" stroke="currentColor" strokeWidth="2" className="text-amber-500/30" />
    <circle cx="32" cy="38" r="8" stroke="currentColor" strokeWidth="2" className="text-amber-500" />
    <circle cx="32" cy="38" r="3" fill="currentColor" className="text-amber-500" />
    <path d="M24 48H40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-amber-500/50" />
  </svg>
);

const AppreciationIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
    <path d="M8 52H56" stroke="currentColor" strokeWidth="2" className="text-amber-500/30" />
    <path d="M8 52V12" stroke="currentColor" strokeWidth="2" className="text-amber-500/30" />
    <path d="M12 44L24 32L36 38L52 18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500" />
    <path d="M44 18H52V26" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500" />
    <circle cx="12" cy="44" r="3" fill="currentColor" className="text-amber-500" />
    <circle cx="24" cy="32" r="3" fill="currentColor" className="text-amber-500" />
    <circle cx="36" cy="38" r="3" fill="currentColor" className="text-amber-500" />
  </svg>
);

const InflationProtectionIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
    <path d="M32 8L52 20V44L32 56L12 44V20L32 8Z" stroke="currentColor" strokeWidth="3" className="text-amber-500" />
    <path d="M32 20V36" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-amber-500" />
    <path d="M26 28L32 20L38 28" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500" />
    <circle cx="32" cy="44" r="3" fill="currentColor" className="text-amber-500" />
  </svg>
);

const TaxAdvantagesIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
    <rect x="12" y="8" width="40" height="48" rx="4" stroke="currentColor" strokeWidth="2" className="text-amber-500/30" />
    <path d="M20 20H44" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-amber-500/50" />
    <path d="M20 28H44" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-amber-500/50" />
    <path d="M20 36H32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-amber-500/50" />
    <circle cx="40" cy="42" r="10" stroke="currentColor" strokeWidth="3" className="text-amber-500" />
    <path d="M36 42L39 45L45 39" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500" />
  </svg>
);

// Benefit data
const benefits = [
  {
    icon: WealthPathwaysIcon,
    title: "Multiple Wealth Pathways",
    description: "Property gives you countless ways to build wealth regardless of your starting point. From buy-to-let to development, there's a strategy for every investor."
  },
  {
    icon: PredictableIncomeIcon,
    title: "Predictable Income",
    description: "Rental income provides strong, stable cash flow year after year. Build a reliable income stream that grows with your portfolio."
  },
  {
    icon: LeverageIcon,
    title: "Leverage",
    description: "Use other people's money to control high-value assets and grow faster. Property is one of the few asset classes where leverage is readily available."
  },
  {
    icon: StoreOfValueIcon,
    title: "Store of Value",
    description: "Property preserves wealth across generations. A tangible asset that stands the test of time and economic cycles."
  },
  {
    icon: AppreciationIcon,
    title: "Appreciation",
    description: "Property values rise over time, building long-term equity. Benefit from capital growth while your tenants pay down your mortgage."
  },
  {
    icon: InflationProtectionIcon,
    title: "Inflation Protection",
    description: "Property values and rents rise with inflation, keeping you ahead. Your investment naturally adjusts to maintain purchasing power."
  },
  {
    icon: TaxAdvantagesIcon,
    title: "Tax Advantages",
    description: "Property offers powerful tax efficiencies that help you retain more wealth. From allowable expenses to capital gains strategies."
  }
];

const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null);

  // Check for existing session and listen for auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChange((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchUserProfile(currentUser);
      } else {
        setUserProfile(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserProfile = async (currentUser: User) => {
    try {
      let profile = await getUserProfile(currentUser.uid);
      if (!profile) {
        await ensureUserProfile(currentUser);
        profile = await getUserProfile(currentUser.uid);
      }
      if (profile) {
        setUserProfile(profile);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };


  const handleFreeChapterSubmit = (email: string) => {
    if (email) {
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 4000);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSignInClick = () => {
    navigate('/auth?redirect=/');
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Unified Header */}
      <Header
        manageAuth={false}
        user={user}
        onSignInClick={handleSignInClick}
      />

      <main id="main-content">
      {/* Hero Section */}
      <section id="hero" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-16" aria-label="Hero">
        <div className="absolute inset-0">
          <img src="https://d64gsuwffb70l.cloudfront.net/6973e631705b2bc9fdb88a56_1769203320499_99a87976.jpg" alt="Luxury cityscape" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/70 to-slate-900" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 mb-6">
                <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                <span className="text-amber-400 text-sm font-medium">Your Path to Financial Freedom</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Build Wealth
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Through Property</span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Discover the seven powerful advantages that make property investment the cornerstone of lasting wealth. A practical, ethical guide to long-term property investing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/book-purchase"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-8 py-4 rounded-xl text-lg transition-all hover:shadow-xl hover:shadow-amber-500/30 hover:-translate-y-1 inline-flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                  Buy the Book
                </Link>
                <button onClick={() => scrollToSection('free-chapter')} className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl text-lg border border-white/20 transition-all hover:-translate-y-1 inline-flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Download a Free Chapter
                </button>
              </div>
            </div>
            <div className="flex-shrink-0 lg:flex-shrink-0">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-3xl blur-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                <div className="relative">
                  <img src="https://d64gsuwffb70l.cloudfront.net/6973e5e8bbb2ae01621a037e_1770743948016_23a5e51b.png" alt="Build Wealth Through Property - Book by Christopher Ifonlaja" className="w-72 sm:w-80 md:w-96 lg:w-[420px] rounded-xl shadow-2xl shadow-black/50 transform group-hover:-translate-y-2 group-hover:rotate-[-1deg] transition-all duration-500" />
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-gradient-to-t from-transparent to-amber-500/5 blur-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <button onClick={() => scrollToSection('benefits')} className="text-white/50 hover:text-white transition-colors">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
          </button>
        </div>
      </section>

      <TrustSignals />

      {/* Benefits Section */}
      <section id="benefits" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-amber-400 font-semibold text-sm uppercase tracking-wider">Why Property Investment</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-4 mb-6">Seven Pillars of Property Wealth</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Understanding these fundamental advantages will transform how you think about building wealth through real estate.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div key={index} className={`group relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 transition-all duration-300 cursor-pointer ${activeCard === index ? 'bg-slate-800 border-amber-500/50 shadow-xl shadow-amber-500/10 -translate-y-2' : 'hover:bg-slate-800 hover:border-slate-600 hover:-translate-y-1'} ${index === 6 ? 'md:col-span-2 lg:col-span-1 lg:col-start-2' : ''}`}
                  onClick={() => setActiveCard(activeCard === index ? null : index)} onMouseEnter={() => setActiveCard(index)} onMouseLeave={() => setActiveCard(null)}>
                  <div className="absolute top-4 right-4 text-6xl font-bold text-slate-700/30 group-hover:text-amber-500/20 transition-colors">{String(index + 1).padStart(2, '0')}</div>
                  <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300"><IconComponent /></div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">{benefit.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div id="about-book">
        <WhyThisBookExists />
        <WhoThisBookIsFor />
        <WhatYoullLearn />
      </div>
      <FrameworkSection />

      {/* Calculator Promo */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-800/80 to-slate-800/40 border border-slate-700/50 rounded-3xl p-8 sm:p-12 md:p-16">
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative flex flex-col lg:flex-row items-center gap-10">
              <div className="flex-1 text-center lg:text-left">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Run the Numbers on Your<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600"> Next Investment</span></h2>
                <p className="text-slate-300 text-lg mb-6 leading-relaxed">Use our interactive property investment calculator to model mortgage payments, rental yields, ROI, and see 25-year wealth projections.</p>
                <Link to="/calculator" className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-8 py-4 rounded-xl text-lg transition-all hover:shadow-xl hover:shadow-amber-500/30 hover:-translate-y-1 inline-flex items-center justify-center gap-2">Try the Calculator</Link>
              </div>
              <div className="flex-shrink-0 w-full lg:w-auto">
                <div className="bg-slate-900/80 border border-slate-700/50 rounded-2xl p-6 max-w-sm mx-auto lg:mx-0">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between"><span className="text-slate-400 text-sm">Monthly Payment</span><span className="text-amber-400 font-bold text-lg">£943</span></div>
                    <div className="flex items-center justify-between"><span className="text-slate-400 text-sm">Rental Yield</span><span className="text-emerald-400 font-bold text-lg">5.76%</span></div>
                    <div className="flex items-center justify-between"><span className="text-slate-400 text-sm">Monthly Cash Flow</span><span className="text-emerald-400 font-bold text-lg">+£257</span></div>
                    <div className="h-px bg-slate-700/50" />
                    <div className="flex items-center justify-between"><span className="text-slate-400 text-sm">25-Year Equity</span><span className="text-white font-bold text-lg">£587K</span></div>
                    <div className="flex items-end gap-1 h-16 pt-2">
                      {[15, 22, 28, 35, 40, 48, 55, 60, 68, 75, 82, 90].map((h, i) => (<div key={i} className="flex-1 bg-gradient-to-t from-amber-500/40 to-amber-400/80 rounded-t-sm" style={{ height: `${h}%` }} />))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      <BookReviewsSection user={user} userProfile={userProfile} onSignInClick={handleSignInClick} />
      <AboutAuthorSection />
      <GetBookSection />
      <FreeResourceSection onSubmit={handleFreeChapterSubmit} isSubmitted={isSubmitted} />
      <FAQSection />
      <MasterclassSection />
      <FinalCTASection />
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;

