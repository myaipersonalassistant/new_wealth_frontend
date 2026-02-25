import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Visual Framework Section
export const FrameworkSection: React.FC = () => (
  <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
    <div className="max-w-4xl mx-auto text-center">
      <span className="text-amber-400 font-semibold text-sm uppercase tracking-wider">The Framework</span>
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
        How Property Builds Income and Long-Term Growth
      </h2>
      <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-4 leading-relaxed">
        The book explains <span className="text-white font-medium">why</span> property works as a wealth-building vehicle.
      </p>
      <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
        This framework shows <span className="text-white font-medium">how</span>.
      </p>

      {/* Framework Visual Placeholder */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-8 sm:p-12 mb-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent" />
        <div className="relative">
          {/* Visual Framework Diagram */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-slate-900/60 border border-slate-700/40 rounded-xl p-6">
              <div className="w-12 h-12 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-white font-semibold mb-2">Rental Income</h4>
              <p className="text-slate-400 text-sm">Consistent cash flow that covers costs and builds reserves</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-700/40 rounded-xl p-6">
              <div className="w-12 h-12 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h4 className="text-white font-semibold mb-2">Capital Growth</h4>
              <p className="text-slate-400 text-sm">Long-term appreciation that compounds your equity over decades</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-700/40 rounded-xl p-6">
              <div className="w-12 h-12 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <h4 className="text-white font-semibold mb-2">Leverage</h4>
              <p className="text-slate-400 text-sm">Using other people's money responsibly to amplify your returns</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-700/40 rounded-xl p-6">
              <div className="w-12 h-12 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="text-white font-semibold mb-2">Wealth Protection</h4>
              <p className="text-slate-400 text-sm">Inflation hedging and tax efficiency that preserves your gains</p>
            </div>
          </div>

          {/* Connecting visual */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-500/30" />
            <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-500/30" />
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5">
            <p className="text-amber-300 font-semibold text-lg">Long-Term Wealth</p>
            <p className="text-slate-400 text-sm mt-1">Patience + Discipline + Understanding = Compounding Results</p>
          </div>
        </div>
      </div>

      <button
        onClick={() => window.open('#framework', '_self')}
        className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-8 py-4 rounded-xl text-lg transition-all hover:shadow-xl hover:shadow-amber-500/30 hover:-translate-y-0.5 inline-flex items-center gap-2"
      >
        Explore the Framework
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </button>
    </div>
  </section>
);



// About the Author Section
export const AboutAuthorSection: React.FC = () => (
  <section id="author" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <span className="text-amber-400 font-semibold text-sm uppercase tracking-wider">The Author</span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-4">
          About Chris Ifonlaja
        </h2>
      </div>

      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-8 sm:p-12">
        <div className="flex flex-col md:flex-row gap-10 items-center">
          {/* Author Avatar */}
          <div className="flex-shrink-0">
            <div className="w-56 h-56 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center overflow-hidden">
              <img
                src="profile.jpg"
                alt="Chris Ifonlaja"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Author Info */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-white mb-2">Chris Ifonlaja</h3>
            <p className="text-amber-400 font-medium mb-6">Property Investor, Speaker & Educator</p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3.5 h-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Focused on <span className="text-white font-medium">long-term wealth building</span> and responsible decision-making in property investment.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3.5 h-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Writes from <span className="text-white font-medium">experience, not theory</span> — every principle in the book has been tested in the real world.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3.5 h-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Known for a <span className="text-white font-medium">calm, clear, and practical</span> approach that cuts through the noise of the property industry.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// Get the Book Section
export const GetBookSection: React.FC = () => (

  <section id="get-book" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <span className="text-amber-400 font-semibold text-sm uppercase tracking-wider">Get Your Copy</span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
          Get the Book
        </h2>
        <p className="text-slate-300 text-lg max-w-xl mx-auto">
          Choose the option that works best for you.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        {/* Book Cover */}
        <div className="flex-shrink-0">
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-br from-amber-500/15 to-amber-600/5 rounded-3xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
            <img
              src="https://d64gsuwffb70l.cloudfront.net/6973e5e8bbb2ae01621a037e_1770743948016_23a5e51b.png"
              alt="Build Wealth Through Property - Book by Christopher Ifonlaja"
              className="relative w-64 sm:w-72 md:w-80 rounded-xl shadow-2xl shadow-black/40 transform group-hover:-translate-y-2 transition-all duration-500"
            />
          </div>
        </div>

        {/* Purchase Options */}
        <div className="flex-1 w-full">
          <div className="space-y-5">
            {/* Buy Direct - Stripe */}
            <Link
              to="/book-purchase"
                className="group bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-bold px-8 py-6 rounded-xl transition-all hover:shadow-xl hover:shadow-amber-500/30 hover:-translate-y-1 flex items-center gap-5 w-full text-left relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">
                  SECURE CHECKOUT
                </div>
                <div className="w-14 h-14 bg-slate-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div>
                  <span className="text-xl block">Buy Direct — £19.99</span>

                  <span className="text-slate-900/70 text-sm font-medium">Secure payment via Stripe</span>
                </div>
                <svg className="w-6 h-6 ml-auto flex-shrink-0 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
            </Link>

            <a
              href=""
              className="group bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-amber-500/30 font-bold px-8 py-6 rounded-xl transition-all hover:shadow-xl hover:-translate-y-1 flex items-center gap-5 w-full"
            >
              <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="text-left">
                <span className="text-xl block">Buy on Amazon</span>
                <span className="text-slate-400 text-sm font-medium">Paperback & Kindle editions available</span>
              </div>
              <svg className="w-6 h-6 ml-auto flex-shrink-0 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>

            <Link
              to="/book-purchase"
              className="group bg-slate-800 hover:bg-slate-700 text-white font-bold px-8 py-6 rounded-xl border border-slate-700 transition-all hover:border-amber-500/30 hover:-translate-y-1 flex items-center gap-5 w-full"
            >
              <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="text-left">
                <span className="text-xl block">Bulk Orders / Organisations</span>
                <span className="text-slate-400 text-sm font-medium">Discounts for teams and events</span>
              </div>
              <svg className="w-6 h-6 ml-auto flex-shrink-0 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>

            <Link
              to="/foundation"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="group bg-slate-800 hover:bg-slate-700 text-white font-bold px-8 py-6 rounded-xl border border-slate-700 transition-all hover:border-amber-500/30 hover:-translate-y-1 flex items-center gap-5 w-full"
            >
              <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div className="text-left flex-1">
                <span className="text-xl block">Foundation Edition — £50</span>
                <span className="text-slate-400 text-sm font-medium">Limited signed copy supporting our building vision</span>
              </div>
              <svg className="w-6 h-6 ml-auto flex-shrink-0 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>


          </div>
        </div>
      </div>
    </div>
  </section>
);




// Free Resource Section
interface FreeResourceProps {
  onSubmit: (email: string) => void;
  isSubmitted: boolean;
}

export const FreeResourceSection: React.FC<FreeResourceProps> = ({ onSubmit, isSubmitted }) => {
  const [resourceEmail, setResourceEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resourceEmail) return;

    setIsLoading(true);
    setMessage(null);

    try {
      const { subscribeEmail } = await import('@/lib/emailSubscription');
      const result = await subscribeEmail(resourceEmail.trim().toLowerCase(), 'free-chapter', {
        referrer: window.location.href,
      });

      if (!result.success) {
        setMessage({ text: result.error || 'Something went wrong. Please try again.', type: 'error' });
      } else {
        setMessage({ text: result.message || 'Thank you! Check your inbox shortly.', type: 'success' });
        setResourceEmail('');
        onSubmit(resourceEmail);
      }
    } catch (err) {
      setMessage({ text: 'Something went wrong. Please try again.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="free-chapter" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
      <div className="max-w-3xl mx-auto text-center">
        <span className="text-amber-400 font-semibold text-sm uppercase tracking-wider">Free Resources</span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
          Start with clarity — free
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12 max-w-2xl mx-auto">
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 text-left">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h4 className="text-white font-semibold text-lg mb-2">Free Chapter</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Read the opening chapter and discover the foundational principles of property wealth building.
            </p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 text-left">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h4 className="text-white font-semibold text-lg mb-2">Practical Checklist</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              "7 Questions to Ask Before Buying Your First Property" — a practical guide to get you started right.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto mb-4">
          <input
            type="email"
            value={resourceEmail}
            onChange={(e) => setResourceEmail(e.target.value)}
            placeholder="Enter your email address"
            className="flex-1 px-6 py-4 rounded-xl bg-slate-900/50 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
            required
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-8 py-4 rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/25 whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Sending...
              </>
            ) : (
              'Get the Free Chapter'
            )}
          </button>
        </form>

        {message && (
          <div className={`mb-4 font-medium animate-fade-in ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
            {message.text}
          </div>
        )}

        {isSubmitted && !message && (
          <div className="mb-4 text-green-400 font-medium animate-fade-in">
            Thank you! Check your inbox for your free chapter and checklist.
          </div>
        )}

        <p className="text-slate-500 text-sm">
          No spam. Just clarity.
        </p>
      </div>
    </section>
  );
};


// FAQ Section
export const FAQSection: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: 'Is this book UK-specific?',
      answer: 'The book is primarily UK-focused, drawing on UK property markets, regulations, and tax structures. However, the core principles of long-term property wealth building — leverage, rental income, appreciation, and disciplined investing — apply broadly across markets worldwide.',
    },
    {
      question: 'Do I need money to start?',
      answer: 'No — understanding comes first. This book is about building the knowledge foundation before you invest a single pound. Many of the most costly mistakes in property come from acting before understanding. Start with clarity, and the financial planning will follow.',
    },
    {
      question: 'Is this technical?',
      answer: 'The book is written to be accessible to beginners, but it doesn\'t shy away from real technical and strategic concepts. You\'ll find clear explanations of leverage, tax efficiency, market cycles, and risk management — all presented in plain language with practical examples.',
    },
  ];

  return (
    <section id="faq" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-amber-400 font-semibold text-sm uppercase tracking-wider">Common Questions</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-4">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden transition-colors hover:border-slate-600"
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full px-8 py-6 text-left flex items-center justify-between gap-4"
              >
                <span className="text-white font-semibold text-lg">{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-amber-400 flex-shrink-0 transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${openFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="px-8 pb-6">
                  <p className="text-slate-300 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Final CTA Section
export const FinalCTASection: React.FC = () => (
  <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 to-slate-800">
    <div className="max-w-4xl mx-auto text-center">
      <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-3xl p-8 sm:p-12 md:p-16">
        {/* Book Cover - small floating version */}
        <div className="mb-10">
          <img
            src="https://d64gsuwffb70l.cloudfront.net/6973e5e8bbb2ae01621a037e_1770743948016_23a5e51b.png"
            alt="Build Wealth Through Property"
            className="w-40 sm:w-48 mx-auto rounded-lg shadow-xl shadow-black/30 hover:-translate-y-1 transition-transform duration-300"
          />
        </div>

        <p className="text-xl sm:text-2xl md:text-3xl text-slate-200 leading-relaxed mb-10 font-light">
          Property rewards <span className="text-amber-400 font-medium">patience</span>, <span className="text-amber-400 font-medium">discipline</span>, and <span className="text-amber-400 font-medium">understanding</span>.
        </p>

        <Link
          to="/book-purchase"
          className="inline-flex items-center gap-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-10 py-5 rounded-xl text-xl transition-all hover:shadow-xl hover:shadow-amber-500/30 hover:-translate-y-1"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          Buy the Book
        </Link>
      </div>
    </div>
  </section>
);



// Course Teaser Section (Both Courses)
export const MasterclassSection: React.FC = () => (
  <section id="masterclass" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <span className="text-amber-400 font-semibold text-sm uppercase tracking-wider">Continue Your Journey</span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
          Ready to Take
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-amber-400"> Action?</span>
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Two courses designed for different stages of your property investment journey. Choose the one that fits where you are right now.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* From Book to Buy-to-Let */}
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900/30 via-slate-800/80 to-purple-900/20 border border-indigo-500/20 rounded-2xl p-8">
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full px-3 py-1 mb-4">
              <span className="text-indigo-300 text-xs font-medium">Beginner Course</span>
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">
              From Book to
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400"> Buy-to-Let</span>
            </h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              A clear, practical path from book concepts to buying your first buy-to-let property. 6 modules, 18 lessons, step by step.
            </p>

            <div className="space-y-2 mb-6">
              {[
                '6 core modules + bonus content',
                'Templates & checklists included',
                'Deal walkthroughs + Q&A',
                'Lifetime access & updates',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-indigo-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-300 text-sm">{item}</span>
                </div>
              ))}
            </div>

            <div className="flex items-baseline gap-2 mb-5">
              <span className="text-slate-500 line-through text-lg">£147</span>
              <span className="text-3xl font-bold text-white">£97</span>
              <span className="text-amber-400 text-xs font-medium">Launch Price</span>
            </div>

            <Link
              to="/course"
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold px-6 py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-indigo-500/20 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Explore the Course
            </Link>
          </div>
        </div>

        {/* Property Investor Masterclass */}
        <div className="relative overflow-hidden bg-gradient-to-br from-amber-900/20 via-slate-800/80 to-amber-900/10 border border-amber-500/20 rounded-2xl p-8">
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute -top-2 right-6">
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-bold px-4 py-1 rounded-b-lg text-xs shadow-lg">
              ADVANCED
            </div>
          </div>
          <div className="relative">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-3 py-1 mb-4">
              <span className="text-amber-300 text-xs font-medium">Masterclass</span>
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">
              Property Investor
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600"> Masterclass</span>
            </h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              The comprehensive programme for scaling your portfolio. Advanced strategies, tax planning, and professional-grade analysis.
            </p>

            <div className="space-y-2 mb-6">
              {[
                '8 in-depth modules (24+ lessons)',
                'Advanced financial models',
                'Portfolio planning templates',
                'Tax & legal strategy guides',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-amber-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-300 text-sm">{item}</span>
                </div>
              ))}
            </div>

            <div className="flex items-baseline gap-2 mb-5">
              <span className="text-3xl font-bold text-white">£297</span>
              <span className="text-slate-500 text-sm">one-time</span>
            </div>

            <Link
              to="/masterclass"
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-bold px-6 py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              Explore the Masterclass
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom note */}
      <div className="mt-8 text-center">
        <p className="text-slate-500 text-sm">
          Both courses include lifetime access, 30-day money-back guarantee, and are hosted on Systeme.io.
        </p>
      </div>
    </div>
  </section>
);
