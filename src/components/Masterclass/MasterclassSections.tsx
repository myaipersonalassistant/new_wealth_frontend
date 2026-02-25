import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CoursePurchaseButton } from '@/components/Course/CoursePurchaseButton';

// ─── Who Is This For ───
export const MasterclassAudienceSection: React.FC = () => (
  <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <span className="text-amber-400 font-semibold text-sm uppercase tracking-wider">Is This For You?</span>
        <h2 className="text-3xl sm:text-4xl font-bold text-white mt-4">
          This masterclass is for you if...
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          'You already own (or are about to own) your first investment property',
          'You want to scale from 1 property to a portfolio',
          'You need to understand advanced tax and legal structures',
          'You want a strategic framework, not just tactics',
          'You\'re ready to treat property investing as a serious business',
          'You want to build generational wealth through property',
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-3 bg-slate-800/60 border border-slate-700/40 rounded-xl p-4">
            <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-3.5 h-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-slate-300 text-sm">{item}</span>
          </div>
        ))}
      </div>

      {/* Comparison note */}
      <div className="mt-8 bg-indigo-500/5 border border-indigo-500/15 rounded-xl p-5 text-center">
        <p className="text-slate-400 text-sm">
          <span className="text-white font-medium">New to property investing?</span> Start with our{' '}
          <Link to="/course" className="text-indigo-400 hover:text-indigo-300 font-medium underline underline-offset-2 transition-colors">
            Beginners
          </Link>{' '}
          course (£97) — it covers the fundamentals step by step.
        </p>
      </div>
    </div>
  </section>
);

// ─── What's Included ───
export const MasterclassIncludedSection: React.FC = () => {
  const items = [
    { icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z', title: '8 In-Depth Video Modules', desc: 'Over 6 hours of advanced, strategic content covering every aspect of building a property portfolio.' },
    { icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', title: 'Advanced Financial Models', desc: 'Professional-grade spreadsheets for deal analysis, portfolio modelling, and sensitivity analysis.' },
    { icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6', title: 'Portfolio Planning Templates', desc: '1-year, 5-year, and 10-year portfolio roadmap templates to plan your scaling strategy.' },
    { icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4', title: 'Tax Planning Guides', desc: 'Comprehensive guides to personal vs company ownership, Section 24, CGT strategies, and allowable expenses.' },
    { icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15', title: 'Lifetime Access & Updates', desc: 'Access the masterclass forever, including all future modules, updates, and new bonus content.' },
    { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', title: '30-Day Money-Back Guarantee', desc: 'Try the entire masterclass risk-free. Full refund within 30 days — no questions asked.' },
  ];

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-amber-400 font-semibold text-sm uppercase tracking-wider">Everything You Need</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
            What's Included
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <div key={i} className="bg-slate-800/60 border border-slate-700/40 rounded-xl p-6 hover:border-amber-500/20 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                </svg>
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Instructor Bio ───
export const MasterclassInstructorSection: React.FC = () => (
  <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <span className="text-amber-400 font-semibold text-sm uppercase tracking-wider">Your Instructor</span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-4">
          Meet Chris Ifonlaja
        </h2>
      </div>

      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-8 sm:p-12">
        <div className="flex flex-col md:flex-row gap-10 items-center">
          <div className="flex-shrink-0">
            <div className="w-56 h-56 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center overflow-hidden">
              <img
                src="profile.jpg"
                alt="Chris Ifonlaja"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-bold text-white mb-1">Chris Ifonlaja</h3>
            <p className="text-amber-400 font-medium mb-6">Property Investor, Author & Educator</p>

            <div className="space-y-4 mb-8">
              <p className="text-slate-300 leading-relaxed">
                Chris is the author of <span className="text-white font-medium">Build Wealth Through Property: 7 Reasons Why</span> and creator of the <span className="text-white font-medium">Beginners</span> course.
              </p>
              <p className="text-slate-300 leading-relaxed">
                The <span className="text-white font-medium">Property Investor Masterclass</span> represents the next level — a comprehensive programme built from years of hands-on investing experience, covering the advanced strategies, structures, and mindset needed to build a serious property portfolio.
              </p>
              <p className="text-slate-300 leading-relaxed">
                This isn't theory from a textbook. Every module is drawn from real-world experience — the wins, the mistakes, and the lessons that only come from doing the work.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { value: '10+', label: 'Years Investing' },
                { value: '8', label: 'Core Modules' },
                { value: '24+', label: 'Video Lessons' },
                { value: '6h+', label: 'Of Content' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-white font-bold text-xl">{stat.value}</p>
                  <p className="text-slate-500 text-xs">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ─── Testimonials ───
export const MasterclassTestimonialsSection: React.FC = () => {
  const stories = [
    {
      name: 'Michael R.',
      location: 'Bristol',
      quote: 'I had one buy-to-let and felt stuck. The masterclass gave me a clear roadmap to scale. The module on financing strategies alone saved me thousands — I restructured into a limited company at exactly the right time. Now planning property number four.',
      result: 'Scaled from 1 to 3 properties in 12 months',
      initial: 'M',
    },
    {
      name: 'Amara J.',
      location: 'Nottingham',
      quote: 'The advanced deal analysis module completely changed how I evaluate properties. I was leaving money on the table with basic yield calculations. Now I model every deal properly and my portfolio is performing significantly better as a result.',
      result: 'Portfolio yield improved by 1.8%',
      initial: 'A',
    },
    {
      name: 'Tom W.',
      location: 'Liverpool',
      quote: 'The tax and legal module was worth the price of the entire masterclass. I restructured my ownership and the annual tax savings are substantial. Chris explains complex topics in a way that actually makes sense — no jargon, just clarity.',
      result: 'Significant annual tax savings achieved',
      initial: 'T',
    },
    {
      name: 'Rachel D.',
      location: 'Sheffield',
      quote: 'I completed the Book to Buy-to-Let course first, bought my first property, then enrolled in the masterclass to plan my next steps. The portfolio strategy module helped me create a 5-year plan that I\'m now executing with confidence.',
      result: '5-year portfolio plan in action',
      initial: 'R',
    },
  ];

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-amber-400 font-semibold text-sm uppercase tracking-wider">Student Results</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
            Real Investors. Real Results.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stories.map((story, i) => (
            <div key={i} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 sm:p-8 hover:border-amber-500/20 transition-colors">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, si) => (
                  <svg key={si} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-slate-300 leading-relaxed mb-4">"{story.quote}"</p>
              <div className="bg-amber-500/5 border border-amber-500/10 rounded-lg px-4 py-2.5 mb-5">
                <p className="text-amber-300 text-sm font-medium flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  {story.result}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-slate-900 font-bold text-sm">
                  {story.initial}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{story.name}</p>
                  <p className="text-slate-500 text-xs">{story.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Pricing Section ───
export const MasterclassPricingSection: React.FC<{ masterclassPrice?: string }> = ({ masterclassPrice = '£297' }) => (
  <section id="pricing" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <span className="text-amber-400 font-semibold text-sm uppercase tracking-wider">Choose Your Path</span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
          Two Courses. One Goal.
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Whether you're just starting out or ready to scale, there's a course for your stage.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Beginners */}
        <div className="relative bg-slate-800/60 border border-slate-700/50 rounded-2xl p-8">
          <div className="mb-6">
            <p className="text-indigo-400 font-semibold text-sm uppercase tracking-wider mb-2">Beginner Course</p>
            <h3 className="text-2xl font-bold text-white mb-1">Beginners</h3>
            <p className="text-slate-400 text-sm">Your first investment property</p>
          </div>

          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-4xl font-bold text-white">£97</span>
            <span className="text-slate-500 text-sm">one-time</span>
          </div>

          <div className="space-y-3 mb-8">
            {[
              '6 core modules (18 lessons)',
              'Bonus deal walkthroughs + Q&A',
              'Deal Analyser spreadsheet',
              'Viewing Checklist template',
              'Lifetime access & updates',
              '30-day money-back guarantee',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-slate-300 text-sm">{item}</span>
              </div>
            ))}
          </div>

          <Link
            to="/course"
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold px-6 py-4 rounded-xl transition-all hover:shadow-lg hover:shadow-indigo-500/20 flex items-center justify-center gap-2"
          >
            View Course Details
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        {/* Property Investor Masterclass */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-3xl blur-lg opacity-60" />
          <div className="relative bg-gradient-to-br from-slate-800 to-slate-800/80 border-2 border-amber-500/30 rounded-2xl p-8 shadow-2xl">
            {/* Recommended badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-bold px-5 py-1.5 rounded-full text-sm shadow-lg shadow-amber-500/30">
                Advanced Programme
              </div>
            </div>

            <div className="mb-6 mt-2">
              <p className="text-amber-400 font-semibold text-sm uppercase tracking-wider mb-2">Masterclass</p>
              <h3 className="text-2xl font-bold text-white mb-1">Property Investor Masterclass</h3>
              <p className="text-slate-400 text-sm">Build and scale your portfolio</p>
            </div>

            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-bold text-white">{masterclassPrice}</span>
              <span className="text-slate-500 text-sm">one-time</span>
            </div>

            <div className="space-y-3 mb-8">
              {[
                '8 advanced modules (24+ lessons)',
                'Professional financial models',
                'Portfolio planning templates',
                'Tax planning guides',
                'Advanced deal analysis tools',
                'Lifetime access & updates',
                '30-day money-back guarantee',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-slate-300 text-sm">{item}</span>
                </div>
              ))}
            </div>

            <CoursePurchaseButton
              courseId="masterclass"
              priceLabel={masterclassPrice}
              variant="amber"
              fullWidth
            />

            <div className="mt-3 flex items-center justify-center gap-4 text-slate-500 text-xs">
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Secure checkout
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                30-day guarantee
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ─── Guarantee ───
export const MasterclassGuaranteeSection: React.FC = () => (
  <section className="py-16 px-4 sm:px-6 lg:px-8">
    <div className="max-w-3xl mx-auto">
      <div className="bg-gradient-to-br from-emerald-900/20 to-emerald-900/5 border border-emerald-500/20 rounded-2xl p-8 sm:p-10 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-shrink-0">
          <div className="w-24 h-24 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center">
            <svg className="w-12 h-12 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        </div>
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-bold text-white mb-3">30-Day Money-Back Guarantee</h3>
          <p className="text-slate-300 leading-relaxed mb-2">
            Try the entire masterclass risk-free. If you don't feel it's worth every penny within 30 days, email us and we'll refund you in full — no questions asked.
          </p>
          <p className="text-emerald-400 font-medium text-sm">
            Your investment is completely protected.
          </p>
        </div>
      </div>
    </div>
  </section>
);

// ─── FAQ ───
export const MasterclassFAQSection: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: 'What\'s the difference between this and the "Beginners" course?',
      answer: 'The "Beginners" course (£97) is designed for beginners — it takes you from zero to buying your first investment property. The Property Investor Masterclass (£297) is for those who already own (or are about to own) a property and want to scale into a portfolio with advanced strategies, tax planning, and professional-grade analysis.',
    },
    {
      question: 'Do I need to complete the beginner course first?',
      answer: 'It\'s not required, but it\'s recommended if you haven\'t bought your first property yet. The masterclass assumes a baseline understanding of property investing fundamentals. If you\'re already an active investor, you can jump straight in.',
    },
    {
      question: 'How long do I have access?',
      answer: 'Lifetime. Once you enrol, you have permanent access to all 8 modules, templates, tools, and any future updates. No recurring fees.',
    },
    {
      question: 'Is this UK-specific?',
      answer: 'The tax, legal, and financing modules are UK-focused. However, the strategic frameworks — deal analysis, portfolio planning, risk management, and wealth building — apply to property investing globally.',
    },
    {
      question: 'Can I watch at my own pace?',
      answer: 'Yes. All modules are pre-recorded and available on-demand. Most students work through the masterclass over 4-8 weeks, but you can go at whatever pace suits you.',
    },
    {
      question: 'What\'s the refund policy?',
      answer: 'Full 30-day money-back guarantee. If you\'re not satisfied for any reason, email us within 30 days and we\'ll refund you in full. No questions asked.',
    },
    {
      question: 'Where is the masterclass hosted?',
      answer: 'The masterclass is hosted on Systeme.io. After purchase, you\'ll receive login details and can access all content immediately from any device.',
    },
    {
      question: 'Will this guarantee I make money?',
      answer: 'No course can guarantee returns. What this masterclass does is give you the advanced knowledge, tools, and strategic framework to make better-informed decisions that significantly improve your chances of building a successful property portfolio.',
    },
  ];

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-amber-400 font-semibold text-sm uppercase tracking-wider">Common Questions</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-4">
            Masterclass FAQ
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden transition-colors hover:border-slate-600">
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full px-6 sm:px-8 py-5 text-left flex items-center justify-between gap-4"
              >
                <span className="text-white font-semibold">{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-amber-400 flex-shrink-0 transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${openFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-6 sm:px-8 pb-5">
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

// ─── Final CTA ───
export const MasterclassFinalCTA: React.FC<{ price?: string }> = ({ price = '£297' }) => (
  <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
    <div className="max-w-4xl mx-auto text-center">
      <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-3xl p-8 sm:p-12 md:p-16">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to Build a
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
            Property Portfolio?
          </span>
        </h2>

        <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
          The Property Investor Masterclass gives you the advanced strategies, tools, and confidence to scale from your first property to a portfolio that builds generational wealth.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <div className="inline-flex justify-center">
            <CoursePurchaseButton
              courseId="masterclass"
              priceLabel={price}
              variant="amber"
              fullWidth={false}
              className="text-xl px-10 py-5 hover:-translate-y-1"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-slate-500 text-sm">
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            30-day guarantee
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            Lifetime access
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Instant access
          </span>
        </div>

        {/* Links to other resources */}
        <div className="mt-10 pt-8 border-t border-amber-500/10 flex flex-col sm:flex-row items-center justify-center gap-6">
          <div className="text-center">
            <p className="text-slate-500 text-sm mb-2">New to property investing?</p>
            <Link
              to="/course"
              className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Start with Beginners (£97)
            </Link>
          </div>
          <div className="hidden sm:block w-px h-8 bg-slate-700" />
          <div className="text-center">
            <p className="text-slate-500 text-sm mb-2">Haven't read the book yet?</p>
            <Link
              to="/"
              className="text-amber-400 hover:text-amber-300 font-medium transition-colors inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Explore Build Wealth Through Property
            </Link>
          </div>
        </div>
      </div>
    </div>
  </section>
);
