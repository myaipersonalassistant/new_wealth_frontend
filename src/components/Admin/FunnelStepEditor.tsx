import React, { useState, useRef } from 'react';
import { MASTERCLASS_FUNNEL_EMAILS } from '@/data/masterclassFunnelEmails';

export interface FunnelStep {
  id?: string;

  funnel_id: string;
  step_number: number;
  subject: string;
  html_body: string;
  plain_text: string;
  delay_days: number;
  delay_hours: number;
  is_active: boolean;
  sender_name: string;
  sender_email: string;
  step_purpose?: string;
  cta_url?: string;
  cta_label?: string;
  analytics?: {
    sent: number;
    opened: number;
    clicked: number;
    failed: number;
    atStep?: number;
  };
}

interface FunnelStepEditorProps {
  step: FunnelStep;
  totalSteps: number;
  isExpanded: boolean;
  isSaving: boolean;
  onToggleExpand: () => void;
  onSave: (step: FunnelStep) => void;
  onDelete: () => void;
}

// Purpose badges for the book-to-course funnel
const STEP_PURPOSES: Record<string, { label: string; color: string; icon: string }> = {
  'deliver': { label: 'Deliver Lead Magnet', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', icon: 'M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  'educate': { label: 'Educate', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  'social-proof': { label: 'Social Proof', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  'engage': { label: 'Engage', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30', icon: 'M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122' },
  'soft-sell': { label: 'Soft Sell', color: 'bg-orange-500/10 text-orange-400 border-orange-500/30', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
  'course-intro': { label: 'Course Introduction', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
  'course-details': { label: 'Course Details + Offer', color: 'bg-rose-500/10 text-rose-400 border-rose-500/30', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' },
  'hard-close': { label: 'Final Close', color: 'bg-red-500/10 text-red-400 border-red-500/30', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  // Upsell funnel purposes
  'congratulate': { label: 'Congratulate', color: 'bg-teal-500/10 text-teal-400 border-teal-500/30', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' },
  'advanced-educate': { label: 'Advanced Education', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
  'case-study': { label: 'Case Study', color: 'bg-violet-500/10 text-violet-400 border-violet-500/30', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  'alumni-offer': { label: 'Alumni Offer', color: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/30', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  'alumni-close': { label: 'Alumni Close', color: 'bg-rose-500/10 text-rose-400 border-rose-500/30', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
};


// Build STEP_TEMPLATES from the masterclass funnel email definitions
const STEP_TEMPLATES = [
  ...MASTERCLASS_FUNNEL_EMAILS.map((email) => ({
    id: `mc-step-${email.step_number}`,
    name: `Email ${email.step_number}: ${email.summary.slice(0, 40)}`,
    purpose: email.step_purpose,
    subject: email.subject,
    cta_url: email.cta_url,
    cta_label: email.cta_label,
    html: email.html_body,
  })),
  {
    id: 'blank',
    name: 'Blank Template',
    purpose: '',
    subject: '',
    cta_url: '',
    cta_label: '',
    html: '',
  },
];



const FunnelStepEditor: React.FC<FunnelStepEditorProps> = ({
  step,
  totalSteps,
  isExpanded,
  isSaving,
  onToggleExpand,
  onSave,
  onDelete,
}) => {
  const [editStep, setEditStep] = useState<FunnelStep>({ ...step });
  const [showPreview, setShowPreview] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const handleFieldChange = (field: keyof FunnelStep, value: any) => {
    setEditStep(prev => ({ ...prev, [field]: value }));
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const syncEditor = () => {
    if (editorRef.current) {
      setEditStep(prev => ({ ...prev, html_body: editorRef.current!.innerHTML }));
    }
  };

  const handleSave = () => {
    if (editorRef.current && !showPreview) {
      const html = editorRef.current.innerHTML;
      onSave({ ...editStep, html_body: html });
    } else {
      onSave(editStep);
    }
  };

  const applyTemplate = (templateId: string) => {
    const t = STEP_TEMPLATES.find(t => t.id === templateId);
    if (t) {
      setEditStep(prev => ({
        ...prev,
        subject: t.subject || prev.subject,
        html_body: t.html,
        step_purpose: t.purpose || prev.step_purpose,
        cta_url: t.cta_url || prev.cta_url,
        cta_label: t.cta_label || prev.cta_label,
      }));
      if (editorRef.current) editorRef.current.innerHTML = t.html;
    }
  };

  const totalDelay = editStep.delay_days * 24 + editStep.delay_hours;
  const delayLabel = editStep.step_number === 1
    ? (totalDelay === 0 ? 'Immediately' : `${editStep.delay_days}d ${editStep.delay_hours}h after enrollment`)
    : (totalDelay === 0 ? 'Immediately after previous' : `${editStep.delay_days}d ${editStep.delay_hours}h after previous`);

  const analytics = step.analytics || { sent: 0, opened: 0, clicked: 0, failed: 0 };
  const openRate = analytics.sent > 0 ? ((analytics.opened / analytics.sent) * 100).toFixed(1) : '0';
  const purposeInfo = editStep.step_purpose ? STEP_PURPOSES[editStep.step_purpose] : null;

  return (
    <div className={`border rounded-2xl transition-all ${
      isExpanded
        ? 'border-amber-500/30 bg-slate-800/80'
        : step.is_active
          ? 'border-slate-700/50 bg-slate-800/40 hover:border-slate-600/50'
          : 'border-slate-700/30 bg-slate-800/20 opacity-60'
    }`}>
      {/* Step Header */}
      <div
        className="px-5 py-4 cursor-pointer flex items-center gap-4"
        onClick={onToggleExpand}
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm ${
          step.is_active
            ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-slate-900'
            : 'bg-slate-700 text-slate-400'
        }`}>
          {step.step_number}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <h4 className="text-white font-medium text-sm truncate">
              {step.subject || `Step ${step.step_number} (untitled)`}
            </h4>
            {!step.is_active && (
              <span className="px-2 py-0.5 bg-slate-700 text-slate-400 text-[10px] rounded-full font-medium">DISABLED</span>
            )}
            {purposeInfo && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${purposeInfo.color}`}>
                {purposeInfo.label}
              </span>
            )}
          </div>
          <p className="text-slate-500 text-xs">{delayLabel}</p>
        </div>

        <div className="hidden md:flex items-center gap-4 mr-2">
          <div className="text-center">
            <p className="text-slate-300 font-semibold text-xs">{analytics.sent}</p>
            <p className="text-slate-600 text-[10px]">Sent</p>
          </div>
          <div className="text-center">
            <p className="text-emerald-400 font-semibold text-xs">{openRate}%</p>
            <p className="text-slate-600 text-[10px]">Opens</p>
          </div>
          {analytics.clicked > 0 && (
            <div className="text-center">
              <p className="text-blue-400 font-semibold text-xs">{analytics.clicked}</p>
              <p className="text-slate-600 text-[10px]">Clicks</p>
            </div>
          )}
        </div>

        <svg
          className={`w-4 h-4 text-slate-500 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Expanded Editor */}
      {isExpanded && (
        <div className="px-5 pb-5 border-t border-slate-700/30 pt-5 space-y-4">
          {/* Timing, Status & Purpose Row */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Delay (Days)</label>
              <input
                type="number"
                min="0"
                max="365"
                value={editStep.delay_days}
                onChange={(e) => handleFieldChange('delay_days', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-900/60 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Delay (Hours)</label>
              <input
                type="number"
                min="0"
                max="23"
                value={editStep.delay_hours}
                onChange={(e) => handleFieldChange('delay_hours', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-900/60 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Purpose</label>
              <select
                value={editStep.step_purpose || ''}
                onChange={(e) => handleFieldChange('step_purpose', e.target.value)}
                className="w-full px-3 py-2 bg-slate-900/60 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500/50 transition-all"
              >
                <option value="">Select purpose...</option>
                {Object.entries(STEP_PURPOSES).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Status</label>
              <button
                onClick={() => handleFieldChange('is_active', !editStep.is_active)}
                className={`w-full px-3 py-2 rounded-xl text-sm font-medium border transition-all ${
                  editStep.is_active
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-slate-700/50 border-slate-600 text-slate-400'
                }`}
              >
                {editStep.is_active ? 'Active' : 'Disabled'}
              </button>
            </div>
          </div>

          {/* Template Quick-Apply */}
          <div>
            <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Apply Template</label>
            <div className="flex flex-wrap gap-2">
              {STEP_TEMPLATES.map(t => {
                const tPurpose = t.purpose ? STEP_PURPOSES[t.purpose] : null;
                return (
                  <button
                    key={t.id}
                    onClick={() => applyTemplate(t.id)}
                    className="px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs transition-all border border-slate-600/50 flex items-center gap-1.5"
                  >
                    {tPurpose && (
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tPurpose.icon} />
                      </svg>
                    )}
                    {t.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subject Line */}
          <div>
            <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Subject Line</label>
            <input
              type="text"
              value={editStep.subject}
              onChange={(e) => handleFieldChange('subject', e.target.value)}
              placeholder="Enter email subject..."
              className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500/50 transition-all"
            />
          </div>

          {/* CTA URL & Label */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">CTA URL (optional)</label>
              <input
                type="url"
                value={editStep.cta_url || ''}
                onChange={(e) => handleFieldChange('cta_url', e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">CTA Button Label</label>
              <input
                type="text"
                value={editStep.cta_label || ''}
                onChange={(e) => handleFieldChange('cta_label', e.target.value)}
                placeholder="e.g., Download Now"
                className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500/50 transition-all"
              />
            </div>
          </div>

          {/* Editor / Preview Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Email Body</label>
            <button
              onClick={() => {
                syncEditor();
                setShowPreview(!showPreview);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                showPreview
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {showPreview ? 'Edit' : 'Preview'}
            </button>
          </div>

          {!showPreview ? (
            <div className="border border-slate-700/50 rounded-xl overflow-hidden">
              <div className="border-b border-slate-700/50 px-3 py-1.5 flex flex-wrap items-center gap-0.5 bg-slate-900/40">
                <button onClick={() => execCommand('bold')} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded transition-all" title="Bold">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/></svg>
                </button>
                <button onClick={() => execCommand('italic')} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded transition-all" title="Italic">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/></svg>
                </button>
                <button onClick={() => execCommand('underline')} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded transition-all" title="Underline">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"/></svg>
                </button>
                <div className="w-px h-4 bg-slate-700 mx-1" />
                <button onClick={() => execCommand('formatBlock', '<h2>')} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded transition-all text-[10px] font-bold" title="Heading">H2</button>
                <button onClick={() => execCommand('formatBlock', '<p>')} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded transition-all text-[10px]" title="Paragraph">P</button>
                <div className="w-px h-4 bg-slate-700 mx-1" />
                <button onClick={() => execCommand('insertUnorderedList')} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded transition-all" title="List">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/></svg>
                </button>
                <button onClick={() => execCommand('insertOrderedList')} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded transition-all" title="Numbered List">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"/></svg>
                </button>
                <button
                  onClick={() => {
                    const url = prompt('Enter URL:');
                    if (url) execCommand('createLink', url);
                  }}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded transition-all" title="Link"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                </button>
              </div>

              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onBlur={syncEditor}
                dangerouslySetInnerHTML={{ __html: editStep.html_body }}
                className="min-h-[200px] p-4 text-slate-200 text-sm focus:outline-none
                  [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-white [&_h2]:mb-2
                  [&_p]:text-slate-300 [&_p]:leading-relaxed [&_p]:mb-2
                  [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-slate-300
                  [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:text-slate-300
                  [&_a]:text-amber-400 [&_a]:underline
                  [&_strong]:text-white [&_strong]:font-bold"
              />
            </div>
          ) : (
            <div className="bg-slate-100 rounded-xl p-4">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden max-w-[520px] mx-auto">
                <div className="bg-slate-50 px-5 py-3 border-b border-slate-200">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-[10px]">PW</span>
                    </div>
                    <div>
                      <p className="text-slate-900 font-medium text-xs">{editStep.sender_name || 'Build Wealth Through Property'}</p>
                      <p className="text-slate-500 text-[10px]">{editStep.sender_email || 'noreply@Build Wealth Through Property.co.uk'}</p>
                    </div>
                  </div>
                  <p className="text-slate-900 font-semibold text-sm">{editStep.subject || '(No subject)'}</p>
                </div>
                <div
                  className="px-5 py-4 text-slate-700 text-xs leading-relaxed
                    [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mb-2
                    [&_p]:mb-2 [&_p]:text-slate-600
                    [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-2
                    [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-2
                    [&_a]:text-amber-600 [&_a]:underline
                    [&_strong]:text-slate-900"
                  dangerouslySetInnerHTML={{ __html: editStep.html_body || '<p style="color:#94a3b8;">Email content preview...</p>' }}
                />
              </div>
            </div>
          )}

          {/* Step Analytics */}
          {analytics.sent > 0 && (
            <div className="grid grid-cols-4 gap-3">
              <div className="bg-slate-900/40 rounded-xl p-3 text-center">
                <p className="text-white font-bold text-lg">{analytics.sent}</p>
                <p className="text-slate-500 text-[10px] uppercase">Sent</p>
              </div>
              <div className="bg-slate-900/40 rounded-xl p-3 text-center">
                <p className="text-emerald-400 font-bold text-lg">{analytics.opened}</p>
                <p className="text-slate-500 text-[10px] uppercase">Opened</p>
              </div>
              <div className="bg-slate-900/40 rounded-xl p-3 text-center">
                <p className="text-blue-400 font-bold text-lg">{analytics.clicked}</p>
                <p className="text-slate-500 text-[10px] uppercase">Clicked</p>
              </div>
              <div className="bg-slate-900/40 rounded-xl p-3 text-center">
                <p className="text-red-400 font-bold text-lg">{analytics.failed}</p>
                <p className="text-slate-500 text-[10px] uppercase">Failed</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2">
            <div>
              {showDeleteConfirm ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { onDelete(); setShowDeleteConfirm(false); }}
                    className="px-3 py-1.5 bg-red-500 hover:bg-red-400 text-white rounded-lg text-xs font-medium transition-all"
                  >
                    Confirm Delete
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-xs transition-all"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-1.5 text-slate-500 hover:text-red-400 text-xs transition-all"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete Step
                </button>
              )}
            </div>

            <button
              onClick={handleSave}
              disabled={isSaving || !editStep.subject.trim()}
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 rounded-xl text-sm font-bold transition-all"
            >
              {isSaving ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Step
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FunnelStepEditor;
