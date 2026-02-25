import React, { useState } from 'react';
import { Resource } from '@/data/courseData';

interface DashboardResourcesProps {
  resources: Resource[];
}

const typeIcons: Record<string, { icon: JSX.Element; color: string; label: string }> = {
  spreadsheet: {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    color: 'emerald',
    label: 'Spreadsheet',
  },
  template: {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    color: 'indigo',
    label: 'Template',
  },
  checklist: {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    color: 'amber',
    label: 'Checklist',
  },
  pdf: {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    color: 'rose',
    label: 'PDF',
  },
  guide: {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    color: 'purple',
    label: 'Guide',
  },
};

const colorClasses: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', badge: 'bg-emerald-500/10 text-emerald-400' },
  indigo: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', text: 'text-indigo-400', badge: 'bg-indigo-500/10 text-indigo-400' },
  amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', badge: 'bg-amber-500/10 text-amber-400' },
  rose: { bg: 'bg-rose-500/10', border: 'border-rose-500/20', text: 'text-rose-400', badge: 'bg-rose-500/10 text-rose-400' },
  purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400', badge: 'bg-purple-500/10 text-purple-400' },
};

const DashboardResources: React.FC<DashboardResourcesProps> = ({ resources }) => {
  const [filter, setFilter] = useState<string>('all');
  const [downloadedIds, setDownloadedIds] = useState<Set<number>>(new Set());

  const types = ['all', ...Array.from(new Set(resources.map(r => r.type)))];

  const filtered = filter === 'all' ? resources : resources.filter(r => r.type === filter);

  const handleDownload = (index: number, name: string) => {
    setDownloadedIds(prev => new Set(prev).add(index));
    // Simulate download
    const blob = new Blob([`${name}\n\nThis is a placeholder for the downloadable resource.\nThe actual file will be available in the course platform.`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold text-lg">Resources & Downloads</h3>
        <span className="text-slate-500 text-sm">{resources.length} files</span>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {types.map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === type
                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                : 'bg-slate-800/40 text-slate-500 hover:text-slate-300 border border-transparent'
            }`}
          >
            {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1) + 's'}
          </button>
        ))}
      </div>

      {/* Resources list */}
      <div className="space-y-2">
        {filtered.map((resource, i) => {
          const typeInfo = typeIcons[resource.type] || typeIcons.pdf;
          const colors = colorClasses[typeInfo.color] || colorClasses.indigo;
          const isDownloaded = downloadedIds.has(i);

          return (
            <div
              key={i}
              className="bg-slate-800/40 border border-slate-700/30 rounded-xl p-4 hover:border-slate-600/50 transition-all group"
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg ${colors.bg} border ${colors.border} flex items-center justify-center flex-shrink-0 ${colors.text}`}>
                  {typeInfo.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="text-white font-medium text-sm truncate">{resource.name}</h4>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${colors.badge} flex-shrink-0`}>
                      {typeInfo.label.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs leading-relaxed">{resource.description}</p>
                  {resource.moduleNumber && (
                    <p className="text-slate-600 text-[10px] mt-1">Module {resource.moduleNumber}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDownload(i, resource.name)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all flex-shrink-0 ${
                    isDownloaded
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-slate-700/50 text-slate-300 hover:bg-indigo-500/20 hover:text-indigo-400 border border-slate-600/30 hover:border-indigo-500/30'
                  }`}
                >
                  {isDownloaded ? (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      Downloaded
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardResources;
