import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';


interface LegalPageLayoutProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

const LegalPageLayout: React.FC<LegalPageLayoutProps> = ({ title, lastUpdated, children }) => {
  return (
    <div className="min-h-screen bg-slate-900">
      <Header />


      {/* Header */}
      <section className="relative pt-24 pb-12 sm:pt-32 sm:pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-slate-800/80 border border-slate-700/50 rounded-full px-4 py-2 mb-6">
            <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-slate-300 text-sm font-medium">Legal Document</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">{title}</h1>
          <p className="text-slate-400 text-lg">Last updated: {lastUpdated}</p>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800/30 border border-slate-700/40 rounded-2xl p-6 sm:p-10 md:p-12">
            <div className="legal-content prose prose-invert prose-slate max-w-none
              [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:pb-3 [&_h2]:border-b [&_h2]:border-slate-700/50
              [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-white [&_h3]:mt-6 [&_h3]:mb-3
              [&_p]:text-slate-300 [&_p]:leading-relaxed [&_p]:mb-4
              [&_ul]:space-y-2 [&_ul]:mb-6 [&_ul]:ml-0
              [&_ol]:space-y-2 [&_ol]:mb-6 [&_ol]:ml-0
              [&_li]:text-slate-300 [&_li]:leading-relaxed [&_li]:pl-2
              [&_a]:text-amber-400 [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-amber-300
              [&_strong]:text-white [&_strong]:font-semibold
              [&_table]:w-full [&_table]:border-collapse [&_table]:mb-6
              [&_th]:text-left [&_th]:text-white [&_th]:font-semibold [&_th]:p-3 [&_th]:border-b [&_th]:border-slate-700
              [&_td]:text-slate-300 [&_td]:p-3 [&_td]:border-b [&_td]:border-slate-700/50
            ">
              {children}
            </div>
          </div>

          {/* Cross-links to other legal pages */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              to="/privacy"
              className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-5 hover:border-amber-500/30 hover:bg-slate-800/60 transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <span className="text-white font-semibold group-hover:text-amber-400 transition-colors">Privacy Policy</span>
              </div>
              <p className="text-slate-400 text-sm">How we collect, use, and protect your data.</p>
            </Link>
            <Link
              to="/terms"
              className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-5 hover:border-amber-500/30 hover:bg-slate-800/60 transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="text-white font-semibold group-hover:text-amber-400 transition-colors">Terms of Service</span>
              </div>
              <p className="text-slate-400 text-sm">Terms governing use of our platform and services.</p>
            </Link>
            <Link
              to="/refund"
              className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-5 hover:border-amber-500/30 hover:bg-slate-800/60 transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                </div>
                <span className="text-white font-semibold group-hover:text-amber-400 transition-colors">Refund Policy</span>
              </div>
              <p className="text-slate-400 text-sm">Our refund and cancellation policy for courses and products.</p>
            </Link>
          </div>
        </div>
      </section>

      <Footer compact />

    </div>
  );
};

export default LegalPageLayout;
