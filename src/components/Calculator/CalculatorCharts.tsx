import React, { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell
} from 'recharts';

interface ProjectionData {
  year: number;
  propertyValue: number;
  equity: number;
  totalRentCollected: number;
  cumulativeCashFlow: number;
  mortgageBalance: number;
  annualRent: number;
  annualMortgage: number;
  annualCashFlow: number;
}

interface CalculatorChartsProps {
  projectionData: ProjectionData[];
  isAdvancedUnlocked: boolean;
  monthlyPayment: number;
  monthlyRent: number;
  monthlyExpenses: number;
  depositAmount: number;
  loanAmount: number;
}

const formatCurrency = (value: number) => {
  if (Math.abs(value) >= 1000000) return `£${(value / 1000000).toFixed(1)}M`;
  if (Math.abs(value) >= 1000) return `£${(value / 1000).toFixed(0)}K`;
  return `£${value.toFixed(0)}`;
};

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 shadow-xl">
      <p className="text-white font-semibold mb-2">Year {label}</p>
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: entry.color }} />
          <span className="text-slate-400">{entry.name}:</span>
          <span className="text-white font-medium">{formatCurrency(entry.value)}</span>
        </div>
      ))}
    </div>
  );
};

const COLORS = {
  amber: '#f59e0b',
  emerald: '#10b981',
  blue: '#3b82f6',
  purple: '#8b5cf6',
  red: '#ef4444',
  slate: '#64748b',
};

const CalculatorCharts: React.FC<CalculatorChartsProps> = ({
  projectionData,
  isAdvancedUnlocked,
  monthlyPayment,
  monthlyRent,
  monthlyExpenses,
  depositAmount,
  loanAmount,
}) => {
  const [activeChart, setActiveChart] = useState<'wealth' | 'cashflow' | 'breakdown' | 'equity'>('wealth');

  const tabs = [
    { id: 'wealth' as const, label: 'Wealth Growth', icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    )},
    { id: 'cashflow' as const, label: 'Cash Flow', icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
      </svg>
    )},
    { id: 'equity' as const, label: 'Equity vs Debt', icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )},
    { id: 'breakdown' as const, label: 'Monthly Split', icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
      </svg>
    )},
  ];

  // Pie chart data for monthly breakdown
  const pieData = [
    { name: 'Mortgage', value: monthlyPayment, color: COLORS.amber },
    { name: 'Expenses', value: monthlyExpenses, color: COLORS.red },
    { name: 'Cash Flow', value: Math.max(0, monthlyRent - monthlyPayment - monthlyExpenses), color: COLORS.emerald },
  ].filter(d => d.value > 0);

  // Locked overlay
  const LockedOverlay = () => (
    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center z-10">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      <p className="text-white font-semibold text-lg mb-1">Unlock Advanced Charts</p>
      <p className="text-slate-400 text-sm mb-4">Enter your email below to access full projections</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
          Visual Projections
        </h3>
        <p className="text-slate-400 text-sm mt-1">See how your investment grows over time</p>
      </div>

      {/* Chart Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveChart(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeChart === tab.id
                ? 'bg-amber-500 text-slate-900'
                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Chart Container */}
      <div className="relative bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">
        {!isAdvancedUnlocked && activeChart !== 'breakdown' && <LockedOverlay />}

        {/* Wealth Growth Chart */}
        {activeChart === 'wealth' && (
          <div>
            <h4 className="text-white font-medium mb-4">25-Year Wealth Projection</h4>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={projectionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPropertyValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.amber} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={COLORS.amber} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.emerald} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={COLORS.emerald} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorCashFlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.blue} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={COLORS.blue} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="year" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={formatCurrency} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ paddingTop: '10px' }}
                    formatter={(value: string) => <span style={{ color: '#94a3b8', fontSize: '12px' }}>{value}</span>}
                  />
                  <Area type="monotone" dataKey="propertyValue" name="Property Value" stroke={COLORS.amber} fill="url(#colorPropertyValue)" strokeWidth={2} />
                  <Area type="monotone" dataKey="equity" name="Equity" stroke={COLORS.emerald} fill="url(#colorEquity)" strokeWidth={2} />
                  <Area type="monotone" dataKey="cumulativeCashFlow" name="Cumulative Cash Flow" stroke={COLORS.blue} fill="url(#colorCashFlow)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Cash Flow Chart */}
        {activeChart === 'cashflow' && (
          <div>
            <h4 className="text-white font-medium mb-4">Annual Cash Flow Over Time</h4>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="year" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={formatCurrency} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ paddingTop: '10px' }}
                    formatter={(value: string) => <span style={{ color: '#94a3b8', fontSize: '12px' }}>{value}</span>}
                  />
                  <Bar dataKey="annualRent" name="Rental Income" fill={COLORS.emerald} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="annualMortgage" name="Mortgage Cost" fill={COLORS.amber} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="annualCashFlow" name="Net Cash Flow" fill={COLORS.blue} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Equity vs Debt Chart */}
        {activeChart === 'equity' && (
          <div>
            <h4 className="text-white font-medium mb-4">Equity Growth vs Remaining Mortgage</h4>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={projectionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="year" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={formatCurrency} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ paddingTop: '10px' }}
                    formatter={(value: string) => <span style={{ color: '#94a3b8', fontSize: '12px' }}>{value}</span>}
                  />
                  <Line type="monotone" dataKey="equity" name="Your Equity" stroke={COLORS.emerald} strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="mortgageBalance" name="Mortgage Balance" stroke={COLORS.red} strokeWidth={3} dot={false} strokeDasharray="5 5" />
                  <Line type="monotone" dataKey="propertyValue" name="Property Value" stroke={COLORS.amber} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Monthly Breakdown Pie */}
        {activeChart === 'breakdown' && (
          <div>
            <h4 className="text-white font-medium mb-4">Monthly Income Allocation</h4>
            <div className="h-80 flex items-center justify-center">
              {monthlyRent > 0 ? (
                <div className="flex flex-col md:flex-row items-center gap-8 w-full">
                  <div className="flex-1 flex justify-center">
                    <ResponsiveContainer width={280} height={280}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={120}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number) => formatCurrency(value)}
                          contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }}
                          labelStyle={{ color: '#fff' }}
                          itemStyle={{ color: '#94a3b8' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 space-y-4">
                    {pieData.map((item) => (
                      <div key={item.name} className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: item.color }} />
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium">{item.name}</p>
                          <p className="text-slate-400 text-xs">{formatCurrency(item.value)}/month</p>
                        </div>
                        <p className="text-white font-semibold text-sm">
                          {((item.value / monthlyRent) * 100).toFixed(0)}%
                        </p>
                      </div>
                    ))}
                    <div className="pt-3 border-t border-slate-700/50">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300 font-medium text-sm">Total Rental Income</span>
                        <span className="text-amber-400 font-bold">{formatCurrency(monthlyRent)}/mo</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <svg className="w-16 h-16 text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  </svg>
                  <p className="text-slate-400">Set a rental income to see the breakdown</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Summary Stats below chart */}
        {isAdvancedUnlocked && projectionData.length > 0 && activeChart !== 'breakdown' && (
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-700/50">
            <div className="text-center">
              <p className="text-slate-400 text-xs mb-1">Property Value (Year 25)</p>
              <p className="text-amber-400 font-bold text-lg">{formatCurrency(projectionData[projectionData.length - 1]?.propertyValue || 0)}</p>
            </div>
            <div className="text-center">
              <p className="text-slate-400 text-xs mb-1">Total Equity (Year 25)</p>
              <p className="text-emerald-400 font-bold text-lg">{formatCurrency(projectionData[projectionData.length - 1]?.equity || 0)}</p>
            </div>
            <div className="text-center">
              <p className="text-slate-400 text-xs mb-1">Total Cash Collected</p>
              <p className="text-blue-400 font-bold text-lg">{formatCurrency(projectionData[projectionData.length - 1]?.cumulativeCashFlow || 0)}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalculatorCharts;
