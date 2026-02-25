import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { onAuthStateChange, getUserProfile, signOutUser } from '@/lib/firebaseAuth';
import {
  getUnifiedSubscribers,
  exportUnifiedSubscribersCSV,
  updateSubscriberStatus,
  deleteSubscriber,
  type UnifiedSubscriber,
} from '@/lib/adminFirestore';
import AdminStats from '@/components/Admin/AdminStats';
import AdminTable from '@/components/Admin/AdminTable';
import CampaignComposer from '@/components/Admin/CampaignComposer';
import CampaignHistory from '@/components/Admin/CampaignHistory';
import FunnelBuilder from '@/components/Admin/FunnelBuilder';
import AnalyticsDashboard from '@/components/Admin/AnalyticsDashboard';
import CourseManager from '@/components/Admin/CourseManager';
import StarterPackManager from '@/components/Admin/StarterPackManager';
import BlogManager from '@/components/Admin/BlogManager';
import SalesOverview from '@/components/Admin/SalesOverview';
import AdminReviewsManager from '@/components/Admin/AdminReviewsManager';




interface StatsData {
  total: number;
  active: number;
  unsubscribed: number;
  bounced: number;
  recentCount: number;
  monthlyCount: number;
  dailyBreakdown: { date: string; count: number }[];
  sourceBreakdown?: Record<string, number>;
}

type Subscriber = UnifiedSubscriber;

type AdminTab = 'overview' | 'subscribers' | 'marketing' | 'analytics' | 'courses' | 'starter-pack' | 'blog' | 'reviews';
type MarketingSubTab = 'compose' | 'funnels' | 'history';







const Admin: React.FC = () => {
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);



  // Tab state
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [marketingSubTab, setMarketingSubTab] = useState<MarketingSubTab>('compose');


  // Data state
  const [stats, setStats] = useState<StatsData | null>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [statsLoading, setStatsLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Table state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 25;

  // Campaign refresh trigger
  const [campaignRefresh, setCampaignRefresh] = useState(0);

  // Selected subscribers for "Send to Selected" campaign flow
  const [selectedEmailsForCampaign, setSelectedEmailsForCampaign] = useState<string[]>([]);

  // Toast-like notification
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Check Firebase Auth + role: admin in user_profiles
  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      setAuthLoading(true);
      setAuthError(null);
      if (!user) {
        setAdminAuthenticated(false);
      } else {
        try {
          const profile = await getUserProfile(user.uid);
          const isAdmin = profile?.role === 'admin';
          setAdminAuthenticated(!!isAdmin);
          if (!isAdmin) {
            setAuthError('Your account does not have admin access.');
          }
        } catch (err) {
          setAuthError('Failed to verify admin status.');
          setAdminAuthenticated(false);
        }
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch subscribers + stats (frontend Firestore only)
  const fetchSubscribersAndStats = useCallback(async () => {
    setTableLoading(true);
    setStatsLoading(true);
    try {
      const result = await getUnifiedSubscribers({
        page,
        perPage,
        status: statusFilter,
        source: sourceFilter || undefined,
        search: search || undefined,
      });
      setSubscribers(result.subscribers);
      setTotal(result.total);
      setTotalPages(result.totalPages);
      setStats(result.stats);
    } catch (err: any) {
      showNotification(err.message || 'Failed to load subscribers.', 'error');
    } finally {
      setTableLoading(false);
      setStatsLoading(false);
    }
  }, [page, perPage, statusFilter, search, sourceFilter]);

  // Load data when admin is authenticated
  useEffect(() => {
    if (adminAuthenticated) {
      fetchSubscribersAndStats();
    }
  }, [adminAuthenticated, fetchSubscribersAndStats]);


  // Debounced search
  const [searchTimeout, setSearchTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    if (searchTimeout) clearTimeout(searchTimeout);
    const timeout = setTimeout(() => {
      setPage(1);
    }, 400);
    setSearchTimeout(timeout);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleSourceFilterChange = (value: string) => {
    setSourceFilter((prev) => (prev === value ? '' : value));
    setPage(1);
  };

  // Export CSV (client-side)
  const handleExport = async () => {
    setExporting(true);
    try {
      const { csv, count } = await exportUnifiedSubscribersCSV({ status: statusFilter, source: sourceFilter || undefined });
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `subscribers_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showNotification(`Exported ${count} subscribers`, 'success');
    } catch (err: any) {
      showNotification(err.message || 'Export failed.', 'error');
    } finally {
      setExporting(false);
    }
  };

  const handleUpdateStatus = async (subscriptionDocId: string, newStatus: string) => {
    try {
      await updateSubscriberStatus(subscriptionDocId, newStatus);
      showNotification(`Subscriber ${newStatus === 'active' ? 'reactivated' : 'unsubscribed'}`, 'success');
      fetchSubscribersAndStats();
    } catch (err: any) {
      showNotification(err.message || 'Update failed', 'error');
    }
  };

  const handleDelete = async (subscriptionDocId: string, email: string) => {
    try {
      await deleteSubscriber(subscriptionDocId);
      showNotification(`Deleted ${email}`, 'success');
      fetchSubscribersAndStats();
    } catch (err: any) {
      showNotification(err.message || 'Delete failed', 'error');
    }
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-10 h-10 animate-spin text-amber-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }


  // Admin gate: requires Firebase Auth + role: admin in user_profiles
  if (!adminAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Admin Access</h1>
              {authLoading ? (
                <p className="text-slate-500 text-sm mt-1">Checking access...</p>
              ) : authError ? (
                <p className="text-slate-500 text-sm mt-1">{authError}</p>
              ) : (
                <p className="text-slate-500 text-sm mt-1">Sign in with an admin account to continue</p>
              )}
            </div>

            {authLoading ? (
              <div className="flex justify-center py-6">
                <svg className="w-10 h-10 animate-spin text-amber-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
            ) : (
              <div className="space-y-4">
                <Link
                  to="/auth?redirect=/admin"
                  className="block w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/20 text-center"
                >
                  Sign in to Access Admin
                </Link>
                <div className="pt-6 border-t border-slate-700/50 text-center">
                  <Link
                    to="/"
                    className="text-slate-400 hover:text-amber-400 transition-colors text-sm inline-flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Homepage
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Admin Dashboard

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-2">
          <div
            className={`px-4 py-3 rounded-xl shadow-xl border flex items-center gap-3 max-w-md ${
              notification.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}
          >
            {notification.type === 'success' ? (
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span className="text-sm font-medium">{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="ml-2 opacity-60 hover:opacity-100 transition-opacity"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Unified Header */}
      <Header />

      {/* Admin Info Bar */}
      <div className="bg-slate-800/60 border-b border-slate-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-slate-400 font-medium text-sm">Admin Dashboard</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-sm text-slate-400">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span>Admin</span>
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* Tab Navigation */}
      <div className="bg-slate-900/80 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <button
              onClick={() => setActiveTab('overview')}
              className={`relative px-5 py-4 text-sm font-medium transition-all ${
                activeTab === 'overview'
                  ? 'text-amber-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
                Overview
              </div>
              {activeTab === 'overview' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
              )}
            </button>



            <button
              onClick={() => setActiveTab('subscribers')}
              className={`relative px-5 py-4 text-sm font-medium transition-all ${
                activeTab === 'subscribers'
                  ? 'text-amber-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Subscribers
                {stats && (
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    activeTab === 'subscribers'
                      ? 'bg-amber-500/10 text-amber-400'
                      : 'bg-slate-700 text-slate-400'
                  }`}>
                    {stats.total.toLocaleString()}
                  </span>
                )}
              </div>
              {activeTab === 'subscribers' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
              )}
            </button>

            <button
              onClick={() => { setActiveTab('marketing'); setMarketingSubTab('compose'); }}
              className={`relative px-5 py-4 text-sm font-medium transition-all ${
                activeTab === 'marketing'
                  ? 'text-amber-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Marketing
              </div>
              {activeTab === 'marketing' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`relative px-5 py-4 text-sm font-medium transition-all ${
                activeTab === 'analytics'
                  ? 'text-amber-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Analytics
              </div>
              {activeTab === 'analytics' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('courses')}
              className={`relative px-5 py-4 text-sm font-medium transition-all ${
                activeTab === 'courses'
                  ? 'text-amber-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Courses
              </div>
              {activeTab === 'courses' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('starter-pack')}
              className={`relative px-5 py-4 text-sm font-medium transition-all ${
                activeTab === 'starter-pack'
                  ? 'text-amber-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Starter Pack
              </div>
              {activeTab === 'starter-pack' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('blog')}
              className={`relative px-5 py-4 text-sm font-medium transition-all ${
                activeTab === 'blog'
                  ? 'text-amber-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                Blog
              </div>
              {activeTab === 'blog' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`relative px-5 py-4 text-sm font-medium transition-all ${
                activeTab === 'reviews'
                  ? 'text-amber-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                Reviews
              </div>
              {activeTab === 'reviews' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
              )}
            </button>

        </div>
      </div>


      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ========== OVERVIEW TAB ========== */}
        {activeTab === 'overview' && (
          <SalesOverview
            onNotification={showNotification}
            onNavigateToTab={(tab) => {
              setActiveTab(tab as AdminTab);
              if (tab === 'marketing') setMarketingSubTab('compose');
            }}
          />
        )}

        {/* ========== SUBSCRIBERS TAB ========== */}
        {activeTab === 'subscribers' && (

          <>
            {/* Hero Header */}
            <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 via-slate-800/95 to-amber-900/20 border border-slate-700/50">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent" />
              <div className="relative p-8 sm:p-10">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl sm:text-4xl font-bold text-white">Subscriber Dashboard</h1>
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Live
                      </span>
                    </div>
                    <p className="text-slate-400">Manage your audience, track growth, and run campaigns</p>
                  </div>
                  <div className="flex items-center gap-4">
                    {stats && (
                      <div className="text-right">
                        <p className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
                          {stats.total.toLocaleString()}
                        </p>
                        <p className="text-slate-500 text-sm font-medium mt-1">total subscribers</p>
                      </div>
                    )}
                    <button
                      onClick={() => fetchSubscribersAndStats()}
                      className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-slate-600 rounded-xl text-slate-300 hover:text-white transition-all text-sm font-medium"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Refresh
                    </button>
                  </div>
                </div>

                {/* Source chips */}
                {stats?.sourceBreakdown && Object.keys(stats.sourceBreakdown).length > 0 && (
                  <div className="mt-6 pt-6 border-t border-slate-700/50">
                    <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-3">Filter by source</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(stats.sourceBreakdown)
                        .sort(([, a], [, b]) => b - a)
                        .map(([key, count]) => {
                          const label = key === 'free-chapter' ? 'Free Chapter' : key === 'starter-pack' ? 'Starter Pack' : key === 'calculator' ? 'Calculator' : key === 'homepage' ? 'Homepage' : key;
                          const active = sourceFilter === key;
                          return (
                            <button
                              key={key}
                              onClick={() => handleSourceFilterChange(key)}
                              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                active
                                  ? 'bg-amber-500/20 border border-amber-500/50 text-amber-400'
                                  : 'bg-slate-800/60 border border-slate-700/50 text-slate-400 hover:text-white hover:border-slate-600'
                              }`}
                            >
                              {label} <span className="opacity-70">({count})</span>
                            </button>
                          );
                        })}
                      {sourceFilter && (
                        <button
                          onClick={() => handleSourceFilterChange(sourceFilter)}
                          className="px-3 py-1.5 rounded-lg text-xs text-slate-500 hover:text-amber-400"
                        >
                          Clear filter
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-8">
              <AdminStats stats={stats} loading={statsLoading} />
            </div>

            {/* Recent signups + Quick actions row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2 bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Recent Signups
                </h3>
                {subscribers.length > 0 ? (
                  <div className="space-y-3">
                    {subscribers.slice(0, 5).map((sub) => (
                      <div key={sub.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/40 hover:bg-slate-900/60 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/30 to-amber-600/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-amber-400 font-bold text-sm">{sub.email[0]?.toUpperCase()}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-white font-medium truncate">{sub.email}</p>
                          <p className="text-slate-500 text-xs">{sub.source || 'Direct'} · {new Date(sub.subscribed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          sub.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-400'
                        }`}>
                          {sub.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm py-4">No subscribers to show. Signups will appear here.</p>
                )}
              </div>

              <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <button onClick={handleExport} disabled={exporting} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 text-slate-300 hover:text-white transition-all text-sm disabled:opacity-50">
                    <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    <span className="font-medium">Export CSV</span>
                  </button>
                  <button onClick={() => { setActiveTab('marketing'); setMarketingSubTab('compose'); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 text-slate-300 hover:text-white transition-all text-sm">
                    <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    <span className="font-medium">Compose Campaign</span>
                  </button>
                  <button onClick={() => { setActiveTab('marketing'); setMarketingSubTab('funnels'); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 text-slate-300 hover:text-white transition-all text-sm">
                    <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                    <span className="font-medium">Email Funnels</span>
                  </button>
                  <Link to="/" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 text-slate-300 hover:text-white transition-all text-sm">
                    <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                    <span className="font-medium">View Site</span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <AdminTable
                subscribers={subscribers}
                loading={tableLoading}
                total={total}
                page={page}
                totalPages={totalPages}
                search={search}
                statusFilter={statusFilter}
                sourceFilter={sourceFilter || undefined}
                onSearchChange={handleSearchChange}
                onStatusFilterChange={handleStatusFilterChange}
                onPageChange={setPage}
                onUpdateStatus={handleUpdateStatus}
                onDelete={handleDelete}
                onExport={handleExport}
                exporting={exporting}
                selectionMode
                onSelectionChange={setSelectedEmailsForCampaign}
              />
            </div>

            {selectedEmailsForCampaign.length > 0 && (
              <div className="mb-8 flex items-center gap-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl">
                <span className="text-emerald-400 font-medium">{selectedEmailsForCampaign.length} subscriber(s) selected</span>
                <button
                  onClick={() => {
                    setActiveTab('marketing');
                    setMarketingSubTab('compose');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold rounded-xl transition-all text-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Send Campaign to Selected
                </button>
              </div>
            )}
          </>
        )}

        {/* ========== MARKETING TAB (Campaigns + Funnels Hub) ========== */}
        {activeTab === 'marketing' && (
          <>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white">Marketing Hub</h1>
                <p className="text-slate-400 mt-1">Email campaigns, funnels &amp; course sequences — all in one place</p>
              </div>
            </div>

            {/* Marketing sub-tabs */}
            <div className="flex gap-2 mb-8 border-b border-slate-700/50 pb-2">
              {(['compose', 'funnels', 'history'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setMarketingSubTab(tab)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    marketingSubTab === tab
                      ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent'
                  }`}
                >
                  {tab === 'compose' && 'Compose Campaign'}
                  {tab === 'funnels' && 'Email Funnels'}
                  {tab === 'history' && 'Campaign History'}
                </button>
              ))}
            </div>

            {marketingSubTab === 'compose' && (
              <CampaignComposer
                onSendComplete={() => {
                  setCampaignRefresh((prev) => prev + 1);
                  setSelectedEmailsForCampaign([]);
                }}
                onNotification={showNotification}
                initialSelectedEmails={selectedEmailsForCampaign.length > 0 ? selectedEmailsForCampaign : undefined}
              />
            )}

            {marketingSubTab === 'funnels' && (
              <FunnelBuilder onNotification={showNotification} />
            )}

            {marketingSubTab === 'history' && (
              <CampaignHistory refreshTrigger={campaignRefresh} onNotification={showNotification} />
            )}
          </>
        )}

        {/* ========== ANALYTICS TAB ========== */}
        {activeTab === 'analytics' && (
          <AnalyticsDashboard onNotification={showNotification} />
        )}


        {/* ========== COURSES TAB ========== */}
        {activeTab === 'courses' && (
          <CourseManager onNotification={showNotification} />
        )}


        {/* ========== STARTER PACK TAB ========== */}
        {activeTab === 'starter-pack' && (
          <StarterPackManager onNotification={showNotification} />
        )}

        {/* ========== BLOG TAB ========== */}
        {activeTab === 'blog' && (
          <BlogManager onNotification={showNotification} />
        )}

        {/* ========== REVIEWS TAB ========== */}
        {activeTab === 'reviews' && (
          <AdminReviewsManager onNotification={showNotification} />
        )}

      </main>




      {/* Footer */}
      <Footer compact />

    </div>
  );
};

export default Admin;
