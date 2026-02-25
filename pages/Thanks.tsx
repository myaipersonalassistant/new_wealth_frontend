import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';


const Thanks: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900">
      <Header />


      {/* Main Content */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16">
        {/* Background decoration */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-green-500/3 rounded-full blur-3xl" />

        <div className="relative max-w-2xl mx-auto mt-16 text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center mx-auto animate-bounce">
              <svg className="w-12 h-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            You're In!
          </h1>

          <p className="text-xl text-slate-300 mb-8 leading-relaxed">
            Your <span className="text-amber-400 font-semibold">Property Investor Starter Pack</span> is on its way to your inbox. Check your email in the next few minutes.
          </p>

          {/* What to expect */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 mb-10 text-left">
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              What happens next:
            </h3>
            <div className="space-y-4">
              {[
                {
                  step: '1',
                  title: 'Check your inbox',
                  desc: 'Your Starter Pack download link will arrive in the next few minutes.',
                },
                {
                  step: '2',
                  title: 'Access your Starter Resources',
                  desc: 'Videos, guides, spreadsheets, and more — all in your dashboard. Click "Go to Starter Resources" above to get started.',
                },

                {
                  step: '3',
                  title: 'Start with the Deal Analyser',
                  desc: 'Open it up and run the numbers on a property you\'ve been looking at.',
                },
                {
                  step: '4',
                  title: 'Watch for my emails',
                  desc: 'Over the next few days, I\'ll send short, practical guidance to help you take the next steps. No hype — just clarity.',
                },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-amber-400 font-bold text-sm">{item.step}</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{item.title}</h4>
                    <p className="text-slate-400 text-sm mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Didn't receive it? */}
          <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-5 mb-10">
            <p className="text-slate-400 text-sm">
              <span className="text-white font-medium">Didn't receive it?</span> Check your spam/promotions folder. If it's not there, email us and we'll sort it out.
            </p>
          </div>

          {/* Access Starter Resources - primary CTA */}
          <div className="mb-10 p-6 bg-gradient-to-r from-amber-500/10 to-indigo-500/10 border border-amber-500/20 rounded-2xl">
            <h3 className="text-white font-bold text-lg mb-2">Your Starter Resources Are Ready</h3>
            <p className="text-slate-300 text-sm mb-4">
              Access all your free resources — videos, guides, spreadsheets, and more — in your dashboard.
            </p>
            <Link
              to="/auth?redirect=/dashboard?tab=starter-pack"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-900 font-semibold rounded-xl transition-all shadow-lg hover:shadow-amber-500/25"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Go to Starter Resources
            </Link>
            <p className="text-slate-500 text-xs mt-3">Sign in or create an account to access your dashboard.</p>
          </div>

          {/* Next Steps */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg">While you wait...</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
              <Link
                to="/"
                className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-6 py-3.5 rounded-xl border border-slate-700 transition-all hover:border-amber-500/30 inline-flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Explore the Book
              </Link>
              <Link
                to="/calculator"
                className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-6 py-3.5 rounded-xl border border-slate-700 transition-all hover:border-amber-500/30 inline-flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Try the Calculator
              </Link>
              <Link
                to="/course"
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-semibold px-6 py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-indigo-500/20 inline-flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                View the Masterclass
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer compact />
    </div>

  );
};

export default Thanks;
