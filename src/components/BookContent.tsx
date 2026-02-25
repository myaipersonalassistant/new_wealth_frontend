import React from 'react';

// Check icon for trust signals
const CheckIcon = () => (
  <svg className="w-5 h-5 text-amber-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon = () => (
  <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// Trust Signals Section
export const TrustSignals: React.FC = () => (
  <section className="py-8 bg-slate-800/60 border-y border-slate-700/50">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 md:gap-16">
        {['Practical', 'Ethical', 'Long-Term', 'Beginner-Friendly', 'Case Studies'].map((signal) => (
          <div key={signal} className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-slate-200 font-medium text-sm sm:text-base tracking-wide">{signal}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// Why This Book Exists Section
export const WhyThisBookExists: React.FC = () => (
  <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
    <div className="max-w-3xl mx-auto text-center">
      <span className="text-amber-400 font-semibold text-sm uppercase tracking-wider">The Purpose</span>
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-4 mb-12">
        Why This Book Exists
      </h2>

      <div className="space-y-6 mb-12">
        <p className="text-xl sm:text-2xl text-slate-300 font-light leading-relaxed">
          Markets rise and fall.
        </p>
        <p className="text-xl sm:text-2xl text-slate-300 font-light leading-relaxed">
          Policies change.
        </p>
        <p className="text-xl sm:text-2xl text-slate-300 font-light leading-relaxed">
          Economies cycle.
        </p>
      </div>

      <div className="w-16 h-px bg-amber-500/40 mx-auto mb-12" />

      <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl mx-auto">
        Yet, over long periods of time, property has quietly built wealth for people willing to think long-term and act with discipline.
      </p>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 max-w-2xl mx-auto">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-slate-300 text-left leading-relaxed">
            This book is <span className="text-white font-medium">not about hype or shortcuts</span>. It's about structural understanding and responsibility — giving you the knowledge to make informed decisions about property as a long-term wealth-building tool.
          </p>
        </div>
      </div>
    </div>
  </section>
);

// Who This Book Is For Section
export const WhoThisBookIsFor: React.FC = () => (
  <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <span className="text-amber-400 font-semibold text-sm uppercase tracking-wider">The Reader</span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-4">
          Who This Book Is For
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* For You */}
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-8 hover:border-amber-500/30 transition-colors">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white">This book is for you if:</h3>
          </div>
          <ul className="space-y-5">
            {[
              'You want to understand property before you buy',
              'You\'re tired of "get rich quick" narratives',
              'You value stability, income, and long-term thinking',
              'You want clarity, not confusion',
              'You want to build your portfolio',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckIcon />
                <span className="text-slate-300 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Not For */}
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-8 hover:border-red-500/20 transition-colors">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white">This book is not for:</h3>
          </div>
          <ul className="space-y-5">
            {[
              'Speculators chasing overnight gains',
              'People looking for zero-effort wealth',
              'Anyone unwilling to learn or plan long-term',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <XIcon />
                <span className="text-slate-400 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
);

// What You'll Learn Section
export const WhatYoullLearn: React.FC = () => (
  <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <span className="text-amber-400 font-semibold text-sm uppercase tracking-wider">Inside the Book</span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-4">
          What You'll Learn
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl mx-auto mb-12">
        {[
          { title: 'Why property behaves differently from other assets', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
          { title: 'Inflation and property ownership', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
          { title: 'Responsible use of leverage', icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3' },
          { title: 'Rental income as stability', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
          { title: 'Compounding over time', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
          { title: 'Real risks investors overlook', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
          { title: 'Ethical responsibilities of ownership', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
          { title: 'Property as an investment vs Property as a Business', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
          { title: 'Investor Archetype', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-4 bg-slate-800/40 border border-slate-700/40 rounded-xl p-5 hover:border-amber-500/20 transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-500/20 transition-colors">
              <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
              </svg>
            </div>
            <span className="text-slate-200 leading-relaxed pt-2">{item.title}</span>
          </div>
        ))}
      </div>

      <div className="text-center">
        <div className="inline-block bg-slate-800/60 border border-slate-700/50 rounded-2xl px-8 py-5">
          <p className="text-slate-300 text-lg italic">
            This book focuses on <span className="text-amber-400 font-medium not-italic">understanding first</span>, not rushing into deals.
          </p>
        </div>
      </div>
    </div>
  </section>
);
