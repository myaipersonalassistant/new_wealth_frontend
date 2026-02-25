import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  createFoundationOrder,
  subscribeToFoundationStats,
  getBuildingFundGoal,
  FOUNDATION_PRICE,
} from '@/lib/foundation';
import { createFoundationCheckoutSession } from '@/lib/stripe';
import { Loader2, AlertCircle } from 'lucide-react';

const Foundation: React.FC = () => {
  const [stats, setStats] = useState({ copiesSold: 0, totalRaised: 0 });
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postcode: '',
  });
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const unsub = subscribeToFoundationStats(
      (s) => setStats(s),
      () => setStats({ copiesSold: 0, totalRaised: 0 })
    );
    return unsub;
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openPurchase = () => {
    setShowPurchaseForm(true);
    scrollToSection('purchase');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('Please enter your full name');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Please enter your email address');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.address.trim()) {
      setError('Please enter your address');
      return false;
    }
    if (!formData.city.trim()) {
      setError('Please enter your city');
      return false;
    }
    if (!formData.postcode.trim()) {
      setError('Please enter your postcode');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsProcessing(true);
    setError(null);

    try {
      const total = FOUNDATION_PRICE * quantity;
      const orderData = {
        customer_name: formData.name.trim(),
        customer_email: formData.email.trim().toLowerCase(),
        customer_phone: formData.phone.trim() || undefined,
        shipping_address: formData.address.trim(),
        shipping_city: formData.city.trim(),
        shipping_postcode: formData.postcode.trim(),
      };

      const orderId = await createFoundationOrder({
        ...orderData,
        quantity,
        unit_price: FOUNDATION_PRICE,
        total_amount: total,
        status: 'pending',
      });

      sessionStorage.setItem('bwtp_checkout_email', formData.email.trim().toLowerCase());
      sessionStorage.setItem('bwtp_checkout_name', formData.name.trim());
      sessionStorage.setItem('bwtp_checkout_product', 'foundation');

      const result = await createFoundationCheckoutSession({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim() || undefined,
        address: formData.address.trim(),
        city: formData.city.trim(),
        postcode: formData.postcode.trim(),
        quantity,
        orderId,
      });

      if (result.error) throw new Error(result.error);
      if (result.url) {
        window.location.href = result.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setIsProcessing(false);
    }
  };

  const goal = getBuildingFundGoal();
  const progressPercent = Math.min(100, (stats.totalRaised / goal) * 100);

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />

      {/* Hero Section */}
      <section className="relative -mt-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/10 via-slate-900 to-slate-900" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 md:py-36">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 mb-6">
                <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="text-amber-400 text-sm font-medium">A Special Edition Supporting Our Building Vision</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
                The Foundation
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
                  Edition
                </span>
              </h1>

              <p className="text-xl sm:text-2xl text-slate-300 font-light leading-relaxed max-w-xl mx-auto lg:mx-0">
                Build Wealth. Build Foundations.
              </p>

              <div className="mt-8 flex items-center gap-4 justify-center lg:justify-start">
                <div className="bg-slate-800/80 border border-amber-500/30 rounded-2xl px-6 py-4 inline-flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-bold text-white">£50</span>
                  <span className="text-slate-400 text-sm font-medium">per copy</span>
                </div>
                <div className="text-left">
                  <p className="text-amber-400 text-sm font-semibold">Limited Edition</p>
                  <p className="text-slate-400 text-xs">Signed special-print copy</p>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={openPurchase}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-8 py-4 rounded-xl text-lg transition-all hover:shadow-xl hover:shadow-amber-500/30 hover:-translate-y-1 inline-flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Get Your Copy — £50
                </button>
                <button
                  onClick={() => scrollToSection('why')}
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl text-lg border border-white/20 transition-all hover:-translate-y-1 inline-flex items-center justify-center gap-2"
                >
                  Learn More
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex-shrink-0">
              <div className="relative group">
                <div className="absolute -inset-6 bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-3xl blur-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                <div className="relative">
                  <img
                    src="https://d64gsuwffb70l.cloudfront.net/6973e5e8bbb2ae01621a037e_1771332919433_67a319f6.png"
                    alt="Build Wealth Through Property - Foundation Edition"
                    className="w-72 sm:w-80 md:w-96 lg:w-[440px] rounded-xl shadow-2xl shadow-black/50 transform group-hover:-translate-y-2 group-hover:rotate-[-1deg] transition-all duration-500"
                  />
                  <div className="absolute -bottom-4 -right-4 bg-gradient-to-br from-amber-400 to-amber-600 text-slate-900 font-bold text-xl px-5 py-3 rounded-xl shadow-lg shadow-amber-500/30 border-2 border-amber-300/50">
                    £50
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <button onClick={() => scrollToSection('purpose')} className="text-white/50 hover:text-white transition-colors">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      </section>

      {/* Live Building Fund Progress - Firestore-powered */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-y border-amber-500/20 bg-slate-800/20">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <span className="text-amber-400 font-semibold text-xs uppercase tracking-wider">Live Progress</span>
            <h3 className="text-xl font-bold text-white mt-1">Building Fund</h3>
          </div>
          <div className="bg-slate-800/60 border border-amber-500/20 rounded-2xl p-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-400">£{stats.totalRaised.toLocaleString()} raised</span>
              <span className="text-amber-400 font-semibold">£{goal.toLocaleString()} goal</span>
            </div>
            <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="mt-4 text-slate-400 text-sm text-center">
              <span className="text-amber-400 font-semibold">{stats.copiesSold}</span> copies sold · Every purchase builds our community space
            </p>
          </div>
        </div>
      </section>

      {/* Purpose Statement */}
      <section id="purpose" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xl sm:text-2xl text-slate-300 leading-relaxed mb-8 font-light">
            When you purchase the Foundation Edition, you are not just investing in knowledge.
          </p>
          <p className="text-2xl sm:text-3xl md:text-4xl text-white font-bold leading-tight">
            You are investing in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
              legacy
            </span>.
          </p>
        </div>
      </section>

      <div className="max-w-xs mx-auto flex items-center gap-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-500/30" />
        <div className="w-2 h-2 bg-amber-500/50 rounded-full" />
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-500/30" />
      </div>

      {/* The Story Section */}
      <section id="why" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-8">
            <div className="text-center mb-12">
              <span className="text-amber-400 font-semibold text-sm uppercase tracking-wider">The Story</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mt-4">More Than a Book</h2>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-8 sm:p-10 space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
                    <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
                <p className="text-slate-300 text-lg leading-relaxed">
                  Some books are written to <span className="text-white font-medium">inform</span>.
                </p>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
                    <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                </div>
                <p className="text-slate-300 text-lg leading-relaxed">
                  Some are written to <span className="text-white font-medium">inspire</span>.
                </p>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                    <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
                <p className="text-amber-300 text-lg leading-relaxed font-medium">
                  This edition exists to <span className="text-amber-400 font-bold">build</span>.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-500/5 to-amber-600/5 border border-amber-500/20 rounded-2xl p-8 sm:p-10">
              <p className="text-slate-300 text-lg leading-relaxed mb-6">
                The Foundation Edition of{' '}
                <span className="text-white font-semibold italic">Build Wealth Through Property: 7 Reasons Why</span>{' '}
                has been created in limited quantity to support our church & Community Hub building project — establishing a permanent space for lasting community impact.
              </p>
              <p className="text-slate-300 text-lg leading-relaxed mb-6">
                The content remains the same disciplined, structured framework for building wealth through property.
              </p>
              <p className="text-white text-xl font-semibold leading-relaxed">
                What makes this edition different is its purpose.
              </p>
            </div>

            <div className="bg-slate-800/60 border border-amber-500/30 rounded-2xl p-8 sm:p-10 text-center">
              <div className="w-16 h-16 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <p className="text-xl sm:text-2xl text-white font-bold mb-2">
                Every purchase directly contributes to our building fund.
              </p>
              <p className="text-slate-400 text-lg">
                Your investment in knowledge becomes an investment in community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-amber-400 font-semibold text-sm uppercase tracking-wider">What You Receive</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
              Why Choose the Foundation Edition?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
                title: 'Limited Special-Print Version',
                desc: 'A carefully produced edition created in limited quantity, making each copy a meaningful piece of the journey.',
              },
              {
                icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01',
                title: 'Premium Cover Design',
                desc: 'A distinctive cover that sets the Foundation Edition apart — a visual reminder of the purpose behind the purchase.',
              },
              {
                icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z',
                title: 'Signed Copy',
                desc: 'Where available, receive a personally signed copy from the author — a personal touch that adds meaning to your investment.',
              },
              {
                icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
                title: 'A Tangible Way to Support the Vision',
                desc: 'More than a book — a direct contribution to building a permanent community space that will serve generations.',
              },
            ].map((f) => (
              <div
                key={f.title}
                className="group bg-slate-800/60 border border-slate-700/50 rounded-2xl p-8 hover:border-amber-500/30 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-5 group-hover:bg-amber-500/20 transition-colors">
                  <svg className="w-7 h-7 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={f.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl px-8 py-5">
              <span className="text-slate-300 text-lg">All of this for just</span>
              <span className="text-3xl font-bold text-amber-400">£50</span>
              <span className="text-slate-400 text-sm">per copy</span>
            </div>
          </div>
        </div>
      </section>

      {/* Standard Edition Note */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-8 sm:p-12">
            <p className="text-slate-300 text-lg leading-relaxed mb-4">The standard edition remains available.</p>
            <p className="text-white text-xl leading-relaxed font-medium mb-8">
              The Foundation Edition is simply an opportunity for those who wish to contribute at a higher level — while receiving something meaningful in return.
            </p>
            <div className="flex items-center justify-center gap-6">
              <div className="h-px flex-1 max-w-[80px] bg-slate-700" />
              <p className="text-amber-400 text-lg font-semibold">No pressure. Just participation.</p>
              <div className="h-px flex-1 max-w-[80px] bg-slate-700" />
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA / Purchase Section */}
      <section id="purchase" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 to-slate-800/50">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-3xl p-8 sm:p-12 md:p-16">
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative text-center">
              <div className="mb-10">
                <img
                  src="https://d64gsuwffb70l.cloudfront.net/6973e5e8bbb2ae01621a037e_1771332919433_67a319f6.png"
                  alt="Build Wealth Through Property - Foundation Edition"
                  className="w-48 sm:w-56 mx-auto rounded-lg shadow-xl shadow-black/30 hover:-translate-y-1 transition-transform duration-300"
                />
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                Build Wealth. Build Foundations.
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 mt-2">
                  Build Legacy.
                </span>
              </h2>

              <p className="text-slate-300 text-lg max-w-xl mx-auto mb-6 leading-relaxed">
                Get your copy of the Foundation Edition and be part of something that lasts beyond the pages.
              </p>

              <div className="mb-10">
                <div className="inline-flex items-baseline gap-2 bg-slate-900/60 border border-amber-500/30 rounded-2xl px-8 py-5">
                  <span className="text-5xl sm:text-6xl font-bold text-white">£50</span>
                  <div className="text-left ml-2">
                    <span className="block text-amber-400 text-sm font-semibold">Foundation Edition</span>
                    <span className="block text-slate-400 text-xs">Limited special-print copy</span>
                  </div>
                </div>
              </div>

              {!showPurchaseForm ? (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={openPurchase}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-10 py-5 rounded-xl text-xl transition-all hover:shadow-xl hover:shadow-amber-500/30 hover:-translate-y-1 inline-flex items-center justify-center gap-3"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Get the Foundation Edition — £50
                  </button>
                  <Link
                    to="/"
                    className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-5 rounded-xl text-lg border border-white/20 transition-all hover:-translate-y-1 inline-flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    View Standard Edition
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="max-w-lg mx-auto text-left space-y-4">
                  {error && (
                    <div className="flex items-start gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-1">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-1">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      placeholder="+44 7700 900000"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-1">Address *</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      rows={2}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none"
                      placeholder="123 Main Street"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 text-sm font-medium mb-1">City *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                        placeholder="London"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 text-sm font-medium mb-1">Postcode *</label>
                      <input
                        type="text"
                        name="postcode"
                        value={formData.postcode}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                        placeholder="SW1A 1AA"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-2">Quantity</label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-10 h-10 rounded-lg bg-slate-700 border border-amber-500/30 font-semibold text-amber-400 hover:bg-slate-600"
                      >
                        −
                      </button>
                      <span className="text-white font-semibold">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => q + 1)}
                        className="w-10 h-10 rounded-lg bg-slate-700 border border-amber-500/30 font-semibold text-amber-400 hover:bg-slate-600"
                      >
                        +
                      </button>
                      <span className="text-slate-400 text-sm">× £50 = £{(quantity * FOUNDATION_PRICE).toFixed(0)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Redirecting to checkout...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Proceed to Payment — £{(quantity * FOUNDATION_PRICE).toFixed(0)}
                      </>
                    )}
                  </button>
                </form>
              )}

              <div className="mt-8 flex items-center justify-center gap-2 text-slate-500 text-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Secure payment via Stripe. Every purchase supports the building fund.
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Foundation;
