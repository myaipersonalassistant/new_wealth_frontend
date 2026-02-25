import React, { useState, useMemo } from 'react';

/** At least date + any numeric keys used by lines (e.g. pageViews, campaignsSent, ...) */
interface TimeSeriesPoint {
  date: string;
  [key: string]: string | number;
}

interface ChartLine {
  key: string;
  label: string;
  color: string;
  fillColor?: string;
}

interface AreaChartProps {
  data: TimeSeriesPoint[];
  lines: ChartLine[];
  title: string;
  subtitle?: string;
  height?: number;
}



const formatDate = (dateStr: string) => {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

const formatDateShort = (dateStr: string) => {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }).replace(' ', '\n');
};

export const AreaChart: React.FC<AreaChartProps> = ({ data, lines, title, subtitle, height = 240 }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeLine, setActiveLine] = useState<string | null>(null);

  const chartPadding = { top: 20, right: 20, bottom: 40, left: 50 };
  const chartWidth = 800;
  const chartHeight = height;
  const innerWidth = chartWidth - chartPadding.left - chartPadding.right;
  const innerHeight = chartHeight - chartPadding.top - chartPadding.bottom;

  const { maxValue, yTicks } = useMemo(() => {
    let max = 0;
    for (const point of data) {
      for (const line of lines) {
        const val = (point[line.key] as number) || 0;
        if (val > max) max = val;
      }
    }
    max = Math.max(max, 1);
    const step = Math.ceil(max / 4);
    const roundedMax = step * 4;
    const ticks = [0, step, step * 2, step * 3, roundedMax];
    return { maxValue: roundedMax, yTicks: ticks };
  }, [data, lines]);

  const getX = (i: number) => chartPadding.left + (i / Math.max(data.length - 1, 1)) * innerWidth;
  const getY = (val: number) => chartPadding.top + innerHeight - (val / maxValue) * innerHeight;

  const getPath = (line: ChartLine) => {
    return data.map((point, i) => {
      const x = getX(i);
      const y = getY((point[line.key] as number) || 0);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  const getAreaPath = (line: ChartLine) => {
    const linePath = data.map((point, i) => {
      const x = getX(i);
      const y = getY((point[line.key] as number) || 0);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
    const lastX = getX(data.length - 1);
    const firstX = getX(0);
    const bottomY = getY(0);
    return `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  };

  // Show fewer x-axis labels if data is dense
  const labelInterval = data.length > 14 ? Math.ceil(data.length / 7) : data.length > 7 ? 2 : 1;

  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-semibold text-sm">{title}</h3>
          {subtitle && <p className="text-slate-500 text-xs mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {lines.map(line => (
            <button
              key={line.key}
              onClick={() => setActiveLine(activeLine === line.key ? null : line.key)}
              className={`flex items-center gap-1.5 text-xs transition-all ${
                activeLine && activeLine !== line.key ? 'opacity-30' : 'opacity-100'
              }`}
            >
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: line.color }} />
              <span className="text-slate-400">{line.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="relative overflow-hidden">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full"
          preserveAspectRatio="xMidYMid meet"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {/* Grid lines */}
          {yTicks.map((tick, i) => (
            <g key={i}>
              <line
                x1={chartPadding.left}
                y1={getY(tick)}
                x2={chartWidth - chartPadding.right}
                y2={getY(tick)}
                stroke="#334155"
                strokeWidth="1"
                strokeDasharray={i === 0 ? "0" : "4 4"}
              />
              <text
                x={chartPadding.left - 8}
                y={getY(tick) + 4}
                textAnchor="end"
                fill="#64748b"
                fontSize="11"
              >
                {tick}
              </text>
            </g>
          ))}

          {/* Area fills */}
          {lines.map(line => {
            if (activeLine && activeLine !== line.key) return null;
            return (
              <path
                key={`area-${line.key}`}
                d={getAreaPath(line)}
                fill={line.fillColor || line.color}
                opacity="0.08"
              />
            );
          })}

          {/* Lines */}
          {lines.map(line => {
            if (activeLine && activeLine !== line.key) return null;
            return (
              <path
                key={`line-${line.key}`}
                d={getPath(line)}
                fill="none"
                stroke={line.color}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            );
          })}

          {/* Data points */}
          {lines.map(line => {
            if (activeLine && activeLine !== line.key) return null;
            return data.map((point, i) => {
              const val = (point[line.key] as number) || 0;
              if (val === 0 && hoveredIndex !== i) return null;
              return (
                <circle
                  key={`dot-${line.key}-${i}`}
                  cx={getX(i)}
                  cy={getY(val)}
                  r={hoveredIndex === i ? 5 : 3}
                  fill={line.color}
                  stroke="#1e293b"
                  strokeWidth="2"
                  className="transition-all"
                />
              );
            });
          })}

          {/* Hover zones */}
          {data.map((_, i) => (
            <rect
              key={`hover-${i}`}
              x={getX(i) - innerWidth / data.length / 2}
              y={chartPadding.top}
              width={innerWidth / data.length}
              height={innerHeight}
              fill="transparent"
              onMouseEnter={() => setHoveredIndex(i)}
            />
          ))}

          {/* Hover line */}
          {hoveredIndex !== null && (
            <line
              x1={getX(hoveredIndex)}
              y1={chartPadding.top}
              x2={getX(hoveredIndex)}
              y2={chartPadding.top + innerHeight}
              stroke="#475569"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          )}

          {/* X-axis labels */}
          {data.map((point, i) => {
            if (i % labelInterval !== 0 && i !== data.length - 1) return null;
            return (
              <text
                key={`xlabel-${i}`}
                x={getX(i)}
                y={chartHeight - 8}
                textAnchor="middle"
                fill="#64748b"
                fontSize="10"
              >
                {formatDate(point.date)}
              </text>
            );
          })}
        </svg>

        {/* Tooltip */}
        {hoveredIndex !== null && data[hoveredIndex] && (
          <div
            className="absolute bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 shadow-xl pointer-events-none z-10"
            style={{
              left: `${(getX(hoveredIndex) / chartWidth) * 100}%`,
              top: '8px',
              transform: hoveredIndex > data.length * 0.7 ? 'translateX(-100%)' : 'translateX(-50%)',
            }}
          >
            <p className="text-slate-400 text-[10px] font-medium mb-1">
              {formatDate(data[hoveredIndex].date)}
            </p>
            {lines.map(line => {
              if (activeLine && activeLine !== line.key) return null;
              const val = (data[hoveredIndex!][line.key] as number) || 0;
              return (
                <div key={line.key} className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: line.color }} />
                  <span className="text-slate-400">{line.label}:</span>
                  <span className="text-white font-bold">{val.toLocaleString()}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// HORIZONTAL BAR CHART
// ═══════════════════════════════════════════════════════════

interface BarChartItem {
  label: string;
  value: number;
  secondaryValue?: number;
  color: string;
}

interface HorizontalBarChartProps {
  items: BarChartItem[];
  title: string;
  subtitle?: string;
  valueLabel?: string;
  secondaryLabel?: string;
}

export const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({
  items,
  title,
  subtitle,
  valueLabel = 'Value',
  secondaryLabel,
}) => {
  const maxVal = Math.max(...items.map(i => i.value), 1);

  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">
      <div className="mb-4">
        <h3 className="text-white font-semibold text-sm">{title}</h3>
        {subtitle && <p className="text-slate-500 text-xs mt-0.5">{subtitle}</p>}
      </div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-300 text-xs font-medium truncate max-w-[60%]">{item.label}</span>
              <div className="flex items-center gap-3">
                <span className="text-white text-xs font-bold">{item.value.toLocaleString()}</span>
                {item.secondaryValue !== undefined && (
                  <span className="text-slate-500 text-[10px]">
                    {secondaryLabel}: {item.secondaryValue}%
                  </span>
                )}
              </div>
            </div>
            <div className="w-full bg-slate-700/30 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${(item.value / maxVal) * 100}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// DONUT CHART
// ═══════════════════════════════════════════════════════════

interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  segments: DonutSegment[];
  title: string;
  centerLabel?: string;
  centerValue?: string;
}

export const DonutChart: React.FC<DonutChartProps> = ({ segments, title, centerLabel, centerValue }) => {
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  const radius = 60;
  const strokeWidth = 16;
  const circumference = 2 * Math.PI * radius;

  let currentAngle = 0;

  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">
      <h3 className="text-white font-semibold text-sm mb-4">{title}</h3>
      <div className="flex items-center gap-6">
        <div className="relative flex-shrink-0">
          <svg width="160" height="160" viewBox="0 0 160 160">
            {segments.map((seg, i) => {
              const pct = total > 0 ? seg.value / total : 0;
              const dashLength = pct * circumference;
              const dashOffset = -currentAngle * circumference;
              currentAngle += pct;

              return (
                <circle
                  key={i}
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth={hoveredSegment === i ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round"
                  transform="rotate(-90 80 80)"
                  className="transition-all cursor-pointer"
                  onMouseEnter={() => setHoveredSegment(i)}
                  onMouseLeave={() => setHoveredSegment(null)}
                  opacity={hoveredSegment !== null && hoveredSegment !== i ? 0.4 : 1}
                />
              );
            })}
            <text x="80" y="74" textAnchor="middle" fill="#f8fafc" fontSize="22" fontWeight="bold">
              {centerValue || total.toLocaleString()}
            </text>
            <text x="80" y="94" textAnchor="middle" fill="#64748b" fontSize="11">
              {centerLabel || 'Total'}
            </text>
          </svg>
        </div>
        <div className="flex-1 space-y-2">
          {segments.map((seg, i) => {
            const pct = total > 0 ? ((seg.value / total) * 100).toFixed(1) : '0.0';
            return (
              <div
                key={i}
                className={`flex items-center justify-between transition-opacity ${
                  hoveredSegment !== null && hoveredSegment !== i ? 'opacity-40' : 'opacity-100'
                }`}
                onMouseEnter={() => setHoveredSegment(i)}
                onMouseLeave={() => setHoveredSegment(null)}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: seg.color }} />
                  <span className="text-slate-400 text-xs">{seg.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white text-xs font-bold">{seg.value.toLocaleString()}</span>
                  <span className="text-slate-600 text-[10px]">{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// FUNNEL STEP PERFORMANCE CHART
// ═══════════════════════════════════════════════════════════

interface StepMetric {
  stepNumber: number;
  subject: string;
  purpose: string;
  sent: number;
  opened: number;
  clicked: number;
  failed: number;
  openRate: number;
  clickRate: number;
}

interface FunnelPerformance {
  funnelId: string;
  funnelName: string;
  isActive: boolean;
  totalEnrolled: number;
  steps: StepMetric[];
}

interface FunnelStepChartProps {
  funnels: FunnelPerformance[];
}

export const FunnelStepChart: React.FC<FunnelStepChartProps> = ({ funnels }) => {
  const [selectedFunnel, setSelectedFunnel] = useState(0);

  if (funnels.length === 0) {
    return (
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">
        <h3 className="text-white font-semibold text-sm mb-2">Funnel Step Performance</h3>
        <p className="text-slate-500 text-sm">No funnel data available yet.</p>
      </div>
    );
  }

  const funnel = funnels[selectedFunnel];
  const maxSent = Math.max(...(funnel?.steps || []).map(s => s.sent), 1);

  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-semibold text-sm">Funnel Step Performance</h3>
          <p className="text-slate-500 text-xs mt-0.5">Open & click rates per step</p>
        </div>
        {funnels.length > 1 && (
          <select
            value={selectedFunnel}
            onChange={(e) => setSelectedFunnel(Number(e.target.value))}
            className="bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-300 text-xs focus:outline-none focus:border-amber-500/50"
          >
            {funnels.map((f, i) => (
              <option key={f.funnelId} value={i}>{f.funnelName}</option>
            ))}
          </select>
        )}
      </div>

      {funnel && funnel.steps.length > 0 ? (
        <div className="space-y-3">
          {/* Legend */}
          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center gap-1.5 text-[10px]">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-slate-400">Open Rate</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px]">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />
              <span className="text-slate-400">Click Rate</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px]">
              <div className="w-3 h-2 rounded bg-amber-500/30" />
              <span className="text-slate-400">Emails Sent</span>
            </div>
          </div>

          {funnel.steps.map((step) => (
            <div key={step.stepNumber} className="group">
              <div className="flex items-center gap-3 mb-1.5">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-[10px] font-bold">{step.stepNumber}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-300 text-xs font-medium truncate">{step.subject}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-slate-600 text-[10px]">{step.sent} sent</span>
                    {step.purpose && (
                      <span className="text-slate-600 text-[10px] capitalize">{step.purpose}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-center">
                    <p className="text-emerald-400 text-xs font-bold">{step.openRate}%</p>
                    <p className="text-slate-600 text-[9px]">Opens</p>
                  </div>
                  <div className="text-center">
                    <p className="text-blue-400 text-xs font-bold">{step.clickRate}%</p>
                    <p className="text-slate-600 text-[9px]">Clicks</p>
                  </div>
                </div>
              </div>
              {/* Mini bar */}
              <div className="ml-10 flex items-center gap-1">
                <div className="flex-1 bg-slate-700/20 rounded-full h-1.5 overflow-hidden">
                  <div className="flex h-full">
                    <div
                      className="bg-amber-500/40 h-full transition-all"
                      style={{ width: `${(step.sent / maxSent) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-slate-500 text-sm">No steps in this funnel yet.</p>
      )}
    </div>
  );
};

export default AreaChart;
