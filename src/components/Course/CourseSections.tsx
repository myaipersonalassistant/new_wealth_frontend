import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CoursePurchaseButton } from './CoursePurchaseButton';

// ─── Instructor Bio ───
export const InstructorSection: React.FC = () => (
  <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <span className="text-indigo-400 font-semibold text-sm uppercase tracking-wider">Your Instructor</span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-4">
          Meet Chris Ifonlaja
        </h2>
      </div>

      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-8 sm:p-12">
        <div className="flex flex-col md:flex-row gap-10 items-center">
          <div className="flex-shrink-0">
            <div className="w-56 h-56 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center overflow-hidden">
              <img
                src="./profile.jpg"
                alt="Chris Ifonlaja"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-bold text-white mb-1">Chris Ifonlaja</h3>
            <p className="text-indigo-400 font-medium mb-6">Property Investor, Author & Educator</p>

            <div className="space-y-4 mb-8">
              <p className="text-slate-300 leading-relaxed">
                Chris is the author of <span className="text-white font-medium">Build Wealth Through Property: 7 Reasons Why</span> — a practical, no-hype guide to long-term property investing that has helped hundreds of readers take their first confident steps into property.
              </p>
              <p className="text-slate-300 leading-relaxed">
                <span className="text-white font-medium">From Book to Buy-to-Let</span> is the natural next step — a structured, step-by-step online course that turns the book's principles into a clear action plan. It's designed for readers who are ready to stop researching and start doing.
              </p>
              <p className="text-slate-300 leading-relaxed">
                With hands-on experience in UK buy-to-let investing, Chris brings a calm, disciplined approach that focuses on fundamentals over flashy promises. Every module is built from real-world experience.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { value: '10+', label: 'Years Investing' },
                { value: '6', label: 'Core Modules' },
                { value: '18+', label: 'Video Lessons' },
                { value: '1', label: 'Bestselling Book' },
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

// ─── Student Success Stories ───
export const SuccessStoriesSection: React.FC = () => {
  const stories = [
    {
      name: 'James T.',
      location: 'Manchester',
      quote: 'I read the book and loved it, but I still felt stuck on the "how". This course bridged that gap completely. Within 4 months of finishing, I\'d completed on my first buy-to-let. The deal analysis walkthrough alone saved me from a bad purchase.',
      result: 'First BTL purchased — £320/mo cashflow',
      initial: 'J',
    },
    {
      name: 'Sarah K.',
      location: 'Birmingham',
      quote: 'As a busy professional, I needed a structured system I could follow in my spare time. The course gave me exactly that — clear steps, no waffle. Module 4 on financing was a game-changer for understanding what I could actually afford.',
      result: 'Secured first property in 3 months',
      initial: 'S',
    },
    {
      name: 'David O.',
      location: 'London',
      quote: 'I\'d been paralysed by analysis for over a year. The course broke everything down into manageable steps. Running the numbers on a real deal in Module 2 gave me the confidence I\'d been missing. I finally understood what good numbers look like.',
      result: 'First property secured below market value',
      initial: 'D',
    },
    {
      name: 'Priya M.',
      location: 'Leeds',
      quote: 'The module on becoming a landlord was worth the price alone. I felt completely prepared when my first tenant moved in. Chris explains complex topics in a way that actually makes sense — no jargon, just clarity.',
      result: 'Confident landlord from day one',
      initial: 'P',
    },
  ];

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-indigo-400 font-semibold text-sm uppercase tracking-wider">Student Results</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
            Real Students. Real Results.
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            These are ordinary people who took the course and applied the system. No hype — just disciplined action.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stories.map((story, i) => (
            <div
              key={i}
              className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 sm:p-8 hover:border-indigo-500/20 transition-colors"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, si) => (
                  <svg key={si} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="text-slate-300 leading-relaxed mb-4">"{story.quote}"</p>

              <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-lg px-4 py-2.5 mb-5">
                <p className="text-indigo-300 text-sm font-medium flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  {story.result}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
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

// ─── What's Included Section ───
export const WhatsIncludedSection: React.FC = () => {
  const items = [
    { icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z', title: '6 Core Video Modules', desc: 'Over 3.5 hours of structured, practical video content walking you through every step from preparation to becoming a landlord.' },
    { icon: 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7', title: 'Bonus: Deal Walkthroughs + Q&A', desc: 'Real deal walkthroughs showing the entire process from search to completion, plus curated Q&A recordings.' },
    { icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', title: 'Templates & Checklists', desc: 'Deal Analyser spreadsheet, Viewing Checklist, and practical tools you can use on every property you evaluate.' },
    { icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4', title: 'Step-by-Step Action Plans', desc: 'Clear action items at the end of each module so you always know exactly what to do next.' },
    { icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15', title: 'Lifetime Access & Updates', desc: 'Access the course forever, including all future updates and new bonus content as it\'s added.' },
    { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', title: '30-Day Money-Back Guarantee', desc: 'Try the entire course risk-free. If it\'s not for you, get a full refund within 30 days — no questions asked.' },
  ];

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-indigo-400 font-semibold text-sm uppercase tracking-wider">Everything You Need</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
            What's Included
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <div key={i} className="bg-slate-800/60 border border-slate-700/40 rounded-xl p-6 hover:border-indigo-500/20 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

// ─── Pricing Section ───
export const PricingSection: React.FC<{ price?: string; courseTitle?: string }> = ({ price = '£97', courseTitle = 'From Book to Buy-to-Let' }) => (
  <section id="pricing" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <span className="text-indigo-400 font-semibold text-sm uppercase tracking-wider">Invest in Your Future</span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
          Simple, Transparent Pricing
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          One payment. Lifetime access. No subscriptions, no hidden fees.
        </p>
      </div>

      <div className="max-w-lg mx-auto">
        <div className="relative">
          {/* Glow */}
          <div className="absolute -inset-3 bg-gradient-to-br from-indigo-500/20 to-purple-500/10 rounded-3xl blur-xl opacity-60" />

          <div className="relative bg-gradient-to-br from-slate-800 to-slate-800/80 border-2 border-indigo-500/30 rounded-2xl p-8 sm:p-10 shadow-2xl">
            {/* Launch price badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold px-6 py-2 rounded-full text-sm shadow-lg shadow-indigo-500/30">
                Launch Price — Limited Time
              </div>
            </div>

            <div className="text-center mt-4 mb-8">
              <p className="text-slate-400 text-sm mb-2">{courseTitle}</p>
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="text-5xl sm:text-6xl font-bold text-white">{price}</span>
              </div>
              <p className="text-slate-400 text-sm">One-time payment · Lifetime access</p>
              <p className="text-amber-400 text-xs mt-1 font-medium">Price increases to £147 after launch period</p>
            </div>

            {/* What's included */}
            <div className="space-y-3 mb-8">
              {[
                '6 core video modules (18 lessons)',
                'Bonus: Deal walkthrough(s) + Q&A',
                'Deal Analyser spreadsheet',
                'Viewing Checklist template',
                'Step-by-step action plans',
                'Lifetime access & all future updates',
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

            {/* CTA Button */}
            <CoursePurchaseButton
              courseId="beginner-course"
              priceLabel={price}
              variant="indigo"
              fullWidth
              className="hover:-translate-y-0.5"
            />

            <div className="mt-4 flex items-center justify-center gap-4 text-slate-500 text-xs">
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
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Hosted on Systeme.io
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ─── Guarantee Badge ───
export const GuaranteeSection: React.FC = () => (
  <section className="py-16 px-4 sm:px-6 lg:px-8">
    <div className="max-w-3xl mx-auto">
      <div className="bg-gradient-to-br from-emerald-900/20 to-emerald-900/5 border border-emerald-500/20 rounded-2xl p-8 sm:p-10 flex flex-col md:flex-row items-center gap-8">
        {/* Shield icon */}
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
            Try the entire course risk-free. If you don't feel it's worth every penny within 30 days, email us and we'll refund you in full — no questions asked.
          </p>
          <p className="text-emerald-400 font-medium text-sm">
            Your investment is completely protected. You have nothing to lose.
          </p>
        </div>
      </div>
    </div>
  </section>
);

// ─── Course FAQ ───
export const CourseFAQSection: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: 'Do I need to have read the book first?',
      answer: 'It helps but it\'s not required. The course is designed to stand on its own as a complete step-by-step system. However, book readers will find the course builds naturally on the principles they already understand, giving them a head start.',
    },
    {
      question: 'How long do I have access to the course?',
      answer: 'Lifetime. Once you enrol, you have permanent access to all 6 modules, the bonus content, templates, and any future updates. There are no recurring fees or expiry dates.',
    },
    {
      question: 'Is this suitable for complete beginners?',
      answer: 'Absolutely. The course starts from the very beginning with Module 1 (Getting Started the Right Way) and builds up systematically. Each module assumes you\'ve completed the previous one. Many of our most successful students started with zero experience.',
    },
    {
      question: 'Why is the price only £97?',
      answer: 'This is our launch price. We want to make the course accessible to as many readers as possible while we gather feedback and testimonials. The price will increase to £147 after the launch period, so now is the best time to enrol.',
    },
    {
      question: 'What if I\'m not in the UK?',
      answer: 'The course is primarily focused on UK buy-to-let investing, including UK-specific mortgage, legal, and tax content. However, the core principles of deal analysis, negotiation, and property management apply globally.',
    },
    {
      question: 'Can I watch at my own pace?',
      answer: 'Yes. All modules are pre-recorded and available on-demand. Watch them in order or jump to the topics most relevant to you. Most students complete the course in 2-4 weeks alongside their day jobs.',
    },
    {
      question: 'Where is the course hosted?',
      answer: 'The course is hosted on Systeme.io, a professional course platform. After purchase, you\'ll receive login details and can access all content immediately from any device — desktop, tablet, or mobile.',
    },
    {
      question: 'What\'s the refund policy?',
      answer: 'We offer a full 30-day money-back guarantee. If you\'re not satisfied for any reason, simply email us within 30 days of purchase and we\'ll refund you in full. No questions asked.',
    },
    {
      question: 'How is this different from free content on YouTube?',
      answer: 'Free content is scattered, often contradictory, and designed to get views rather than results. This course is a structured, step-by-step system built from real experience. It includes practical templates, deal walkthroughs, and a clear path from start to finish.',
    },
    {
      question: 'Will this guarantee I make money in property?',
      answer: 'No course can guarantee returns — anyone who promises that is being dishonest. What this course does is give you the knowledge, tools, and framework to make informed, confident decisions that dramatically increase your chances of success.',
    },
  ];

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-indigo-400 font-semibold text-sm uppercase tracking-wider">Common Questions</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-4">
            Course FAQ
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
                className="w-full px-6 sm:px-8 py-5 text-left flex items-center justify-between gap-4"
              >
                <span className="text-white font-semibold">{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-indigo-400 flex-shrink-0 transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
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
export const CourseFinalCTA: React.FC = () => (
  <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
    <div className="max-w-4xl mx-auto text-center">
      <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-indigo-500/20 rounded-3xl p-8 sm:p-12 md:p-16">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to Go From Book
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
            to Buy-to-Let?
          </span>
        </h2>

        <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
          Stop researching and start doing. This course gives you the complete, step-by-step system to buy your first investment property with confidence.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <a
            href="#pricing"
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold px-10 py-5 rounded-xl text-xl transition-all hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-1 inline-flex items-center justify-center gap-3"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Enrol Now — Just £97
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-slate-500 text-sm">
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            30-day guarantee
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Price rises to £147 soon
          </span>
        </div>

        {/* Link back to book */}
        <div className="mt-10 pt-8 border-t border-indigo-500/10">
          <p className="text-slate-500 text-sm mb-3">Haven't read the book yet?</p>
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
  </section>
);
