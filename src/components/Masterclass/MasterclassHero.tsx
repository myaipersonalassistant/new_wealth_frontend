import React, { useState } from 'react';

const MasterclassHero: React.FC = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  return (
    <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-900" />
      <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-amber-500/5 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

      <div className="relative max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 mb-6">
              <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span className="text-amber-300 text-sm font-medium">Masterclass — Lifetime Access</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Property Investor
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
                Masterclass
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 mb-4 leading-relaxed max-w-xl mx-auto lg:mx-0">
              The comprehensive, deep-dive programme for serious property investors who want to build a portfolio with confidence.
            </p>
            <p className="text-base text-slate-400 mb-6 max-w-xl mx-auto lg:mx-0">
              Go beyond the basics. Master advanced strategies, portfolio planning, tax structures, and the mindset that separates successful investors from the rest.
            </p>

            <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-8">
              {[
                { label: '8 In-Depth Modules', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
                { label: '24+ Lessons', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
                { label: 'Advanced Strategies', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
                { label: 'Lifetime Access', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 bg-slate-800/60 border border-slate-700/50 rounded-full px-4 py-2">
                  <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                  </svg>
                  <span className="text-slate-300 text-sm font-medium">{item.label}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="#pricing"
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-bold px-8 py-4 rounded-xl text-lg transition-all hover:shadow-xl hover:shadow-amber-500/30 hover:-translate-y-1 inline-flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Enrol Now — £297
              </a>
              <a
                href="#curriculum"
                className="bg-white/5 hover:bg-white/10 text-white font-semibold px-8 py-4 rounded-xl text-lg border border-white/10 transition-all hover:-translate-y-1 inline-flex items-center justify-center gap-2"
              >
                View Curriculum
              </a>
            </div>
          </div>

          {/* Right - Video Preview */}
          <div className="flex-shrink-0 w-full lg:w-[480px]">
            <div className="relative group">
              {/* Glow */}
              <div className="absolute -inset-3 bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-3xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity" />

              <div
                className="relative bg-slate-800/80 border border-amber-500/20 rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => setIsVideoPlaying(!isVideoPlaying)}
              >
                {!isVideoPlaying ? (
                  <div className="aspect-video bg-gradient-to-br from-amber-900/40 to-slate-900/60 flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.08),transparent_70%)]" />
                    <div className="absolute top-6 left-6 text-left">
                      <p className="text-amber-300 text-xs font-medium uppercase tracking-wider">Preview</p>
                      <p className="text-white font-bold text-lg">Property Investor Masterclass</p>
                      <p className="text-slate-400 text-sm">Advanced Programme</p>
                    </div>

                    {/* Play button */}
                    <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300">
                      <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>

                    {/* Duration badge */}
                    <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5">
                      <span className="text-white text-sm font-medium">3:45</span>
                    </div>

                    {/* Module preview thumbnails */}
                    <div className="absolute bottom-4 left-4 flex gap-1.5">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                        <div key={n} className="w-8 h-6 rounded bg-slate-700/60 border border-slate-600/40 flex items-center justify-center">
                          <span className="text-slate-400 text-[8px] font-bold">M{n}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video bg-slate-900 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-white font-semibold">Masterclass Preview</p>
                      <p className="text-slate-400 text-sm mt-1">Video coming soon</p>
                      <button
                        onClick={(e) => { e.stopPropagation(); setIsVideoPlaying(false); }}
                        className="mt-4 text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors"
                      >
                        Close Preview
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick stats under video */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { value: '£297', label: 'Launch Price' },
                { value: '8', label: 'Modules' },
                { value: '24+', label: 'Lessons' },
              ].map((stat, i) => (
                <div key={i} className="text-center bg-slate-800/40 border border-slate-700/30 rounded-xl py-3">
                  <p className="text-white font-bold text-lg">{stat.value}</p>
                  <p className="text-slate-500 text-xs">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MasterclassHero;
