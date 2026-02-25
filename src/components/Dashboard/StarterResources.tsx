import React, { useState, useEffect } from 'react';
import { listStarterResources, type StarterResource, type ResourceType } from '@/lib/starterResources';

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const getFileIcon = (ft: ResourceType) => {
  if (ft === 'video') {
    return (
      <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
        <svg className="w-7 h-7 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }
  if (ft === 'audio') {
    return (
      <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
        <svg className="w-7 h-7 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
      </div>
    );
  }
  if (ft === 'pdf' || ft === 'document') {
    return (
      <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
        <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }
  if (ft === 'spreadsheet') {
    return (
      <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
        <svg className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }
  return (
    <div className="w-14 h-14 rounded-2xl bg-slate-500/10 border border-slate-500/20 flex items-center justify-center">
      <svg className="w-7 h-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </div>
  );
};

interface ResourceCardProps {
  resource: StarterResource;
  getFileIcon: (ft: ResourceType) => React.ReactNode;
  formatFileSize: (b: number) => string;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, getFileIcon, formatFileSize }) => {
  const [showTranscript, setShowTranscript] = useState(false);

  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 hover:border-indigo-500/30 transition-all group">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-shrink-0">{getFileIcon(resource.file_type)}</div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-lg group-hover:text-indigo-300 transition-colors">
            {resource.title}
          </h3>
          {resource.description && (
            <p className="text-slate-400 text-sm mt-1">{resource.description}</p>
          )}
          <div className="flex flex-wrap items-center gap-3 mt-3">
            <a
              href={resource.file_url}
              target="_blank"
              rel="noopener noreferrer"
              download={resource.file_name}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-medium rounded-xl text-sm transition-all shadow-lg shadow-indigo-500/20"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download {resource.file_name}
            </a>
            {resource.transcript && (
              <button
                onClick={() => setShowTranscript(!showTranscript)}
                className="inline-flex items-center gap-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/30 rounded-xl text-slate-300 hover:text-white text-sm transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {showTranscript ? 'Hide transcript' : 'View transcript'}
              </button>
            )}
            {resource.file_size != null && resource.file_size > 0 && (
              <span className="text-slate-500 text-xs">{formatFileSize(resource.file_size)}</span>
            )}
          </div>
          {showTranscript && resource.transcript && (
            <div className="mt-4 p-4 bg-slate-900/60 border border-slate-700/50 rounded-xl">
              <p className="text-slate-300 text-sm whitespace-pre-wrap">{resource.transcript}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StarterResources: React.FC = () => {
  const [resources, setResources] = useState<StarterResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const list = await listStarterResources();
        if (!cancelled) setResources(list);
      } catch (err) {
        if (!cancelled) setError('Unable to load resources');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 animate-pulse">
            <div className="flex gap-4">
              <div className="w-14 h-14 bg-slate-700 rounded-2xl" />
              <div className="flex-1">
                <div className="h-6 bg-slate-700 rounded w-48 mb-2" />
                <div className="h-4 bg-slate-700/50 rounded w-72" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-800/60 border border-red-500/30 rounded-2xl p-8 text-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-12 text-center">
        <p className="text-slate-400">No resources available yet. Check back soon.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {resources.map(res => (
        <ResourceCard
          key={res.id}
          resource={res}
          getFileIcon={getFileIcon}
          formatFileSize={formatFileSize}
        />
      ))}
    </div>
  );
};

export default StarterResources;
