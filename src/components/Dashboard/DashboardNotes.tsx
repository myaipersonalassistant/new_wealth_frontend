import React, { useState, useEffect, useCallback } from 'react';
import { getStudentNote, upsertStudentNote } from '@/lib/firebaseStudentNotes';

interface DashboardNotesProps {
  courseId: string;
  moduleNumber: number;
  lessonIndex: number;
  lessonTitle: string;
  moduleName: string;
  userId: string;
}

const DashboardNotes: React.FC<DashboardNotesProps> = ({
  courseId,
  moduleNumber,
  lessonIndex,
  lessonTitle,
  moduleName,
  userId,
}) => {
  const [content, setContent] = useState('');
  const [savedContent, setSavedContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Load notes when lesson changes
  useEffect(() => {
    const loadNotes = async () => {
      const data = await getStudentNote(userId, courseId, moduleNumber, lessonIndex);

      if (data) {
        setContent(data.content || '');
        setSavedContent(data.content || '');
        setLastSaved(data.updated_at ? new Date(data.updated_at) : null);
      } else {
        setContent('');
        setSavedContent('');
        setLastSaved(null);
      }
      setHasChanges(false);
    };

    loadNotes();
  }, [courseId, moduleNumber, lessonIndex, userId]);

  // Track changes
  useEffect(() => {
    setHasChanges(content !== savedContent);
  }, [content, savedContent]);

  // Auto-save after 2 seconds of inactivity
  const autoSave = useCallback(async () => {
    if (!hasChanges || saving) return;

    setSaving(true);
    try {
      await upsertStudentNote(userId, courseId, moduleNumber, lessonIndex, content);
      setSavedContent(content);
      setLastSaved(new Date());
      setHasChanges(false);
    } catch (err) {
      console.error('Failed to save notes:', err);
    } finally {
      setSaving(false);
    }
  }, [content, hasChanges, saving, userId, courseId, moduleNumber, lessonIndex]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (hasChanges) {
        autoSave();
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [content, hasChanges, autoSave]);

  const handleManualSave = async () => {
    await autoSave();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-bold text-lg">Lesson Notes</h3>
        <div className="flex items-center gap-2">
          {saving && (
            <span className="text-indigo-400 text-xs flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Saving...
            </span>
          )}
          {!saving && lastSaved && !hasChanges && (
            <span className="text-emerald-400/70 text-xs flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              Saved at {formatTime(lastSaved)}
            </span>
          )}
          {hasChanges && !saving && (
            <span className="text-amber-400/70 text-xs">Unsaved changes</span>
          )}
        </div>
      </div>

      {/* Lesson context */}
      <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl px-4 py-3 mb-3">
        <p className="text-slate-500 text-[10px] uppercase tracking-wider font-medium">Notes for</p>
        <p className="text-white text-sm font-medium truncate">{lessonTitle}</p>
        <p className="text-slate-500 text-xs">Module {moduleNumber}: {moduleName}</p>
      </div>

      {/* Text area */}
      <div className="relative">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your notes for this lesson here... Key takeaways, action items, questions to research..."
          className="w-full h-64 bg-slate-800/40 border border-slate-700/40 rounded-xl p-4 text-slate-300 text-sm leading-relaxed placeholder-slate-600 resize-none focus:outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20 transition-all"
        />

        {/* Character count & save button */}
        <div className="flex items-center justify-between mt-2">
          <span className="text-slate-600 text-xs">
            {content.length} characters
          </span>
          <button
            onClick={handleManualSave}
            disabled={!hasChanges || saving}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
              hasChanges && !saving
                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/30'
                : 'bg-slate-800/40 text-slate-600 border border-slate-700/30 cursor-not-allowed'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Save Notes
          </button>
        </div>
      </div>
    </div>
  );
};

// Empty state when no lesson is selected
export const DashboardNotesEmpty: React.FC = () => (
  <div>
    <h3 className="text-white font-bold text-lg mb-3">Lesson Notes</h3>
    <div className="bg-slate-800/30 border border-slate-700/30 border-dashed rounded-xl p-8 text-center">
      <div className="w-12 h-12 rounded-xl bg-slate-800/60 border border-slate-700/40 flex items-center justify-center mx-auto mb-3">
        <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </div>
      <p className="text-slate-500 text-sm">Select a lesson from the curriculum to start taking notes.</p>
      <p className="text-slate-600 text-xs mt-1">Your notes auto-save as you type.</p>
    </div>
  </div>
);

export default DashboardNotes;
