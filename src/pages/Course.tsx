import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCourseSettingByCourseId } from '@/lib/firebaseCourseSettings';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { fullUrl, jsonLdCourse } from '@/lib/seo';

import CourseHero from '@/components/Course/CourseHero';
import CourseCurriculum from '@/components/Course/CourseCurriculum';
import {
  InstructorSection,
  SuccessStoriesSection,
  WhatsIncludedSection,
  PricingSection,
  GuaranteeSection,
  CourseFAQSection,
  CourseFinalCTA,
} from '@/components/Course/CourseSections';

interface CourseSetting {
  visible: boolean;
  purchasable: boolean;
  coming_soon_message: string;
  title: string;
  price?: string;
}

const Course: React.FC = () => {
  const [courseSettings, setCourseSettings] = useState<CourseSetting | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getCourseSettingByCourseId('beginner-course');
        if (data) {
          setCourseSettings({ visible: data.visible, purchasable: data.purchasable, coming_soon_message: data.coming_soon_message, title: data.title, price: data.price });
        } else {
          setCourseSettings({ visible: true, purchasable: true, coming_soon_message: '', title: 'Beginners', price: '£97' });
        }
      } catch (err) {
        console.error('Error fetching course settings:', err);
        setCourseSettings({ visible: true, purchasable: true, coming_soon_message: '', title: 'Beginners', price: '£97' });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const courseTitle = courseSettings?.title || 'Property Investing Course';
  const courseDescription = 'Structured course for beginner property investors. Learn the fundamentals and take action.';

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-10 h-10 animate-spin text-indigo-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Coming Soon state - course is locked
  if (courseSettings && !courseSettings.visible) {
    return (
      <div className="min-h-screen bg-slate-900">
        <Header />
        <main id="main-content">
        {/* Coming Soon Content */}
        <div className="flex items-center justify-center mt-16 min-h-screen px-4">
          <div className="max-w-2xl w-full text-center">
            {/* Animated icon */}
            <div className="relative mb-8 inline-block">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-3xl flex items-center justify-center mx-auto border border-indigo-500/30">
                <svg className="w-12 h-12 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6l4 2" />
                </svg>
              </div>
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full mb-6">
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
              <span className="text-indigo-400 font-semibold text-sm">Coming Soon</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              {courseSettings.title || 'Beginners'}
            </h1>

            {/* Message */}
            <p className="text-lg text-slate-400 mb-8 max-w-lg mx-auto leading-relaxed">
              {courseSettings.coming_soon_message || 'This course is currently being developed. Sign up to be notified when it launches!'}
            </p>

            {/* Divider */}
            <div className="w-16 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mb-8 rounded-full" />

            {/* CTA Section */}
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-8 max-w-md mx-auto">
              <h3 className="text-white font-semibold mb-2">Get notified when we launch</h3>
              <p className="text-slate-400 text-sm mb-6">
                Join our mailing list and be the first to know when this course goes live.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/start"
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-semibold px-6 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-indigo-500/25 text-sm text-center"
                >
                  Join the Waitlist
                </Link>
                <Link
                  to="/"
                  className="flex-1 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 text-slate-300 hover:text-white font-semibold px-6 py-3 rounded-xl transition-all text-sm text-center"
                >
                  Explore the Book
                </Link>
              </div>
            </div>

            {/* Other resources */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
              <Link to="/" className="group bg-slate-800/40 border border-slate-700/30 rounded-xl p-4 hover:border-amber-500/30 transition-all">
                <svg className="w-6 h-6 text-amber-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <p className="text-slate-300 text-xs font-medium group-hover:text-amber-400 transition-colors">The Book</p>
              </Link>
              <Link to="/masterclass" className="group bg-slate-800/40 border border-slate-700/30 rounded-xl p-4 hover:border-amber-500/30 transition-all">
                <svg className="w-6 h-6 text-amber-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                <p className="text-slate-300 text-xs font-medium group-hover:text-amber-400 transition-colors">Masterclass</p>
              </Link>
              <Link to="/calculator" className="group bg-slate-800/40 border border-slate-700/30 rounded-xl p-4 hover:border-amber-500/30 transition-all">
                <svg className="w-6 h-6 text-amber-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <p className="text-slate-300 text-xs font-medium group-hover:text-amber-400 transition-colors">Calculator</p>
              </Link>
            </div>
          </div>
        </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <SEO
        title={courseTitle}
        description={courseDescription}
        jsonLd={jsonLdCourse({
          name: courseTitle,
          description: courseDescription,
          url: fullUrl('/course'),
          provider: 'Build Wealth Through Property',
        })}
      />
      <Header />
      <main id="main-content">
      {/* Hero */}
      <CourseHero />

      {/* Trust bar */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-y border-slate-800/50">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
            {[
              { label: 'Based on a bestselling book', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
              { label: 'Taught by a real investor', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
              { label: '30-day money-back guarantee', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
              { label: 'Lifetime access', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
              { label: 'Hosted on Systeme.io', icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-slate-400">
                <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                </svg>
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem / Solution bridge */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-indigo-400 font-semibold text-sm uppercase tracking-wider">The Gap Between Knowledge and Action</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-4">
              You've read the book. Now what?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Problem */}
            <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-8">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-white font-bold text-xl mb-4">Without a clear system...</h3>
              <ul className="space-y-3">
                {[
                  'You understand the "why" but not the "how"',
                  'Paralysed by too many options and opinions',
                  'Can\'t tell a good deal from a bad one',
                  'Unsure about mortgages, legals, and costs',
                  'Months of "researching" with no action taken',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-slate-400 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Solution */}
            <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-2xl p-8">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-white font-bold text-xl mb-4">With this course...</h3>
              <ul className="space-y-3">
                {[
                  'A clear, step-by-step path from start to finish',
                  'Analyse any deal confidently in minutes',
                  'Understand exactly what you can afford',
                  'Make offers and negotiate with confidence',
                  'Be a prepared, compliant landlord from day one',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-slate-300 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Who is this for? */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-indigo-400 font-semibold text-sm uppercase tracking-wider">Is This For You?</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-4">
              This course is for you if...
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              'You\'ve read the book and want to take the next step',
              'You\'re a complete beginner who wants a structured path',
              'You want to buy your first buy-to-let property',
              'You\'re tired of free content that goes in circles',
              'You want practical tools (not just theory)',
              'You value a calm, honest approach over hype',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-slate-800/60 border border-slate-700/40 rounded-xl p-4">
                <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-slate-300 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <CourseCurriculum />

      {/* What's Included */}
      <WhatsIncludedSection />

      {/* Instructor */}
      <div data-section="instructor">
        <InstructorSection />
      </div>

      {/* Success Stories */}
      <SuccessStoriesSection />

      {/* Pricing */}
      <PricingSection price={courseSettings?.price} courseTitle={courseSettings?.title} />

      {/* Guarantee */}
      <GuaranteeSection />

      {/* FAQ */}
      <CourseFAQSection />

      {/* Final CTA */}
      <CourseFinalCTA />
      </main>
      <Footer />

    </div>
  );
};

export default Course;
