import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getCurrentUser, getUserProfile } from '@/lib/firebaseAuth';
import { subscribeEmail } from '@/lib/emailSubscription';

const SESSION_EMAIL = 'bwtp_checkout_email';
const SESSION_NAME = 'bwtp_checkout_name';

const Start: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [prefilled, setPrefilled] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);

  // Pre-fill from signed-in user or sessionStorage
  useEffect(() => {
    if (profileLoaded) return;
    const loadPrefill = async () => {
      const user = getCurrentUser();
      if (user) {
        try {
          const profile = await getUserProfile(user.uid);
          if (profile?.email || profile?.full_name) {
            setFirstName(profile.full_name?.split(' ')[0] || '');
            setEmail(profile.email || '');
            setPrefilled(true);
            setProfileLoaded(true);
            return;
          }
        } catch {
          /* fall through to sessionStorage */
        }
      }
      try {
        const storedEmail = sessionStorage.getItem(SESSION_EMAIL);
        const storedName = sessionStorage.getItem(SESSION_NAME);
        if (storedName || storedEmail) {
          if (storedName) setFirstName(storedName.trim());
          if (storedEmail) setEmail(storedEmail.trim().toLowerCase());
          setPrefilled(true);
        }
      } catch {
        /* ignore */
      }
      setProfileLoaded(true);
    };
    loadPrefill();
  }, [profileLoaded]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimEmail = email.trim().toLowerCase();
    const trimFirst = firstName.trim();
    if (!trimEmail || !trimFirst) return;
    if (!trimEmail.includes('@')) {
      setMessage({ text: 'Please enter a valid email address.', type: 'error' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const result = await subscribeEmail(trimEmail, 'starter-pack', {
        firstName: trimFirst,
        phone: phone.trim() || undefined,
        referrer: typeof document !== 'undefined' ? document.referrer || window.location.href : undefined,
      });

      if (result.success) {
        setMessage({ text: 'Success! Check your inbox for your Starter Pack.', type: 'success' });
        setTimeout(() => {
          window.location.href = '/thanks';
        }, 1000);
      } else {
        setMessage({ text: result.error || 'Something went wrong. Please try again.', type: 'error' });
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Subscribe error:', err);
      setMessage({ text: 'Something went wrong. Please try again.', type: 'error' });
      setIsLoading(false);
    }
  };

  const starterPackItems = [
    {
      icon: (
        <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: 'Free Chapter',
      description: 'Read the opening chapter of Build Wealth Through Property and discover the foundational principles',
    },
    {
      icon: (
        <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Practical Checklist',
      description: '7 Questions to Ask Before Buying Your First Property — a practical guide to get you started right',
    },
    {
      icon: (
        <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Deal Analyser Spreadsheet',
      description: 'Quickly work out whether a property actually makes financial sense',
    },
    {
      icon: (
        <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      title: 'Viewing Checklist',
      description: 'Know exactly what to look for when inspecting a property',
    },
    {
      icon: (
        <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      title: 'Mortgage Readiness Guide',
      description: 'Prepare yourself to be finance-ready',
    },
    {
      icon: (
        <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'First-Time Investor Checklist',
      description: 'A step-by-step action plan to keep you on track',
    },
  ];



  const whoItsFor = [
    'First-time investors',
    'Aspiring buy-to-let landlords',
    'Readers of the book',
    'Busy professionals who want a structured way to start',
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />


      {/* Hero Section */}
      <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/3 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 mb-6">
            <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="text-amber-400 text-sm font-medium">100% Free — No Card Required</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Free Property Investor
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
              Starter Pack
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Everything you need to move from reading about property to confidently analysing real deals — step by step.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            {/* Left Column - Content */}
            <div className="flex-1">
              {/* Intro */}
              <div className="mb-12">
                <p className="text-lg text-slate-300 leading-relaxed mb-4">
                  You've read the book. Now it's time to take action.
                </p>
                <p className="text-lg text-slate-300 leading-relaxed mb-4">
                  Inside <span className="text-white font-medium">Build Wealth Through Property</span>, I explain the principles that make property one of the most reliable ways to build long-term financial security.
                </p>
                <p className="text-lg text-slate-300 leading-relaxed">
                  This free Starter Pack gives you practical tools to begin applying those principles immediately. No jargon. No guesswork. Just simple, proven resources you can start using today.
                </p>
              </div>

              {/* What You'll Get */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
                    <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  What You'll Get
                </h2>
                <div className="space-y-4">
                  {starterPackItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 hover:border-amber-500/20 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-lg">{item.title}</h3>
                        <p className="text-slate-400 mt-1">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Who It's For */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
                    <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  Who It's For
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {whoItsFor.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-amber-500/15 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3.5 h-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-slate-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* About the Author */}
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 sm:p-8">
                <div className="flex items-start gap-5">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center flex-shrink-0">
                    <svg className="w-8 h-8 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">About Chris Ifonlaja</h3>
                    <p className="text-amber-400 text-sm font-medium mb-3">Author of Build Wealth Through Property: 7 Reasons Why</p>
                    <p className="text-slate-400 leading-relaxed">
                      Practical, disciplined approach to property investing and risk management. Every principle in the book has been tested in the real world. Known for a calm, clear, and practical approach that cuts through the noise of the property industry.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="lg:w-[420px] flex-shrink-0">
              <div className="sticky top-24">
                <div className="bg-gradient-to-br from-slate-800 to-slate-800/80 border border-slate-700/50 rounded-2xl p-8 shadow-2xl shadow-black/20">
                  {/* Form Header */}
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Get Instant Access</h3>
                    <p className="text-slate-400">It's Free</p>
                    {prefilled && (
                      <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        We've filled this in for you — one tap to go
                      </div>
                    )}
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-slate-300 mb-1.5">
                        First Name <span className="text-amber-400">*</span>
                      </label>
                      <input
                        id="firstName"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Your first name"
                        className="w-full px-4 py-3.5 rounded-xl bg-slate-900/60 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">
                        Email Address <span className="text-amber-400">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-4 py-3.5 rounded-xl bg-slate-900/60 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-1.5">
                        Phone <span className="text-slate-500">(Optional)</span>
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+44 7XXX XXXXXX"
                        className="w-full px-4 py-3.5 rounded-xl bg-slate-900/60 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                        disabled={isLoading}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-8 py-4 rounded-xl text-lg transition-all hover:shadow-xl hover:shadow-amber-500/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Download the Starter Pack
                        </>
                      )}
                    </button>

                    {message && (
                      <div className={`text-center font-medium text-sm ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                        {message.text}
                      </div>
                    )}

                    <p className="text-slate-500 text-xs text-center leading-relaxed">
                      We respect your privacy. No spam. Unsubscribe anytime.
                    </p>
                  </form>

                  {/* Social proof */}
                  <div className="mt-6 pt-6 border-t border-slate-700/50">
                    <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
                      <div className="flex -space-x-2">
                        {['C', 'Y', 'E', 'M'].map((letter, i) => (
                          <div
                            key={i}
                            className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-900 font-bold text-[10px] border-2 border-slate-800"
                          >
                            {letter}
                          </div>
                        ))}
                      </div>
                      <span>Join 500+ readers taking action</span>
                    </div>
                  </div>
                </div>

                {/* Final CTA below form */}
                <div className="mt-6 text-center">
                  <p className="text-slate-400 text-sm">
                    Download the Free Starter Pack and start analysing real deals today.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer compact />

    </div>
  );
};

export default Start;
