import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AddToCalendarButton from '@/components/AddToCalendarButton';



const sevenReasons = [
  {
    number: '01',
    icon: 'M3 21V9L12 3L21 9V21H15V14H9V21H3Z',
    title: 'Multiple Wealth Pathways',
    description: 'Property gives you countless ways to build wealth regardless of your starting point. From buy-to-let to development, there\'s a strategy for every investor.',
  },
  {
    number: '02',
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    title: 'Predictable Income',
    description: 'Rental income provides strong, stable cash flow year after year. Build a reliable income stream that grows with your portfolio.',
  },
  {
    number: '03',
    icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
    title: 'Leverage',
    description: 'Use other people\'s money to control high-value assets and grow faster. Property is one of the few asset classes where leverage is readily available.',
  },
  {
    number: '04',
    icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
    title: 'Store of Value',
    description: 'Property preserves wealth across generations. A tangible asset that stands the test of time and economic cycles.',
  },
  {
    number: '05',
    icon: 'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
    title: 'Appreciation',
    description: 'Property values rise over time, building long-term equity. Benefit from capital growth while your tenants pay down your mortgage.',
  },
  {
    number: '06',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    title: 'Inflation Protection',
    description: 'Property values and rents rise with inflation, keeping you ahead. Your investment naturally adjusts to maintain purchasing power.',
  },
  {
    number: '07',
    icon: 'M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z',
    title: 'Tax Advantages',
    description: 'Property offers powerful tax efficiencies that help you retain more wealth. From allowable expenses to capital gains strategies.',
  },
];

const whoShouldAttend = [
  {
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    title: 'First-Time Buyers',
    description: 'Looking to get on the property ladder and want to understand how to make your first purchase work as an investment.',
  },
  {
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
    title: 'Aspiring Property Investors',
    description: 'You\'ve been thinking about investing in property but don\'t know where to start or how to analyse a deal.',
  },
  {
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    title: 'Existing Homeowners',
    description: 'You own your home and want to understand how to use your equity to build a property portfolio and create additional income.',
  },
  {
    icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
    title: 'Anyone Seeking Financial Freedom',
    description: 'You want to build long-term wealth and are looking for a proven, practical approach to achieving financial independence.',
  },
];

const seminarBenefits = [
  'Live, interactive session with Q&A',
  'Real-world case studies and examples',
  'Actionable strategies you can implement immediately',
  'Networking with like-minded investors',
];


const testimonials = [
  {
    name: 'Y. Olaide-Kolapo',
    quote: 'When I was considering buying my first property, I sought advice from Chris, knowing he had entered the property market at 22. What began as a simple conversation ignited a shift in my mindset, giving me the confidence to take action and ultimately helping me get onto the property ladder at 24.\n\nMore recently, my wife and I approached him again while navigating a more complex situation, as we both owned property before marriage and are now looking to buy a family home. His knowledge of the current market and higher-level tax implications challenged us to think more strategically and beyond the obvious options.\n\nThe advice was given freely, clearly explained, and encouraged us to do our own research, making the process empowering. Based on my experience, I would highly recommend buying the book and attending the seminar for anyone serious about building wealth through property.',
  },
  {
    name: 'E. Opoko',
    quote: 'When I was preparing to buy my home, Chris provided me with clear, practical guidance. Through our conversations, he helped me understand what to look out for during inspections, the current property trends and broke the investment process down in a way that felt achievable, and I was able to complete the process in less than a year. I always walked away better equipped to make wise decisions, with greater confidence and a long-term mindset. I\'m truly grateful for his counsel and would highly recommend his insight to anyone looking to build wealth through property.',
  },
  {
    name: 'S. Omo-ovie',
    quote: 'Chris has given me so much support, wisdom, and practical advice, and I\'m just one of so many who\'ve really benefited from his experience. He\'s thoughtful, kind, and honest, and he shares guidance that\'s both compassionate and down to earth. His practical advice about investing in property—focusing on being pro-active, responsible, and thinking long term—has helped me make clearer, more confident decisions. With his support, I was able to get onto the property ladder, and his continued guidance keeps me moving forward. I\'m truly grateful for his support, and I encourage you to buy his book \'Build Wealth through Property: 7 Reasons Why\' and connect with him on all his platforms—you\'ll be glad you did!',
  },
];

const faqs = [
  {
    question: 'Who is this seminar for?',
    answer: 'This seminar is designed for anyone interested in property investment — whether you\'re a complete beginner looking to buy your first property, a homeowner wanting to leverage your equity, or an existing investor wanting to refine your strategy and scale your portfolio. The content is based on the book "Build Wealth Through Property: 7 Reasons Why" and is accessible to all levels.',
  },
  {
    question: 'Do I need any prior experience?',
    answer: 'No prior experience is required. The seminar is structured to be accessible for beginners while still providing advanced insights for experienced investors. We start with the fundamentals — the 7 reasons why property is such a powerful wealth-building vehicle — and build up to more sophisticated strategies.',
  },
  {
    question: 'How long is the seminar?',
    answer: 'The seminar runs from 2pm to 5pm (3 hours), covering all 7 reasons with practical examples, case studies, and interactive Q&A sessions throughout. You\'ll receive the full schedule and venue details upon registration.',
  },
  {
    question: 'Will I receive any materials?',
    answer: 'The seminar ticket covers admission to the live session, including interactive Q&A and networking with like-minded investors. The book, resource packs, and recordings are not included with the ticket but can be purchased separately.',
  },
  {
    question: 'Is this seminar available online?',
    answer: 'No, this is an in-person only event held at the Europa Hotel, Great Victoria St, Belfast BT2 7AP. There is no virtual or online attendance option. After purchasing your ticket, you\'ll receive a confirmation email with full venue details and directions.',
  },
  {
    question: 'What makes this different from other property seminars?',
    answer: 'This seminar is rooted in real experience, not theory. Christopher Ifonlaja got onto the property ladder at 22 and has built a growing portfolio through patience, discipline, and ethical investing. There are no get-rich-quick promises — just proven, practical strategies that work over time. The seminar is an extension of the book, bringing the 7 reasons to life with interactive exercises and real case studies.',
  },
  {
    question: 'Is there a refund policy?',
    answer: 'Yes, we offer a full refund if you cancel at least 7 days before the seminar date. For cancellations within 7 days, we can transfer your ticket to a future date. Please see our refund policy page for full details.',
  },
];


const SEMINAR_DATE = new Date('2026-03-14T14:00:00Z'); // 14 March 2026, 2:00 PM GMT

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isLive: boolean;
  isPast: boolean;
}

const getTimeRemaining = (): CountdownTime => {
  const now = new Date().getTime();
  const target = SEMINAR_DATE.getTime();
  const diff = target - now;
  const seminarEnd = target + 3 * 60 * 60 * 1000; // 3 hours later (5pm)

  if (diff <= 0 && now <= seminarEnd) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isLive: true, isPast: false };
  }
  if (now > seminarEnd) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isLive: false, isPast: true };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
    isLive: false,
    isPast: false,
  };
};

const Seminar: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeReason, setActiveReason] = useState<number | null>(null);
  const [countdown, setCountdown] = useState<CountdownTime>(getTimeRemaining());

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getTimeRemaining());
    }, 1000);
    return () => clearInterval(timer);
  }, []);


  return (
    <div className="min-h-screen bg-slate-900">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-16 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-slate-900 to-slate-900" />
          <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            {/* Text Content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 mb-6">
                <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                <span className="text-amber-400 text-sm font-medium">Live Property Investment Seminar</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Build Wealth
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
                  Through Property
                </span>
                <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-4xl text-slate-300 mt-2 font-semibold">
                  7 Reasons Why
                </span>
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-slate-300 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Join author <span className="text-amber-400 font-semibold">Christopher Ifonlaja</span> for an intensive, interactive seminar based on his book. Discover the 7 powerful reasons why property investment is the cornerstone of lasting wealth — and learn how to take action.
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-3 mb-8">
                {[

                  { label: 'Based on the Book', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
                  { label: 'Interactive Q&A', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
                  { label: 'Practical Strategies', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
                  { label: 'In-Person Only', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' },

                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-slate-400">
                    <svg className="w-4 h-4 text-amber-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Countdown Timer */}
              <div className="mb-8">
                {countdown.isLive ? (
                  <div className="bg-gradient-to-r from-amber-500/15 to-amber-600/10 border border-amber-500/30 rounded-2xl p-5 sm:p-6 max-w-lg mx-auto lg:mx-0">
                    <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
                      </span>
                      <span className="text-amber-400 font-bold text-lg sm:text-xl">The seminar is happening now!</span>
                    </div>
                    <p className="text-slate-400 text-sm text-center lg:text-left">
                      Europa Hotel, Belfast — In session until 5pm GMT
                    </p>
                  </div>
                ) : countdown.isPast ? (
                  <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5 sm:p-6 max-w-lg mx-auto lg:mx-0">
                    <p className="text-slate-400 text-sm text-center lg:text-left">
                      This seminar has ended. Stay tuned for future events.
                    </p>
                  </div>
                ) : (
                  <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5 sm:p-6 max-w-lg mx-auto lg:mx-0">
                    <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                      <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-amber-400 text-sm font-semibold uppercase tracking-wider">Seminar starts in</span>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        { value: countdown.days, label: 'Days' },
                        { value: countdown.hours, label: 'Hours' },
                        { value: countdown.minutes, label: 'Mins' },
                        { value: countdown.seconds, label: 'Secs' },
                      ].map((unit, i) => (
                        <div key={i} className="text-center">
                          <div className="bg-slate-900/80 border border-slate-600/30 rounded-xl py-2.5 sm:py-3 px-1 mb-1.5">
                            <span className="text-white font-bold text-2xl sm:text-3xl tabular-nums">
                              {String(unit.value).padStart(2, '0')}
                            </span>
                          </div>
                          <span className="text-slate-500 text-[10px] sm:text-xs font-medium uppercase tracking-wider">{unit.label}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-slate-500 text-xs text-center lg:text-left mt-3">
                      Saturday, 14 March 2026 at 2:00 PM GMT
                    </p>
                  </div>
                )}
              </div>


              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/seminar-purchase"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-8 py-4 rounded-xl text-lg transition-all hover:shadow-xl hover:shadow-amber-500/30 hover:-translate-y-1 inline-flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                  Book Your Ticket — £25
                </Link>
                <button
                  onClick={() => {
                    const el = document.getElementById('seven-reasons');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl text-lg border border-white/20 transition-all hover:-translate-y-1 inline-flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                  Discover the 7 Reasons
                </button>
              </div>
            </div>

            {/* Visual Card — Event Details + Book */}
            <div className="flex-shrink-0 w-full max-w-sm lg:max-w-md">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-amber-500/20 to-emerald-500/10 rounded-3xl blur-2xl opacity-60" />
                <div className="relative bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 sm:p-8">
                  {/* Book image */}
                  <div className="flex justify-center mb-6">
                    <img
                      src="https://d64gsuwffb70l.cloudfront.net/6973e5e8bbb2ae01621a037e_1770743948016_23a5e51b.png"
                      alt="Build Wealth Through Property - 7 Reasons Why"
                      className="w-40 sm:w-48 rounded-lg shadow-xl shadow-black/30"
                    />
                  </div>

                  {/* Seminar card */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-slate-900">
                        <path d="M3 21V9L12 3L21 9V21H15V14H9V21H3Z" fill="currentColor" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">Property Seminar</h3>
                      <p className="text-amber-400 text-sm font-medium">Build Wealth Through Property</p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    {[
                      { icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', label: 'Saturday, 14 March 2026', color: 'text-amber-400' },
                      { icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', label: '2pm – 5pm (3 hours)', color: 'text-emerald-400' },
                      { icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z', label: 'Europa Hotel, Belfast', color: 'text-indigo-400' },
                      { icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', label: 'Hosted by Christopher Ifonlaja', color: 'text-amber-400' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <svg className={`w-5 h-5 ${item.color} flex-shrink-0 mt-0.5`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                        </svg>
                        <div>
                          <span className="text-slate-300 text-sm">{item.label}</span>
                          {item.label === 'Europa Hotel, Belfast' && (
                            <span className="text-slate-500 text-xs block">Great Victoria St, Belfast BT2 7AP</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>


                  {/* Price display */}
                  <div className="flex items-center justify-between mb-4 bg-slate-700/30 border border-slate-600/30 rounded-xl p-4">
                    <div>
                      <p className="text-white font-bold text-2xl">£25<span className="text-slate-400 text-sm font-normal">.00</span></p>
                    </div>
                    <div className="text-right">
                      <p className="text-emerald-400 text-xs font-medium">Seminar admission</p>
                      <p className="text-slate-500 text-xs">2pm – 5pm</p>

                    </div>
                  </div>

                  <Link
                    to="/seminar-purchase"
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-bold py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/25 flex items-center justify-center gap-2 text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Secure Your Ticket Now
                  </Link>


                  {/* Add to Calendar */}
                  <AddToCalendarButton variant="secondary" className="w-full mt-3" />

                  <p className="text-slate-500 text-xs text-center mt-3 flex items-center justify-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Secure payment via Stripe
                  </p>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8 border-y border-slate-800/50">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {[
              { label: 'Based on the bestselling book', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
              { label: 'Practical, real-world strategies', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
              { label: 'No get-rich-quick schemes', icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
              { label: 'Ethical, long-term approach', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-slate-400">
                <svg className="w-4 h-4 text-amber-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                </svg>
                <span className="text-xs sm:text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The 7 Reasons Section */}
      <section id="seven-reasons" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-amber-400 font-semibold text-sm uppercase tracking-wider">What You'll Learn</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
              The 7 Reasons Why Property
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
                Builds Lasting Wealth
              </span>
            </h2>
            <p className="text-slate-400 text-base sm:text-lg max-w-3xl mx-auto">
              Based on the book <em className="text-amber-400/80">"Build Wealth Through Property: 7 Reasons Why"</em>, this seminar brings each reason to life with real examples, case studies, and actionable strategies you can implement immediately.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sevenReasons.map((reason, index) => (
              <div
                key={index}
                className={`group relative bg-slate-800/50 backdrop-blur-sm border rounded-2xl p-6 sm:p-8 transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/5
                  ${activeReason === index ? 'border-amber-500/50 bg-slate-800 shadow-xl shadow-amber-500/10' : 'border-slate-700/50 hover:bg-slate-800 hover:border-amber-500/30'}
                  ${index === 6 ? 'sm:col-span-2 lg:col-span-1 lg:col-start-2' : ''}
                `}
                onClick={() => setActiveReason(activeReason === index ? null : index)}
                onMouseEnter={() => setActiveReason(index)}
                onMouseLeave={() => setActiveReason(null)}
              >
                <div className="absolute top-4 right-4 text-5xl font-bold text-slate-700/20 group-hover:text-amber-500/15 transition-colors">
                  {reason.number}
                </div>
                <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center mb-5 group-hover:bg-amber-500/20 transition-colors">
                  <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={reason.icon} />
                  </svg>
                </div>
                <h3 className="text-white font-bold text-lg mb-3 group-hover:text-amber-400 transition-colors">
                  {reason.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {reason.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/seminar-purchase"
              className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-8 py-4 rounded-xl text-lg transition-all hover:shadow-xl hover:shadow-amber-500/30 hover:-translate-y-1"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              Learn All 7 Reasons — Book Your Ticket
            </Link>
          </div>
        </div>
      </section>

      {/* Who Should Attend */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-amber-400 font-semibold text-sm uppercase tracking-wider">Who Is This For</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-4 mb-6">
              This Seminar Is For You If...
            </h2>
            <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
              Whether you're just starting out or looking to take your property journey to the next level, this seminar will give you the knowledge and confidence to act.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {whoShouldAttend.map((item, i) => (
              <div key={i} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 sm:p-8 hover:border-amber-500/30 transition-all group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-amber-500/20 transition-colors">
                    <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-2 group-hover:text-amber-400 transition-colors">{item.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Attend Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            {/* Content */}
            <div className="flex-1 text-center lg:text-left">
              <span className="text-amber-400 font-semibold text-sm uppercase tracking-wider">Why Attend</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mt-4 mb-6">
                More Than Just a Seminar —
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600"> A Launchpad</span>
              </h2>
              <p className="text-slate-300 text-base sm:text-lg mb-8 leading-relaxed">
                This isn't a theoretical lecture or a get-rich-quick pitch. It's a hands-on, practical session rooted in real experience, designed to give you the confidence, knowledge, and tools to take real action in property investment. Based on the principles in the book, the seminar brings the 7 reasons to life.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {seminarBenefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3.5 h-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-slate-300 text-sm">{benefit}</span>
                  </div>
                ))}
              </div>

              <Link
                to="/seminar-purchase"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-bold px-8 py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/25"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
                Reserve Your Seat — £25
              </Link>
            </div>

            {/* What's Included Card */}
            <div className="w-full max-w-sm flex-shrink-0">
              <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 sm:p-8">
                <h4 className="text-white font-bold text-xl mb-6 flex items-center gap-2">
                  <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                  What's Included
                </h4>
                <ul className="space-y-4">
                  {[
                    { label: 'Seminar access (2pm – 5pm)', desc: 'All 7 reasons covered in depth' },
                    { label: 'Interactive Q&A sessions', desc: 'Get your questions answered live' },
                    { label: 'Networking opportunity', desc: 'Connect with like-minded investors' },
                  ].map((item, i) => (

                    <li key={i} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <div>
                        <span className="text-white text-sm font-medium block">{item.label}</span>
                        <span className="text-slate-500 text-xs">{item.desc}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About the Speaker */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-amber-400 font-semibold text-sm uppercase tracking-wider">Your Host</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-4">
              Meet Christopher Ifonlaja
            </h2>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 sm:p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Author Image */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center">
                  <svg className="w-16 h-16 sm:w-20 sm:h-20 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>

              {/* Bio */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-white font-bold text-xl sm:text-2xl mb-2">Christopher Ifonlaja</h3>
                <p className="text-amber-400 font-medium mb-4">Author, Property Investor & Seminar Host</p>
                <p className="text-slate-300 leading-relaxed mb-4 text-sm sm:text-base">
                  Christopher got onto the property ladder at just 22 years old and has since built a growing portfolio through patience, discipline, and ethical investing. He is the author of <em className="text-amber-400/80">"Build Wealth Through Property: 7 Reasons Why"</em>, a practical guide that has helped countless readers understand the power of property investment.
                </p>
                <p className="text-slate-400 leading-relaxed text-sm sm:text-base mb-4">
                  His approach is grounded in long-term thinking — no get-rich-quick schemes, just proven strategies that work over time. The seminar is an extension of his book, bringing the 7 reasons to life through interactive sessions, real case studies, and practical exercises that empower attendees to take confident action.
                </p>
                <p className="text-slate-400 leading-relaxed text-sm sm:text-base">
                  Christopher is passionate about financial literacy and helping others achieve financial freedom through property. His teaching style is clear, compassionate, and down-to-earth — making complex topics accessible to everyone.
                </p>

                <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6">
                  <Link
                    to="/"
                    className="text-amber-400 hover:text-amber-300 font-medium text-sm flex items-center gap-1.5 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Read the Book
                  </Link>
                  <a
                    href="https://www.instagram.com/buildwealththroughproperty/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 font-medium text-sm flex items-center gap-1.5 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16 4H8a4 4 0 00-4 4v8a4 4 0 004 4h8a4 4 0 004-4V8a4 4 0 00-4-4zm-4 11a3 3 0 110-6 3 3 0 010 6zm4.5-7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                    Follow on Instagram
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expert Panel */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-amber-400 font-semibold text-sm uppercase tracking-wider">Expert Panel</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
              Learn From Industry
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
                Professionals
              </span>
            </h2>
            <p className="text-slate-400 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
              Following the main talk, attendees will hear from a panel of local property professionals who bring practical insight from different stages of the property journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Lewis Mills */}
            <div className="group bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 sm:p-8 hover:border-amber-500/30 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/5">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="absolute -inset-2 bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                  <img
                    src="https://d64gsuwffb70l.cloudfront.net/6973e5e8bbb2ae01621a037e_1771439589358_a1872850.jfif"
                    alt="Lewis Mills - Mortgage Adviser"
                    className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full object-cover border-2 border-slate-700/50 group-hover:border-amber-500/40 transition-colors shadow-lg shadow-black/20"
                  />
                </div>
                <h3 className="text-white font-bold text-xl sm:text-2xl mb-1 group-hover:text-amber-400 transition-colors">Lewis Mills</h3>
                <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 mb-5">
                  <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-amber-400 text-sm font-semibold">Mortgage Adviser</span>
                </div>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  A Belfast-based mortgage adviser specializing in everything from first-time buyers to experienced buy-to-let investors. With access to lenders across the UK, he provides expert guidance on mortgage affordability, interest rate risk, and tailored financing strategies to help clients make confident property investment decisions.
                </p>
              </div>
            </div>

            {/* Chris Dolan */}
            <div className="group bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 sm:p-8 hover:border-amber-500/30 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/5">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="absolute -inset-2 bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                  <img
                    src="https://d64gsuwffb70l.cloudfront.net/6973e5e8bbb2ae01621a037e_1771439645725_3573cb0e.jfif"
                    alt="Chris Dolan - Estate Agent"
                    className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full object-cover border-2 border-slate-700/50 group-hover:border-amber-500/40 transition-colors shadow-lg shadow-black/20"
                  />
                </div>
                <h3 className="text-white font-bold text-xl sm:text-2xl mb-1 group-hover:text-amber-400 transition-colors">Chris Dolan</h3>
                <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 mb-5">
                  <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21V9L12 3L21 9V21H15V14H9V21H3Z" />
                  </svg>
                  <span className="text-amber-400 text-sm font-semibold">Estate Agent</span>
                </div>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Expert insights on buying and selling in the current market, property valuations, and market trends.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-amber-400 font-semibold text-sm uppercase tracking-wider">Testimonials</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-4 mb-6">
              What People Say About Christopher's Guidance
            </h2>
            <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
              Hear from people who have benefited from Christopher's property investment advice and guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <div
                key={i}
                className="bg-slate-800/80 border border-slate-700/50 rounded-2xl p-6 sm:p-8 transition-all hover:border-amber-500/30 flex flex-col"
              >
                {/* Quote icon */}
                <div className="mb-4">
                  <svg className="w-8 h-8 text-amber-500/30" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>

                <div className="flex-1 mb-6">
                  {testimonial.quote.split('\n\n').map((paragraph, pIdx) => (
                    <p key={pIdx} className="text-slate-300 leading-relaxed text-sm sm:text-base mb-3 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-700/50">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-slate-900 font-bold text-sm">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{testimonial.name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Venue Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-amber-400 font-semibold text-sm uppercase tracking-wider">The Venue</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-4 mb-6">
              Europa Hotel, Belfast
            </h2>
            <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
              Join us at one of Belfast's most iconic and centrally located hotels — perfectly situated in the heart of the city with excellent transport links.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Venue Image & Details */}
            <div className="flex-1">
              <div className="rounded-2xl overflow-hidden mb-6">
                <img
                  src="https://d64gsuwffb70l.cloudfront.net/6973e5e8bbb2ae01621a037e_1771434091580_f1a1a25b.png"
                  alt="Europa Hotel, Belfast - Seminar Venue"
                  className="w-full h-64 sm:h-80 object-cover"
                />
              </div>

              <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">Europa Hotel</h3>
                    <p className="text-slate-400 text-sm">Great Victoria St, Belfast BT2 7AP</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                  {[
                    { icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', label: 'Saturday, 14 March 2026', color: 'text-amber-400' },
                    { icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', label: '2pm – 5pm', color: 'text-emerald-400' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <svg className={`w-4 h-4 ${item.color} flex-shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                      </svg>
                      <span className="text-slate-300 text-sm">{item.label}</span>
                    </div>
                  ))}
                </div>

                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=Europa+Hotel+Great+Victoria+St+Belfast+BT2+7AP"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 hover:text-indigo-300 font-semibold py-3 rounded-xl border border-indigo-500/20 hover:border-indigo-500/40 transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Get Directions via Google Maps
                </a>

                {/* Add to Calendar */}
                <AddToCalendarButton variant="outline" className="w-full mt-3" />
              </div>

            </div>

            {/* Map Embed */}
            <div className="lg:w-[420px] flex-shrink-0">
              <div className="rounded-2xl overflow-hidden border border-slate-700/50 h-full min-h-[400px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2312.5!2d-5.9345!3d54.5947!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x486108f1b1b1b1b1%3A0x0!2sEuropa%20Hotel!5e0!3m2!1sen!2suk!4v1700000000000!5m2!1sen!2suk"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '400px' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Europa Hotel, Belfast - Map"
                  className="w-full h-full"
                />
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <a
                  href="https://www.google.com/maps/place/Europa+Hotel/@54.5947,-5.9345,17z/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-amber-400 text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Open in Google Maps
                </a>
                <p className="text-slate-500 text-xs">
                  Near Great Victoria Street Bus & Rail Station. City centre parking available nearby.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Event Details / Registration CTA */}
      <section id="seminar-registration" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-amber-400 font-semibold text-sm uppercase tracking-wider">Event Details</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
              Secure Your Spot
            </h2>
            <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
              Places are limited. Book your ticket now and take the first step towards building lasting wealth through property.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Main Registration Card */}
            <div className="flex-1">
              <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 sm:p-8 md:p-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-slate-900">
                      <path d="M3 21V9L12 3L21 9V21H15V14H9V21H3Z" fill="currentColor" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-xl sm:text-2xl">Build Wealth Through Property</h3>
                    <p className="text-amber-400 font-medium">Live Seminar — 7 Reasons Why</p>
                  </div>
                </div>

                {/* Event Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  <div className="bg-slate-700/30 border border-slate-600/30 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-slate-400 text-sm font-medium">Date</span>
                    </div>
                    <p className="text-white font-semibold">Saturday, 14 March 2026</p>
                  </div>

                  <div className="bg-slate-700/30 border border-slate-600/30 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-slate-400 text-sm font-medium">Duration</span>
                    </div>
                    <p className="text-white font-semibold">2pm – 5pm (3 hours)</p>

                  </div>

                  <div className="bg-slate-700/30 border border-slate-600/30 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-slate-400 text-sm font-medium">Venue</span>
                    </div>
                    <p className="text-white font-semibold">Europa Hotel</p>
                    <p className="text-slate-400 text-xs mt-0.5">Great Victoria St, Belfast BT2 7AP</p>
                  </div>

                  <div className="bg-slate-700/30 border border-slate-600/30 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-slate-400 text-sm font-medium">Host</span>
                    </div>
                    <p className="text-white font-semibold">Christopher Ifonlaja</p>
                  </div>
                </div>

                {/* Price + CTA */}
                <div className="bg-gradient-to-r from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-xl p-5 mb-6">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-amber-400 font-bold text-2xl">£25<span className="text-slate-400 text-sm font-normal">.00</span></span>
                  </div>
                  <p className="text-slate-500 text-xs">Includes seminar admission, Q&A access & networking</p>

                </div>

                <Link
                  to="/seminar-purchase"
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-bold py-4 rounded-xl text-lg transition-all hover:shadow-lg hover:shadow-amber-500/25 flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Buy Your Ticket Now — £25
                </Link>

                <p className="text-slate-500 text-xs text-center mt-4 flex items-center justify-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Secure checkout powered by Stripe. Limited places available.
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:w-80 flex-shrink-0 space-y-6">
              {/* Book Connection */}
              <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">
                <h4 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Based on the Book
                </h4>
                <div className="flex justify-center mb-4">
                  <img
                    src="https://d64gsuwffb70l.cloudfront.net/6973e5e8bbb2ae01621a037e_1770743948016_23a5e51b.png"
                    alt="Build Wealth Through Property"
                    className="w-28 rounded-lg shadow-lg shadow-black/20"
                  />
                </div>
                <p className="text-slate-400 text-sm text-center mb-4">
                  The seminar brings the book's 7 reasons to life with interactive sessions and real case studies.
                </p>
                <Link
                  to="/"
                  className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-2.5 rounded-xl border border-white/20 transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Explore the Book
                </Link>
              </div>

              {/* Contact */}
              <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">
                <h4 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Questions?
                </h4>
                <p className="text-slate-400 text-sm mb-4">
                  Have questions about the seminar? We're happy to help.
                </p>
                <a
                  href="mailto:support@buildwealththroughproperty.com"
                  className="text-amber-400 hover:text-amber-300 text-sm font-medium flex items-center gap-2 transition-colors mb-3"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  support@buildwealththroughproperty.com
                </a>
                <a
                  href="https://www.instagram.com/buildwealththroughproperty/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center gap-2 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 4H8a4 4 0 00-4 4v8a4 4 0 004 4h8a4 4 0 004-4V8a4 4 0 00-4-4zm-4 11a3 3 0 110-6 3 3 0 010 6zm4.5-7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                  @buildwealththroughproperty
                </a>
              </div>

              {/* Other Resources */}
              <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">
                <h4 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  More Resources
                </h4>
                <div className="space-y-2">
                  <Link to="/course" className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-700/30 transition-colors group">
                    <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    <span className="text-slate-300 text-sm group-hover:text-indigo-400 transition-colors">Beginner Course</span>
                  </Link>
                  <Link to="/masterclass" className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-700/30 transition-colors group">
                    <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                    <span className="text-slate-300 text-sm group-hover:text-amber-400 transition-colors">Masterclass</span>
                  </Link>
                  <Link to="/calculator" className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-700/30 transition-colors group">
                    <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                    <span className="text-slate-300 text-sm group-hover:text-emerald-400 transition-colors">Investment Calculator</span>
                  </Link>
                  <Link to="/start" className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-700/30 transition-colors group">
                    <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    <span className="text-slate-300 text-sm group-hover:text-amber-400 transition-colors">Free Starter Pack</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-amber-400 font-semibold text-sm uppercase tracking-wider">FAQ</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-4 mb-6">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden transition-all hover:border-slate-600/50"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5 text-left"
                >
                  <span className="text-white font-medium text-sm sm:text-base pr-4">{faq.question}</span>
                  <svg
                    className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6">
                    <p className="text-slate-400 text-sm sm:text-base leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-900/20 via-slate-900 to-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            <span className="text-amber-400 text-sm font-medium">Limited Seats Available</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Discover the 7 Reasons
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
              Property Builds Lasting Wealth?
            </span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Don't wait for the "perfect time" — the best time to learn about property investment is now. Join Christopher Ifonlaja at the next <em>Build Wealth Through Property</em> seminar and take the first step towards building lasting wealth.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/seminar-purchase"
              className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-10 py-4 rounded-xl text-lg transition-all hover:shadow-xl hover:shadow-amber-500/30 hover:-translate-y-1"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              Book Your Ticket Now — £25
            </Link>
            <Link
              to="/"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-10 py-4 rounded-xl text-lg border border-white/20 transition-all hover:-translate-y-1 inline-flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Explore the Book
            </Link>
          </div>

          {/* Other resources */}
          <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
            <Link to="/course" className="group bg-slate-800/40 border border-slate-700/30 rounded-xl p-4 hover:border-indigo-500/30 transition-all">
              <svg className="w-6 h-6 text-indigo-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p className="text-slate-300 text-xs font-medium group-hover:text-indigo-400 transition-colors">Beginner Course</p>
            </Link>
            <Link to="/masterclass" className="group bg-slate-800/40 border border-slate-700/30 rounded-xl p-4 hover:border-amber-500/30 transition-all">
              <svg className="w-6 h-6 text-amber-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              <p className="text-slate-300 text-xs font-medium group-hover:text-amber-400 transition-colors">Masterclass</p>
            </Link>
            <Link to="/calculator" className="group bg-slate-800/40 border border-slate-700/30 rounded-xl p-4 hover:border-emerald-500/30 transition-all">
              <svg className="w-6 h-6 text-emerald-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <p className="text-slate-300 text-xs font-medium group-hover:text-emerald-400 transition-colors">Calculator</p>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Seminar;
