import React, { useState, useEffect, useCallback } from 'react';
import { getAnalyticsFromFirestore, type FirestoreAnalytics } from '@/lib/adminFirestore';
import { AreaChart, HorizontalBarChart, DonutChart } from './AnalyticsCharts';

interface AnalyticsDashboardProps {
  onNotification: (message: string, type: 'success' | 'error') => void;
}

const RANGE_OPTIONS = [
  { value: 7, label: 'Last 7 days' },
  { value: 14, label: 'Last 14 days' },
  { value: 30, label: 'Last 30 days' },
];

const BAR_COLORS = [
  '#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b',
  '#ec4899', '#6366f1', '#14b8a6',
];

const SECTION_COLORS = [
  '#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#6366f1', '#14b8a6', '#64748b',
];

const LOCATION_COLORS = [
  '#0ea5e9', '#6366f1', '#22c55e', '#eab308', '#f97316', '#ef4444', '#ec4899', '#8b5cf6', '#06b6d4', '#64748b',
];

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ onNotification }) => {
  const [rangeDays, setRangeDays] = useState(30);
  const [data, setData] = useState<FirestoreAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback((forceRefresh = false) => {
    setLoading(true);
    setError(null);
    getAnalyticsFromFirestore(rangeDays, { forceRefresh })
      .then(setData)
      .catch((e) => {
        setError(e?.message || 'Failed to load analytics');
        onNotification('Failed to load analytics', 'error');
      })
      .finally(() => setLoading(false));
  }, [rangeDays, onNotification]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 via-slate-800/95 to-blue-900/20 border border-slate-700/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative p-8 sm:p-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white">Site Analytics</h1>
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mt-2 inline-flex bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Firestore + Firebase Analytics
                  </span>
                </div>
              </div>
              <p className="text-slate-400 mt-2">
                Page views from your app — logged on every visit and aggregated here for you.
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <label className="text-slate-400 text-sm font-medium">Range</label>
              <select
                value={rangeDays}
                onChange={(e) => setRangeDays(Number(e.target.value))}
                className="bg-slate-800/80 border border-slate-600 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                {RANGE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => fetchAnalytics(true)}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-700/80 border border-slate-600 text-slate-300 text-sm font-medium hover:bg-slate-600/80 disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>

          {/* Summary stats */}
          {data && !loading && (
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-4">
                <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Total views</p>
                <p className="text-2xl font-bold text-white mt-1">{data.totalViews.toLocaleString()}</p>
              </div>
              <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-4">
                <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Unique pages</p>
                <p className="text-2xl font-bold text-white mt-1">{data.uniquePaths}</p>
              </div>
              <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-4">
                <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">From</p>
                <p className="text-lg font-semibold text-white mt-1">{data.startDate}</p>
              </div>
              <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-4">
                <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">To</p>
                <p className="text-lg font-semibold text-white mt-1">{data.endDate}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-2xl bg-red-500/10 border border-red-500/30 p-6 text-red-400">
          {error}
        </div>
      )}

      {loading && (
        <div className="rounded-2xl bg-slate-800/60 border border-slate-700/50 p-12 text-center text-slate-400">
          Loading analytics…
        </div>
      )}

      {!loading && data && (
        <>
          {/* Page views over time */}
          <AreaChart
            data={data.daily.map((d) => ({ date: d.date, pageViews: d.pageViews }))}
            lines={[{ key: 'pageViews', label: 'Page views', color: '#3b82f6', fillColor: 'rgba(59,130,246,0.2)' }]}
            title="Page views over time"
            subtitle={`${data.startDate} – ${data.endDate}`}
            height={260}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Most visited pages */}
            <HorizontalBarChart
              items={data.byPath.slice(0, 12).map((p, i) => ({
                label: p.path === '/' ? '/' : p.path,
                value: p.count,
                color: BAR_COLORS[i % BAR_COLORS.length],
              }))}
              title="Most visited pages"
              subtitle="By path"
              valueLabel="Views"
            />

            {/* Views by section */}
            <DonutChart
              segments={data.bySection.map((s, i) => ({
                label: s.section,
                value: s.count,
                color: SECTION_COLORS[i % SECTION_COLORS.length],
              }))}
              title="Views by section"
              centerLabel="Total views"
              centerValue={data.totalViews.toLocaleString()}
            />
          </div>

          {/* Location metrics - views by country */}
          {data.byCountry.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DonutChart
                segments={data.byCountry.slice(0, 10).map((c, i) => ({
                  label: c.country,
                  value: c.count,
                  color: LOCATION_COLORS[i % LOCATION_COLORS.length],
                }))}
                title="Views by country"
                centerLabel="Locations"
                centerValue={data.byCountry.length.toString()}
              />
              <HorizontalBarChart
                items={data.byCountry.slice(0, 10).map((c, i) => ({
                  label: c.country,
                  value: c.count,
                  color: LOCATION_COLORS[i % LOCATION_COLORS.length],
                }))}
                title="Top countries by views"
                subtitle="From IP-based geo (ipapi.co)"
                valueLabel="Views"
              />
            </div>
          )}
        </>
      )}

      {!loading && !error && !data?.totalViews && data && (
        <div className="rounded-2xl bg-slate-800/60 border border-slate-700/50 p-8 text-center">
          <p className="text-slate-400">No page views in this range yet. Navigate around the site to generate events.</p>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
