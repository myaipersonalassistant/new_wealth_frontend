import React, { useState, useEffect } from 'react';
import { getCourseStructure, type ModuleStructure } from '@/lib/courseContent';

const COLOR_KEYS = ['amber', 'emerald', 'indigo', 'purple', 'rose', 'cyan'] as const;

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

const staticModules: DisplayModule[] = [
  {
    number: 1,
    title: 'The Investor Mindset',
    duration: '45 min',
    color: 'amber',
    description: 'Develop the psychology and discipline that separates successful property investors from everyone else. Learn to think long-term and make decisions with clarity.',
    lessons: [
      { title: 'Why most investors fail — and how to avoid it', duration: '15 min', description: 'Understand the common psychological traps that derail property investors and build the mental framework to sidestep them.' },
      { title: 'Building your investment thesis', duration: '15 min', description: 'Create a clear, written investment strategy that guides every decision you make — from area selection to exit planning.' },
      { title: 'Risk management and emotional discipline', duration: '15 min', description: 'Learn to separate emotion from analysis, manage downside risk, and stay disciplined when markets get volatile.' },
    ],
  },
  {
    number: 2,
    title: 'Market Analysis & Research',
    duration: '50 min',
    color: 'emerald',
    description: 'Master the art of reading property markets. Understand supply and demand dynamics, economic indicators, and how to identify emerging opportunities before the crowd.',
    lessons: [
      { title: 'Reading the property market cycle', duration: '18 min', description: 'Understand the four phases of the property cycle and how to position yourself for maximum advantage in each phase.' },
      { title: 'Area analysis: demographics, infrastructure & demand', duration: '16 min', description: 'Use data-driven research to identify high-growth areas, assess tenant demand, and spot regeneration opportunities.' },
      { title: 'Comparable analysis and valuation techniques', duration: '16 min', description: 'Learn professional valuation methods to determine true market value and identify below-market-value opportunities.' },
    ],
  },
  {
    number: 3,
    title: 'Advanced Deal Analysis',
    duration: '55 min',
    color: 'indigo',
    description: 'Go beyond basic yield calculations. Master sophisticated financial modelling, sensitivity analysis, and the metrics that professional investors use to evaluate deals.',
    lessons: [
      { title: 'Advanced metrics: ROCE, IRR, and equity multiple', duration: '18 min', description: 'Move beyond gross yield. Learn the advanced financial metrics that institutional investors use to compare opportunities.' },
      { title: 'Building a comprehensive deal model', duration: '20 min', description: 'Create a full financial model for any property deal, including all costs, projections, and scenario analysis.' },
      { title: 'Sensitivity analysis and worst-case planning', duration: '17 min', description: 'Stress-test every deal against multiple scenarios — rate rises, void periods, market corrections — before committing.' },
    ],
  },
  {
    number: 4,
    title: 'Financing Strategies',
    duration: '50 min',
    color: 'purple',
    description: 'Understand the full spectrum of financing options available to property investors. From traditional mortgages to creative structures that accelerate portfolio growth.',
    lessons: [
      { title: 'Portfolio lending and commercial finance', duration: '17 min', description: 'When you outgrow high-street lenders, understand how portfolio and commercial lending works for scaling investors.' },
      { title: 'Limited company structures and tax planning', duration: '18 min', description: 'Explore the pros and cons of buying through a limited company, including Section 24 implications and long-term tax efficiency.' },
      { title: 'Refinancing, recycling capital, and the BRRRR method', duration: '15 min', description: 'Master the strategy of buying, refurbishing, refinancing, and recycling your deposit to grow your portfolio faster.' },
    ],
  },
  {
    number: 5,
    title: 'Portfolio Strategy & Scaling',
    duration: '48 min',
    color: 'rose',
    description: 'Plan and execute a portfolio strategy that compounds over time. Learn when to buy, when to hold, and how to scale from one property to a portfolio.',
    lessons: [
      { title: 'Building a portfolio plan: 1, 5, and 10-year roadmap', duration: '16 min', description: 'Create a realistic, phased plan for growing your portfolio with clear milestones and decision points.' },
      { title: 'Diversification: geography, property type, and tenant mix', duration: '16 min', description: 'Reduce risk and increase resilience by diversifying across locations, property types, and tenant demographics.' },
      { title: 'When to sell, remortgage, or hold', duration: '16 min', description: 'Make strategic decisions about your existing portfolio — knowing when to take profit, release equity, or stay the course.' },
    ],
  },
  {
    number: 6,
    title: 'Refurbishment & Value-Add',
    duration: '45 min',
    color: 'cyan',
    description: 'Learn to add value through smart refurbishment. Understand project management, budgeting, and the renovations that deliver the highest return on investment.',
    lessons: [
      { title: 'Identifying value-add opportunities', duration: '15 min', description: 'Spot properties where strategic improvements can significantly increase value and rental income.' },
      { title: 'Budgeting, project management, and contractor relations', duration: '15 min', description: 'Manage refurbishment projects professionally — from accurate budgeting to finding reliable contractors.' },
      { title: 'High-ROI improvements vs vanity projects', duration: '15 min', description: 'Focus your budget on improvements that tenants value and that increase property value — not expensive cosmetic upgrades.' },
    ],
  },
  {
    number: 7,
    title: 'Tax, Legal & Compliance',
    duration: '50 min',
    color: 'amber',
    description: 'Navigate the complex world of property tax, legal structures, and regulatory compliance. Protect your wealth and stay on the right side of the law.',
    lessons: [
      { title: 'Income tax, CGT, and stamp duty for investors', duration: '18 min', description: 'Understand the full tax landscape for property investors — income tax on rental profits, capital gains, and SDLT surcharges.' },
      { title: 'Legal structures: personal vs company ownership', duration: '16 min', description: 'Compare ownership structures and understand when each makes sense based on your circumstances and goals.' },
      { title: 'Regulatory compliance and landlord obligations', duration: '16 min', description: 'Stay compliant with evolving regulations — from EPC requirements to licensing, safety certificates, and tenant rights.' },
    ],
  },
  {
    number: 8,
    title: 'Building Long-Term Wealth',
    duration: '45 min',
    color: 'emerald',
    description: 'Tie everything together into a sustainable, long-term wealth-building system. Learn to protect, grow, and eventually pass on your property wealth.',
    lessons: [
      { title: 'Creating passive income through systemisation', duration: '15 min', description: 'Build systems and processes that allow your portfolio to run with minimal day-to-day involvement.' },
      { title: 'Estate planning and wealth transfer', duration: '15 min', description: 'Plan for the long term — understand inheritance tax, trusts, and strategies for passing property wealth to the next generation.' },
      { title: 'Your personalised action plan', duration: '15 min', description: 'Bring everything together into a personalised, actionable plan tailored to your goals, timeline, and resources.' },
    ],
  },
];

const colorMap: Record<string, { bg: string; border: string; text: string; badge: string; dot: string; lessonIcon: string }> = {
  amber: { bg: 'bg-amber-500/5', border: 'border-amber-500/20', text: 'text-amber-400', badge: 'bg-amber-500/10', dot: 'bg-amber-400', lessonIcon: 'text-amber-400' },
  emerald: { bg: 'bg-emerald-500/5', border: 'border-emerald-500/20', text: 'text-emerald-400', badge: 'bg-emerald-500/10', dot: 'bg-emerald-400', lessonIcon: 'text-emerald-400' },
  indigo: { bg: 'bg-indigo-500/5', border: 'border-indigo-500/20', text: 'text-indigo-400', badge: 'bg-indigo-500/10', dot: 'bg-indigo-400', lessonIcon: 'text-indigo-400' },
  purple: { bg: 'bg-purple-500/5', border: 'border-purple-500/20', text: 'text-purple-400', badge: 'bg-purple-500/10', dot: 'bg-purple-400', lessonIcon: 'text-purple-400' },
  rose: { bg: 'bg-rose-500/5', border: 'border-rose-500/20', text: 'text-rose-400', badge: 'bg-rose-500/10', dot: 'bg-rose-400', lessonIcon: 'text-rose-400' },
  cyan: { bg: 'bg-cyan-500/5', border: 'border-cyan-500/20', text: 'text-cyan-400', badge: 'bg-cyan-500/10', dot: 'bg-cyan-400', lessonIcon: 'text-cyan-400' },
};

const MasterclassCurriculum: React.FC = () => {
  const [expandedModule, setExpandedModule] = useState<number | null>(1);
  const [firestoreStructure, setFirestoreStructure] = useState<ModuleStructure[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCourseStructure('masterclass').then((s) => {
      setFirestoreStructure(s.length > 0 ? s : null);
      setLoading(false);
    });
  }, []);

  const modules: DisplayModule[] = firestoreStructure && firestoreStructure.length > 0
    ? firestoreToDisplay(firestoreStructure)
    : staticModules;

  const totalDuration = modules.reduce((acc, m) => acc + (parseInt(m.duration) || 0), 0);
  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);

  if (loading) {
    return (
      <section id="curriculum" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center py-12">
          <div className="w-10 h-10 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
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
          <span className="text-amber-400 font-semibold text-sm uppercase tracking-wider">Complete Curriculum</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
            8 Modules. {totalLessons} Lessons.
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
              Master Property Investing.
            </span>
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {Math.floor(totalDuration / 60)}h {totalDuration % 60}m of content
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {totalLessons} in-depth lessons
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Advanced tools &amp; templates
            </span>
          </div>
        </div>

        {/* Modules */}
        <div className="space-y-4">
          {modules.map((mod) => {
            const colors = colorMap[mod.color];
            const isOpen = expandedModule === mod.number;

            return (
              <div key={mod.number} className={`${colors.bg} border ${colors.border} rounded-2xl overflow-hidden transition-all`}>
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
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div className={`overflow-hidden transition-all duration-500 ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="px-6 sm:px-8 pb-6">
                    <p className="text-slate-400 text-sm mb-5 leading-relaxed">{mod.description}</p>
                    <div className="space-y-3">
                      {mod.lessons.map((lesson, li) => (
                        <div key={li} className="bg-slate-800/60 border border-slate-700/40 rounded-xl p-4 sm:p-5 hover:border-slate-600/60 transition-colors">
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
        </div>

        {/* CTA after curriculum */}
        <div className="mt-12 text-center">
          <a
            href="#pricing"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-bold px-8 py-4 rounded-xl text-lg transition-all hover:shadow-xl hover:shadow-amber-500/30 hover:-translate-y-1"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Get Full Access — £297
          </a>
          <p className="text-slate-500 text-sm mt-3">One-time payment. Lifetime access. 30-day money-back guarantee.</p>
        </div>
      </div>
    </section>
  );
};

export default MasterclassCurriculum;
