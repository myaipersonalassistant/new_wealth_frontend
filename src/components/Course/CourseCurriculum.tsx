import React, { useState, useEffect } from 'react';
import { getCourseStructure, type ModuleStructure } from '@/lib/courseContent';
import type { Module as StaticModule } from '@/data/courseData';

const COLOR_KEYS = ['indigo', 'purple', 'emerald', 'amber', 'rose', 'cyan'] as const;

const staticModules: StaticModule[] = [
  {
    number: 1,
    title: 'Getting Started the Right Way',
    duration: '35 min',
    color: 'indigo',
    description: 'Lay the groundwork for a successful property investment journey. Set clear goals, understand the landscape, and build the right team around you from day one.',
    lessons: [
      {
        title: 'Why buy-to-let — and why now',
        duration: '12 min',
        description: 'Understand the fundamentals of buy-to-let investing and why it remains one of the most reliable wealth-building strategies in the UK.',
      },
      {
        title: 'Setting your investment goals and timeline',
        duration: '11 min',
        description: 'Define what success looks like for you — whether it\'s replacing your income, building long-term equity, or creating a retirement fund.',
      },
      {
        title: 'Building your power team (broker, solicitor, accountant)',
        duration: '12 min',
        description: 'Learn who you need in your corner, how to find them, and what to look for in a great mortgage broker, property solicitor, and accountant.',
      },
    ],
  },
  {
    number: 2,
    title: 'Understanding the Numbers',
    duration: '40 min',
    color: 'purple',
    description: 'Master the financial fundamentals that separate profitable deals from money pits. Learn to analyse any property in minutes with confidence.',
    lessons: [
      {
        title: 'The key metrics: yield, ROI, and cashflow',
        duration: '14 min',
        description: 'Understand the three numbers every investor must know — and how to calculate them quickly for any property you\'re considering.',
      },
      {
        title: 'Running the numbers on a real deal (walkthrough)',
        duration: '14 min',
        description: 'Follow along as we analyse a real property listing step by step, using the included Deal Analyser spreadsheet.',
      },
      {
        title: 'Stress-testing your deal against rate rises',
        duration: '12 min',
        description: 'Learn how to pressure-test your numbers against interest rate increases, void periods, and unexpected costs so you never get caught out.',
      },
    ],
  },
  {
    number: 3,
    title: 'Finding the Right Property',
    duration: '38 min',
    color: 'emerald',
    description: 'Discover where to look, what to look for, and how to spot opportunity where others see risk. From online portals to off-market gems.',
    lessons: [
      {
        title: 'Choosing the right area and tenant type',
        duration: '13 min',
        description: 'Learn how to research areas, assess tenant demand, and match locations to your investment strategy and budget.',
      },
      {
        title: 'Where to search: portals, agents, and off-market',
        duration: '12 min',
        description: 'Go beyond Rightmove. Discover how to build relationships with agents, find off-market deals, and use auction sites effectively.',
      },
      {
        title: 'Viewing properties: what to look for and red flags',
        duration: '13 min',
        description: 'Use the included Viewing Checklist to inspect properties like a pro. Know exactly what to look for — and what should make you walk away.',
      },
    ],
  },
  {
    number: 4,
    title: 'Financing Your Investment',
    duration: '36 min',
    color: 'amber',
    description: 'Navigate the world of buy-to-let mortgages with clarity. Understand what lenders want, how much you really need, and how to get the best deal.',
    lessons: [
      {
        title: 'Buy-to-let mortgages explained',
        duration: '13 min',
        description: 'A clear, jargon-free guide to how buy-to-let mortgages work, including interest-only vs repayment, fixed vs variable, and stress tests.',
      },
      {
        title: 'How much deposit do you really need?',
        duration: '11 min',
        description: 'Understand the real numbers behind deposits, stamp duty, legal fees, and refurbishment costs — so there are no surprises.',
      },
      {
        title: 'Working with a mortgage broker',
        duration: '12 min',
        description: 'Learn why a good broker is worth their weight in gold, how to choose one, and what information to have ready before your first call.',
      },
    ],
  },
  {
    number: 5,
    title: 'Making Offers and Closing Deals',
    duration: '38 min',
    color: 'rose',
    description: 'Learn to negotiate with confidence, navigate the legal process, and get from offer accepted to keys in hand without the stress.',
    lessons: [
      {
        title: 'How to make a strong offer (and negotiate)',
        duration: '13 min',
        description: 'Understand the psychology of negotiation, how to justify your offer, and when to push harder or walk away.',
      },
      {
        title: 'The conveyancing process step by step',
        duration: '13 min',
        description: 'Demystify the legal process from offer acceptance to exchange. Know what your solicitor is doing and what you need to provide.',
      },
      {
        title: 'Exchange, completion, and getting the keys',
        duration: '12 min',
        description: 'Understand the final stages of the purchase — exchange of contracts, completion day, and what happens immediately after.',
      },
    ],
  },
  {
    number: 6,
    title: 'Becoming a Landlord',
    duration: '36 min',
    color: 'cyan',
    description: 'Set yourself up as a professional, compliant landlord from day one. Find great tenants, understand your obligations, and manage for long-term profit.',
    lessons: [
      {
        title: 'Finding and vetting quality tenants',
        duration: '12 min',
        description: 'Learn how to market your property, conduct viewings, run reference checks, and select tenants who\'ll look after your investment.',
      },
      {
        title: 'Legal obligations every landlord must know',
        duration: '12 min',
        description: 'From gas safety certificates to deposit protection — understand the legal requirements so you stay compliant and protected.',
      },
      {
        title: 'Managing your property for long-term profit',
        duration: '12 min',
        description: 'Self-manage vs letting agent, handling maintenance, rent reviews, and building a system that runs smoothly month after month.',
      },
    ],
  },
];

const bonusModule = {
  title: 'Bonus — Deal Walkthrough(s) + Q&A',
  description: 'See the entire process in action with real deal walkthroughs, learn from common mistakes, and get answers to the most frequently asked questions.',
  lessons: [
    {
      title: 'Live deal walkthrough: from search to completion',
      duration: '18 min',
      description: 'Follow a real deal from the initial property search through analysis, offer, negotiation, and all the way to completion day.',
    },
    {
      title: 'Common mistakes and how to avoid them',
      duration: '12 min',
      description: 'Learn from the most common errors new investors make — and the simple steps to avoid each one.',
    },
    {
      title: 'Live Q&A recordings',
      duration: '25 min',
      description: 'Curated recordings from live Q&A sessions covering the questions students ask most often.',
    },
  ],
};

const colorMap: Record<string, { bg: string; border: string; text: string; badge: string; dot: string; lessonIcon: string }> = {
  indigo: { bg: 'bg-indigo-500/5', border: 'border-indigo-500/20', text: 'text-indigo-400', badge: 'bg-indigo-500/10', dot: 'bg-indigo-400', lessonIcon: 'text-indigo-400' },
  purple: { bg: 'bg-purple-500/5', border: 'border-purple-500/20', text: 'text-purple-400', badge: 'bg-purple-500/10', dot: 'bg-purple-400', lessonIcon: 'text-purple-400' },
  emerald: { bg: 'bg-emerald-500/5', border: 'border-emerald-500/20', text: 'text-emerald-400', badge: 'bg-emerald-500/10', dot: 'bg-emerald-400', lessonIcon: 'text-emerald-400' },
  amber: { bg: 'bg-amber-500/5', border: 'border-amber-500/20', text: 'text-amber-400', badge: 'bg-amber-500/10', dot: 'bg-amber-400', lessonIcon: 'text-amber-400' },
  rose: { bg: 'bg-rose-500/5', border: 'border-rose-500/20', text: 'text-rose-400', badge: 'bg-rose-500/10', dot: 'bg-rose-400', lessonIcon: 'text-rose-400' },
  cyan: { bg: 'bg-cyan-500/5', border: 'border-cyan-500/20', text: 'text-cyan-400', badge: 'bg-cyan-500/10', dot: 'bg-cyan-400', lessonIcon: 'text-cyan-400' },
};

interface DisplayModule {
  number: number;
  title: string;
  duration: string;
  color: string;
  description: string;
  lessons: { title: string; duration: string; description: string }[];
}

function firestoreToDisplay(struct: ModuleStructure[]): DisplayModule[] {
  return struct.map((m, i) => ({
    number: m.number,
    title: m.title,
    duration: m.episodes.reduce((acc, ep) => acc + parseInt(ep.duration || '0') || 0, 0) + ' min',
    color: COLOR_KEYS[i % COLOR_KEYS.length],
    description: m.description || '',
    lessons: m.episodes.map((ep) => ({
      title: ep.title,
      duration: ep.duration || '—',
      description: ep.description || '',
    })),
  }));
}

const CourseCurriculum: React.FC = () => {
  const [expandedModule, setExpandedModule] = useState<number | null>(1);
  const [showBonus, setShowBonus] = useState(false);
  const [firestoreStructure, setFirestoreStructure] = useState<ModuleStructure[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCourseStructure('beginner-course').then((s) => {
      setFirestoreStructure(s.length > 0 ? s : null);
      setLoading(false);
    });
  }, []);

  const modules: DisplayModule[] = firestoreStructure && firestoreStructure.length > 0
    ? firestoreToDisplay(firestoreStructure)
    : staticModules;

  const totalDuration = modules.reduce((acc, m) => acc + (parseInt(m.duration) || 0), 0);
  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const bonusDuration = bonusModule.lessons.reduce((acc, l) => acc + parseInt(l.duration), 0);

  if (loading) {
    return (
      <section id="curriculum" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center py-12">
          <div className="w-10 h-10 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading curriculum...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="curriculum" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-indigo-400 font-semibold text-sm uppercase tracking-wider">Complete Curriculum</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
             {modules.length} Modules. {totalLessons} Lessons.
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              One Clear Path to Your First Buy-to-Let.
            </span>
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {Math.floor(totalDuration / 60)}h {totalDuration % 60}m + {bonusDuration}m bonus
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {totalLessons} lessons + {bonusModule.lessons.length} bonus
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Templates &amp; checklists included
            </span>
          </div>
        </div>

        {/* Progress path visual */}
        <div className="hidden md:flex items-center justify-between mb-12 px-4">
          {modules.map((mod, i) => {
            const colors = colorMap[mod.color];
            return (
              <React.Fragment key={mod.number}>
                <button
                  onClick={() => setExpandedModule(expandedModule === mod.number ? null : mod.number)}
                  className={`flex flex-col items-center gap-2 group transition-all ${expandedModule === mod.number ? 'scale-110' : 'hover:scale-105'}`}
                >
                  <div className={`w-12 h-12 rounded-xl ${expandedModule === mod.number ? colors.badge + ' border-2 ' + colors.border : 'bg-slate-800/60 border border-slate-700/40'} flex items-center justify-center transition-all`}>
                    <span className={`font-bold text-sm ${expandedModule === mod.number ? colors.text : 'text-slate-500'}`}>{mod.number}</span>
                  </div>
                  <span className={`text-xs font-medium max-w-[80px] text-center leading-tight ${expandedModule === mod.number ? colors.text : 'text-slate-500'}`}>
                    {mod.title}
                  </span>
                </button>
                {i < modules.length - 1 && (
                  <div className="flex-1 h-px bg-slate-700/50 mx-2" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Modules */}
        <div className="space-y-4">
          {modules.map((mod) => {
            const colors = colorMap[mod.color];
            const isOpen = expandedModule === mod.number;

            return (
              <div key={mod.number} className={`${colors.bg} border ${colors.border} rounded-2xl overflow-hidden transition-all`}>
                {/* Module Header */}
                <button
                  onClick={() => setExpandedModule(isOpen ? null : mod.number)}
                  className="w-full px-6 sm:px-8 py-5 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 text-left">
                    <div className={`w-12 h-12 rounded-xl ${colors.badge} flex items-center justify-center flex-shrink-0`}>
                      <span className={`${colors.text} font-bold text-lg`}>{mod.number}</span>
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg sm:text-xl">
                        Module {mod.number}: {mod.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-slate-500 text-sm">{mod.duration}</span>
                        <span className="text-slate-600 text-sm">·</span>
                        <span className="text-slate-500 text-sm">{mod.lessons.length} lessons</span>
                      </div>
                    </div>
                  </div>
                  <svg
                    className={`w-5 h-5 ${colors.text} flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Lessons */}
                <div className={`overflow-hidden transition-all duration-500 ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="px-6 sm:px-8 pb-6">
                    <p className="text-slate-400 text-sm mb-5 leading-relaxed">{mod.description}</p>
                    <div className="space-y-3">
                      {mod.lessons.map((lesson, li) => (
                        <div
                          key={li}
                          className="bg-slate-800/60 border border-slate-700/40 rounded-xl p-4 sm:p-5 hover:border-slate-600/60 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-8 h-8 rounded-lg ${colors.badge} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                              <svg className={`w-4 h-4 ${colors.lessonIcon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <h4 className="text-white font-semibold text-sm sm:text-base">{lesson.title}</h4>
                                <span className="text-slate-500 text-xs flex-shrink-0">{lesson.duration}</span>
                              </div>
                              <p className="text-slate-400 text-sm mt-1 leading-relaxed">{lesson.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Bonus Module */}
          <div className="bg-gradient-to-br from-amber-500/5 to-amber-500/[0.02] border-2 border-dashed border-amber-500/30 rounded-2xl overflow-hidden transition-all">
            <button
              onClick={() => setShowBonus(!showBonus)}
              className="w-full px-6 sm:px-8 py-5 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-bold text-lg sm:text-xl">{bonusModule.title}</h3>
                    <span className="bg-amber-500/20 text-amber-400 text-xs font-bold px-2.5 py-0.5 rounded-full">FREE BONUS</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-slate-500 text-sm">{bonusDuration} min</span>
                    <span className="text-slate-600 text-sm">·</span>
                    <span className="text-slate-500 text-sm">{bonusModule.lessons.length} sessions</span>
                  </div>
                </div>
              </div>
              <svg
                className={`w-5 h-5 text-amber-400 flex-shrink-0 transition-transform duration-300 ${showBonus ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div className={`overflow-hidden transition-all duration-500 ${showBonus ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="px-6 sm:px-8 pb-6">
                <p className="text-slate-400 text-sm mb-5 leading-relaxed">{bonusModule.description}</p>
                <div className="space-y-3">
                  {bonusModule.lessons.map((lesson, li) => (
                    <div
                      key={li}
                      className="bg-slate-800/60 border border-amber-500/10 rounded-xl p-4 sm:p-5 hover:border-amber-500/20 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="text-white font-semibold text-sm sm:text-base">{lesson.title}</h4>
                            <span className="text-slate-500 text-xs flex-shrink-0">{lesson.duration}</span>
                          </div>
                          <p className="text-slate-400 text-sm mt-1 leading-relaxed">{lesson.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA after curriculum */}
        <div className="mt-12 text-center">
          <a
            href="#pricing"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-1"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Get Instant Access — £97
          </a>
          <p className="text-slate-500 text-sm mt-3">One-time payment. Lifetime access. 30-day money-back guarantee.</p>
        </div>
      </div>
    </section>
  );
};

export default CourseCurriculum;
