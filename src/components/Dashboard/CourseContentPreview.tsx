import React, { useState, useEffect } from 'react';
import { getLessonContent, type CourseContentEntry, type ContentFile } from '@/lib/courseContent';

interface CourseContentPreviewProps {
  courseId: string;
  moduleNumber: number;
  lessonIndex: number;
  lessonTitle: string;
  moduleName: string;
  children?: React.ReactNode; // Notes component to show alongside
}

const getFileIcon = (type: string) => {
  if (type === 'video') return '🎬';
  if (type === 'audio') return '🔊';
  if (type === 'pdf') return '📄';
  if (type === 'spreadsheet') return '📊';
  return '📎';
};

const FileViewer: React.FC<{ file: ContentFile }> = ({ file }) => {
  if (file.type === 'video') {
    return (
      <div className="aspect-video w-full max-w-3xl bg-black rounded-xl overflow-hidden">
        <video
          src={file.url}
          controls
          className="w-full h-full"
          preload="metadata"
        >
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }
  if (file.type === 'audio') {
    return (
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4">
        <audio src={file.url} controls className="w-full" preload="metadata">
          Your browser does not support the audio tag.
        </audio>
      </div>
    );
  }
  // PDF, document, spreadsheet, other - show download link
  return (
    <a
      href={file.url}
      target="_blank"
      rel="noopener noreferrer"
      download={file.name}
      className="inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-xl text-white hover:from-indigo-500/30 hover:to-purple-500/30 transition-all"
    >
      <span className="text-2xl">{getFileIcon(file.type)}</span>
      <div className="text-left">
        <p className="font-medium">{file.name}</p>
        <p className="text-slate-400 text-sm">Click to download or open</p>
      </div>
      <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    </a>
  );
};

const CourseContentPreview: React.FC<CourseContentPreviewProps> = ({
  courseId,
  moduleNumber,
  lessonIndex,
  lessonTitle,
  moduleName,
  children,
}) => {
  const [content, setContent] = useState<CourseContentEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const entry = await getLessonContent(courseId, moduleNumber, lessonIndex);
        if (!cancelled) setContent(entry);
      } catch {
        if (!cancelled) setError('Could not load content');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [courseId, moduleNumber, lessonIndex]);

  return (
    <div className="space-y-4">
      {/* Lesson context header */}
      <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl px-4 py-3">
        <p className="text-slate-500 text-[10px] uppercase tracking-wider font-medium">Now playing</p>
        <p className="text-white text-sm font-medium">{lessonTitle}</p>
        <p className="text-slate-500 text-xs">Module {moduleNumber === 0 ? 'Bonus' : moduleNumber}: {moduleName}</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 bg-slate-800/30 rounded-xl border border-slate-700/30">
          <svg className="w-8 h-8 animate-spin text-indigo-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      ) : error ? (
        <div className="py-8 text-center text-slate-500 text-sm">{error}</div>
      ) : content && content.files.length > 0 ? (
        <div className="space-y-4">
          {content.files.map((file, i) => (
            <div key={i} className="space-y-2">
              <FileViewer file={file} />
              {file.transcript && (
                <details className="bg-slate-800/40 border border-slate-700/40 rounded-xl">
                  <summary className="px-4 py-3 cursor-pointer text-slate-400 hover:text-white text-sm font-medium">
                    View transcript
                  </summary>
                  <div className="px-4 pb-4">
                    <p className="text-slate-300 text-sm whitespace-pre-wrap">{file.transcript}</p>
                  </div>
                </details>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center bg-slate-800/20 rounded-xl border border-slate-700/30">
          <p className="text-slate-500 text-sm">No content uploaded for this lesson yet.</p>
          <p className="text-slate-600 text-xs mt-1">Use the notes below to capture your key takeaways.</p>
        </div>
      )}

      {/* Notes area (passed as children) */}
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
};

export default CourseContentPreview;
