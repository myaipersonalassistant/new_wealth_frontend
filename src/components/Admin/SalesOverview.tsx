import React, { useState, useEffect, useCallback } from 'react';
import { getSalesOverview } from '@/lib/adminFirestore';

interface SalesData {
  booksSold: number;
  ticketsSold: number;
  foundationSold: number;
  coursesSold: number;
  totalRevenue: number;
  bookRevenue: number;
  seminarRevenue: number;
  foundationRevenue: number;
  recentOrders: Array<{
    id: string;
    productType: string;
    productName: string;
    quantity: number;
    amount: number;
    customerEmail: string;
    customerName: string;
    createdAt: string | null;
  }>;
  totalOrders: number;
}

interface SiteMetrics {
  subscribers: { total: number; active: number; recentWeek: number };
  blog: { total: number; published: number };
  reviews: { total: number; approved: number; pending: number; averageRating: number };
  courses: { conversions: number };
  funnels: { totalEnrollments: number; activeEnrollments: number };
  campaigns: { total: number; sent: number };
  emailEvents: { total: number };
}

interface SalesOverviewProps {
  onNotification: (message: string, type: 'success' | 'error') => void;
  onNavigateToTab?: (tab: string) => void;
}

const SalesOverview: React.FC<SalesOverviewProps> = ({ onNotification, onNavigateToTab }) => {
  const [sales, setSales] = useState<SalesData | null>(null);
  const [metrics, setMetrics] = useState<SiteMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getSalesOverview();
      setSales(data.sales);
      setMetrics(data.siteMetrics);
    } catch (err: unknown) {
      console.error('Sales fetch error:', err);
      onNotification('Failed to load sales data', 'error');
    } finally {
      setLoading(false);
    }
  }, [onNotification]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(amount);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getProductBadge = (type: string) => {
    switch (type) {
      case 'book':
        return { label: 'Book', bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' };
      case 'seminar':
        return { label: 'Seminar', bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' };
      case 'foundation':
        return { label: 'Foundation', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' };
      default:
        return { label: type, bg: 'bg-slate-700', text: 'text-slate-400', border: 'border-slate-600' };
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-64 bg-slate-700 rounded animate-pulse mb-2" />
            <div className="h-4 w-48 bg-slate-700/50 rounded animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 animate-pulse">
              <div className="h-4 w-24 bg-slate-700/50 rounded mb-3" />
              <div className="h-10 w-20 bg-slate-700 rounded mb-2" />
              <div className="h-3 w-32 bg-slate-700/50 rounded" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1, 2].map(i => (
            <div key={i} className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 animate-pulse">
              <div className="h-6 w-40 bg-slate-700 rounded mb-4" />
              <div className="space-y-3">
                {[1, 2, 3].map(j => (
                  <div key={j} className="h-12 bg-slate-700/30 rounded-xl" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Command Center */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 via-slate-800/95 to-amber-900/15 border border-slate-700/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative p-8 sm:p-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl sm:text-4xl font-bold text-white">Overview</h1>
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live
                </span>
              </div>
              <p className="text-slate-400">Sales, metrics & activity at a glance</p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="text-right">
                <p className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
                  {formatCurrency(sales?.totalRevenue || 0)}
                </p>
                <p className="text-slate-500 text-sm font-medium mt-1">Total revenue</p>
              </div>
              <button
                onClick={fetchData}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-slate-600 rounded-xl text-slate-300 hover:text-white transition-all text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>

          {/* Quick Nav */}
          {onNavigateToTab && (
            <div className="mt-8 pt-6 border-t border-slate-700/50">
              <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-3">Quick actions</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { tab: 'subscribers', label: 'Subscribers', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', className: 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20 hover:border-amber-500/40' },
                  { tab: 'marketing', label: 'Marketing', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', className: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/40' },
                  { tab: 'analytics', label: 'Analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', className: 'bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20 hover:border-blue-500/40' },
                  { tab: 'courses', label: 'Courses', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z', className: 'bg-purple-500/10 border-purple-500/20 text-purple-400 hover:bg-purple-500/20 hover:border-purple-500/40' },
                  { tab: 'starter-pack', label: 'Starter Pack', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', className: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-500/40' },
                  { tab: 'blog', label: 'Blog', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z', className: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 hover:border-indigo-500/40' },
                  { tab: 'reviews', label: 'Reviews', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z', className: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20 hover:border-yellow-500/40' },
                ].map(({ tab, label, icon, className }) => (
                  <button
                    key={tab}
                    onClick={() => onNavigateToTab(tab)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all text-sm font-medium ${className}`}
                  >
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                    </svg>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Activity Pulse */}
      {(sales || metrics) && (
        <div className="flex flex-wrap gap-2">
          {sales && sales.recentOrders.length > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300 text-sm">
                <span className="font-semibold text-white">{sales.recentOrders.length}</span> recent order{sales.recentOrders.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}
          {metrics && metrics.subscribers.recentWeek > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-slate-300 text-sm">
                <span className="font-semibold text-amber-400">{metrics.subscribers.recentWeek}</span> new subscriber{metrics.subscribers.recentWeek !== 1 ? 's' : ''} this week
              </span>
            </div>
          )}
          {metrics && metrics.reviews.pending > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/5 border border-amber-500/20">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-slate-300 text-sm">
                <span className="font-semibold text-amber-400">{metrics.reviews.pending}</span> review{metrics.reviews.pending !== 1 ? 's' : ''} pending approval
              </span>
            </div>
          )}
          {metrics && metrics.campaigns.sent > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <span className="text-slate-300 text-sm">
                <span className="font-semibold text-purple-400">{metrics.campaigns.sent}</span> campaign{metrics.campaigns.sent !== 1 ? 's' : ''} sent
              </span>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════ */}
      {/* SALES SUMMARY CARDS                        */}
      {/* ═══════════════════════════════════════════ */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Sales Summary
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-amber-500/5 to-amber-500/0 border border-amber-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-[10px] font-bold uppercase text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
              Revenue
            </span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{formatCurrency(sales?.totalRevenue || 0)}</p>
        </div>

        {/* Books Sold */}
        <div className="bg-gradient-to-br from-blue-500/5 to-blue-500/0 border border-blue-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-[10px] font-bold uppercase text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">
              Books
            </span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{sales?.booksSold || 0}</p>
          <p className="text-slate-500 text-xs">{formatCurrency(sales?.bookRevenue || 0)} revenue</p>
        </div>

        {/* Tickets Sold */}
        <div className="bg-gradient-to-br from-purple-500/5 to-purple-500/0 border border-purple-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <span className="text-[10px] font-bold uppercase text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">
              Tickets
            </span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{sales?.ticketsSold || 0}</p>
          <p className="text-slate-500 text-xs">{formatCurrency(sales?.seminarRevenue || 0)} revenue</p>
        </div>

        {/* Foundation Editions */}
        <div className="bg-gradient-to-br from-emerald-500/5 to-emerald-500/0 border border-emerald-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className="text-[10px] font-bold uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              Foundation
            </span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{sales?.foundationSold || 0}</p>
          <p className="text-slate-500 text-xs">{formatCurrency(sales?.foundationRevenue || 0)} revenue</p>
        </div>

        {/* Courses Sold */}
        <div className="bg-gradient-to-br from-indigo-500/5 to-indigo-500/0 border border-indigo-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-[10px] font-bold uppercase text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">
              Courses
            </span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{sales?.coursesSold ?? 0}</p>
          <p className="text-slate-500 text-xs">Total sold</p>
        </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* SITE METRICS                               */}
      {/* ═══════════════════════════════════════════ */}
      {metrics && (
        <div>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Site Metrics
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* Subscribers */}
            <div
              role={onNavigateToTab ? 'button' : undefined}
              onClick={onNavigateToTab ? () => onNavigateToTab('subscribers') : undefined}
              tabIndex={onNavigateToTab ? 0 : undefined}
              onKeyDown={onNavigateToTab ? (e) => e.key === 'Enter' && onNavigateToTab('subscribers') : undefined}
              className={`bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 ${onNavigateToTab ? 'cursor-pointer hover:border-amber-500/30 hover:bg-slate-800 transition-colors' : ''}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-bold text-white">{metrics.subscribers.total.toLocaleString()}</p>
              <p className="text-slate-500 text-[10px] uppercase mt-1 font-medium">Subscribers</p>
              <div className="mt-2 flex items-center gap-1">
                <span className="text-emerald-400 text-[10px] font-bold">{metrics.subscribers.active.toLocaleString()}</span>
                <span className="text-slate-600 text-[10px]">active</span>
              </div>
            </div>

            {/* New This Week */}
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-bold text-emerald-400">{metrics.subscribers.recentWeek.toLocaleString()}</p>
              <p className="text-slate-500 text-[10px] uppercase mt-1 font-medium">New This Week</p>
              <div className="mt-2 flex items-center gap-1">
                <span className="text-slate-500 text-[10px]">subscribers</span>
              </div>
            </div>

            {/* Blog Posts */}
            <div
              role={onNavigateToTab ? 'button' : undefined}
              onClick={onNavigateToTab ? () => onNavigateToTab('blog') : undefined}
              tabIndex={onNavigateToTab ? 0 : undefined}
              onKeyDown={onNavigateToTab ? (e) => e.key === 'Enter' && onNavigateToTab('blog') : undefined}
              className={`bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 ${onNavigateToTab ? 'cursor-pointer hover:border-blue-500/30 hover:bg-slate-800 transition-colors' : ''}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-bold text-white">{metrics.blog.published}</p>
              <p className="text-slate-500 text-[10px] uppercase mt-1 font-medium">Blog Posts</p>
              <div className="mt-2 flex items-center gap-1">
                <span className="text-blue-400 text-[10px] font-bold">{metrics.blog.total}</span>
                <span className="text-slate-600 text-[10px]">total</span>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-bold text-white">{metrics.reviews.approved}</p>
              <p className="text-slate-500 text-[10px] uppercase mt-1 font-medium">Reviews</p>
              <div className="mt-2 flex items-center gap-1">
                {metrics.reviews.averageRating > 0 && (
                  <>
                    <span className="text-yellow-400 text-[10px] font-bold">{metrics.reviews.averageRating}</span>
                    <span className="text-slate-600 text-[10px]">avg rating</span>
                  </>
                )}
                {metrics.reviews.pending > 0 && (
                  <span className="text-amber-400 text-[10px] font-bold ml-1">({metrics.reviews.pending} pending)</span>
                )}
              </div>
            </div>

            {/* Campaigns */}
            <div
              role={onNavigateToTab ? 'button' : undefined}
              onClick={onNavigateToTab ? () => onNavigateToTab('marketing') : undefined}
              tabIndex={onNavigateToTab ? 0 : undefined}
              onKeyDown={onNavigateToTab ? (e) => e.key === 'Enter' && onNavigateToTab('marketing') : undefined}
              className={`bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 ${onNavigateToTab ? 'cursor-pointer hover:border-purple-500/30 hover:bg-slate-800 transition-colors' : ''}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-bold text-white">{metrics.campaigns.sent}</p>
              <p className="text-slate-500 text-[10px] uppercase mt-1 font-medium">Campaigns Sent</p>
              <div className="mt-2 flex items-center gap-1">
                <span className="text-purple-400 text-[10px] font-bold">{metrics.campaigns.total}</span>
                <span className="text-slate-600 text-[10px]">total</span>
              </div>
            </div>

            {/* Funnel Enrollments */}
            <div
              role={onNavigateToTab ? 'button' : undefined}
              onClick={onNavigateToTab ? () => onNavigateToTab('marketing') : undefined}
              tabIndex={onNavigateToTab ? 0 : undefined}
              onKeyDown={onNavigateToTab ? (e) => e.key === 'Enter' && onNavigateToTab('marketing') : undefined}
              className={`bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 ${onNavigateToTab ? 'cursor-pointer hover:border-cyan-500/30 hover:bg-slate-800 transition-colors' : ''}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-bold text-white">{metrics.funnels.totalEnrollments}</p>
              <p className="text-slate-500 text-[10px] uppercase mt-1 font-medium">Funnel Enrolled</p>
              <div className="mt-2 flex items-center gap-1">
                <span className="text-cyan-400 text-[10px] font-bold">{metrics.funnels.activeEnrollments}</span>
                <span className="text-slate-600 text-[10px]">active</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════ */}
      {/* REVENUE BREAKDOWN                          */}
      {/* ═══════════════════════════════════════════ */}
      {sales && sales.totalRevenue > 0 && (
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
            Revenue Breakdown
          </h3>
          <div className="space-y-4">
            {/* Book Revenue Bar */}
            {sales.bookRevenue > 0 && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-blue-400 rounded-full" />
                    <span className="text-slate-300 text-sm font-medium">Book Sales</span>
                    <span className="text-slate-500 text-xs">({sales.booksSold} sold)</span>
                  </div>
                  <span className="text-white font-bold text-sm">{formatCurrency(sales.bookRevenue)}</span>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-2.5">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-400 rounded-full h-2.5 transition-all duration-700"
                    style={{ width: `${(sales.bookRevenue / sales.totalRevenue) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Seminar Revenue Bar */}
            {sales.seminarRevenue > 0 && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-purple-400 rounded-full" />
                    <span className="text-slate-300 text-sm font-medium">Seminar Tickets</span>
                    <span className="text-slate-500 text-xs">({sales.ticketsSold} sold)</span>
                  </div>
                  <span className="text-white font-bold text-sm">{formatCurrency(sales.seminarRevenue)}</span>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-2.5">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-purple-400 rounded-full h-2.5 transition-all duration-700"
                    style={{ width: `${(sales.seminarRevenue / sales.totalRevenue) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Foundation Revenue Bar */}
            {sales.foundationRevenue > 0 && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-emerald-400 rounded-full" />
                    <span className="text-slate-300 text-sm font-medium">Foundation Editions</span>
                    <span className="text-slate-500 text-xs">({sales.foundationSold} sold)</span>
                  </div>
                  <span className="text-white font-bold text-sm">{formatCurrency(sales.foundationRevenue)}</span>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-2.5">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full h-2.5 transition-all duration-700"
                    style={{ width: `${(sales.foundationRevenue / sales.totalRevenue) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Total */}
          <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-center justify-between">
            <span className="text-slate-400 font-medium text-sm">Total Revenue</span>
            <span className="text-amber-400 font-bold text-lg">{formatCurrency(sales.totalRevenue)}</span>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════ */}
      {/* RECENT ORDERS TABLE                        */}
      {/* ═══════════════════════════════════════════ */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-amber-500/10 rounded-xl flex items-center justify-center">
                <svg className="w-4.5 h-4.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">Recent Orders</h3>
                <p className="text-slate-500 text-xs mt-0.5">{sales?.totalOrders || 0} total orders</p>
              </div>
            </div>
          </div>
        </div>

        {sales && sales.recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-700/30">
                  <th className="text-left text-slate-500 font-medium px-4 py-3">Customer</th>
                  <th className="text-left text-slate-500 font-medium px-3 py-3">Product</th>
                  <th className="text-center text-slate-500 font-medium px-3 py-3">Qty</th>
                  <th className="text-right text-slate-500 font-medium px-3 py-3">Amount</th>
                  <th className="text-center text-slate-500 font-medium px-3 py-3">Status</th>
                  <th className="text-right text-slate-500 font-medium px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {sales.recentOrders.map((order, i) => {
                  const badge = getProductBadge(order.productType);
                  return (
                    <tr key={order.id} className={`border-b border-slate-700/20 hover:bg-slate-700/10 ${i === 0 ? 'bg-slate-800/30' : ''}`}>
                      <td className="px-4 py-3">
                        <p className="text-slate-300 font-medium truncate max-w-[180px]">
                          {order.customerName || 'Anonymous'}
                        </p>
                        <p className="text-slate-600 text-[10px] mt-0.5 truncate max-w-[180px]">
                          {order.customerEmail || 'No email'}
                        </p>
                      </td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg} ${badge.text} ${badge.border}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center text-slate-400">{order.quantity}</td>
                      <td className="px-3 py-3 text-right">
                        <span className="text-white font-bold">{formatCurrency(order.amount)}</span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                          Paid
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-slate-500 text-[10px]">
                        {formatDate(order.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <div className="w-16 h-16 bg-slate-700/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
            </div>
            <h3 className="text-white text-lg font-bold mb-2">No Orders Yet</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              When customers purchase books, seminar tickets, or foundation editions, their orders will appear here.
            </p>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* QUICK INSIGHTS                             */}
      {/* ═══════════════════════════════════════════ */}
      {metrics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Content Health */}
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold">Content Health</h3>
                <p className="text-slate-500 text-xs">Blog, reviews & engagement overview</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">Published Blog Posts</span>
                <span className="text-white font-bold">{metrics.blog.published}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">Draft Posts</span>
                <span className="text-slate-300 font-bold">{metrics.blog.total - metrics.blog.published}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">Approved Reviews</span>
                <span className="text-white font-bold">{metrics.reviews.approved}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">Pending Reviews</span>
                <span className={`font-bold ${metrics.reviews.pending > 0 ? 'text-amber-400' : 'text-slate-500'}`}>
                  {metrics.reviews.pending}
                </span>
              </div>
              {metrics.reviews.averageRating > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Average Rating</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-yellow-400 font-bold">{metrics.reviews.averageRating}</span>
                    <span className="text-slate-500 text-xs">/ 5</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Email Health */}
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold">Email Health</h3>
                <p className="text-slate-500 text-xs">Campaigns, funnels & engagement</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">Campaigns Sent</span>
                <span className="text-white font-bold">{metrics.campaigns.sent}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">Total Campaigns</span>
                <span className="text-slate-300 font-bold">{metrics.campaigns.total}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">Funnel Enrollments</span>
                <span className="text-white font-bold">{metrics.funnels.totalEnrollments}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">Active in Funnels</span>
                <span className="text-emerald-400 font-bold">{metrics.funnels.activeEnrollments}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">Webhook Events</span>
                <span className="text-white font-bold">{metrics.emailEvents.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesOverview;
