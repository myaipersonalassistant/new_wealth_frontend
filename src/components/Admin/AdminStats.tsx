import React from 'react';

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

interface AdminStatsProps {
  stats: StatsData | null;
  loading: boolean;
}

const StatCard: React.FC<{
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  subtext?: string;
}> = ({ label, value, icon, color, subtext }) => (
  <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600/50 transition-all">
    <div className="flex items-start justify-between mb-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        {icon}
      </div>
      {subtext && (
        <span className="text-xs font-medium text-slate-500 bg-slate-800 px-2 py-1 rounded-full">
          {subtext}
        </span>
      )}
    </div>
    <p className="text-3xl font-bold text-white mb-1">{value}</p>
    <p className="text-slate-400 text-sm">{label}</p>
  </div>
);

const AdminStats: React.FC<AdminStatsProps> = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 animate-pulse">
              <div className="w-12 h-12 bg-slate-700 rounded-xl mb-4" />
              <div className="h-8 w-20 bg-slate-700 rounded mb-2" />
              <div className="h-4 w-32 bg-slate-700/50 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const dailyBreakdown = stats.dailyBreakdown || [];
  const maxCount = Math.max(...dailyBreakdown.map((d) => d.count), 1);

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Subscribers"
          value={stats.total.toLocaleString()}
          color="bg-amber-500/10"
          icon={
            <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        />
        <StatCard
          label="Active Subscribers"
          value={stats.active.toLocaleString()}
          color="bg-emerald-500/10"
          icon={
            <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          subtext={stats.total > 0 ? `${Math.round((stats.active / stats.total) * 100)}%` : '0%'}
        />
        <StatCard
          label="New This Week"
          value={stats.recentCount.toLocaleString()}
          color="bg-blue-500/10"
          icon={
            <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
          subtext="Last 7 days"
        />
        <StatCard
          label="This Month"
          value={stats.monthlyCount.toLocaleString()}
          color="bg-purple-500/10"
          icon={
            <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
          subtext="Last 30 days"
        />
      </div>

      {/* Daily Signups Chart */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-white font-semibold text-lg">Daily Signups</h3>
            <p className="text-slate-400 text-sm">Last 7 days</p>
          </div>
          <div className="flex items-center gap-2">
            {stats.unsubscribed > 0 && (
              <span className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-full">
                {stats.unsubscribed} unsubscribed
              </span>
            )}
            {stats.bounced > 0 && (
              <span className="text-xs text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-full">
                {stats.bounced} bounced
              </span>
            )}
          </div>
        </div>

        {/* Bar Chart */}
        <div className="flex items-end gap-2 h-40">
          {dailyBreakdown.map((day, i) => {
            const heightPercent = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
            const dateObj = new Date(day.date + 'T00:00:00');
            const dayLabel = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
            const dateLabel = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">{day.count}</span>
                <div className="w-full flex justify-center">
                  <div
                    className="w-full max-w-[48px] bg-gradient-to-t from-amber-500/60 to-amber-400/90 rounded-t-lg transition-all duration-500 hover:from-amber-500/80 hover:to-amber-400 cursor-default min-h-[4px]"
                    style={{ height: `${Math.max(heightPercent, 3)}%` }}
                    title={`${dateLabel}: ${day.count} signups`}
                  />
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-500 font-medium">{dayLabel}</p>
                  <p className="text-[10px] text-slate-600">{dateLabel}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
