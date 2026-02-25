import React, { useState, useRef, useCallback, useEffect } from 'react';
import { adminInvoke } from '@/lib/adminApi';
import { getCampaignRecipients } from '@/lib/adminFirestore';

interface CampaignComposerProps {
  onSendComplete: () => void;
  onNotification: (message: string, type: 'success' | 'error') => void;
  /** Pre-filled emails when "Send to selected" from Subscribers */
  initialSelectedEmails?: string[];
}

const EMAIL_TEMPLATES = [
  {
    id: 'blank',
    name: 'Blank Email',
    subject: '',
    html: '',
  },
  {
    id: 'new-chapter',
    name: 'New Chapter Announcement',
    subject: 'New Chapter Available: {{chapter_title}}',
    html: `<h2 style="color:#1e293b;font-size:24px;margin-bottom:16px;">A New Chapter Is Here</h2>
<p style="color:#475569;font-size:16px;line-height:1.6;">Hi there,</p>
<p style="color:#475569;font-size:16px;line-height:1.6;">We've just published a brand new chapter in <strong>The Property Wealth Blueprint</strong>. This chapter covers essential strategies that could transform your property investment journey.</p>
<h3 style="color:#1e293b;font-size:18px;margin-top:24px;">What you'll learn:</h3>
<ul style="color:#475569;font-size:16px;line-height:1.8;">
<li>Key market indicators to watch in 2026</li>
<li>How to identify undervalued properties</li>
<li>Tax-efficient investment structures</li>
</ul>
<p style="margin-top:24px;"><a href="https://Build Wealth Through Property.co.uk" style="display:inline-block;background:#f59e0b;color:#1e293b;font-weight:bold;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:16px;">Read Now</a></p>
<p style="color:#94a3b8;font-size:14px;margin-top:32px;">Happy investing,<br/>The Build Wealth Through Property Team</p>`,
  },
  {
    id: 'market-update',
    name: 'Market Update',
    subject: 'UK Property Market Update - {{month}} 2026',
    html: `<h2 style="color:#1e293b;font-size:24px;margin-bottom:16px;">Monthly Market Update</h2>
<p style="color:#475569;font-size:16px;line-height:1.6;">Here's your monthly snapshot of the UK property market.</p>
<table style="width:100%;border-collapse:collapse;margin:24px 0;">
<tr style="background:#f8fafc;">
<td style="padding:12px 16px;border:1px solid #e2e8f0;font-weight:bold;color:#1e293b;">Average House Price</td>
<td style="padding:12px 16px;border:1px solid #e2e8f0;color:#475569;">£295,000</td>
</tr>
<tr>
<td style="padding:12px 16px;border:1px solid #e2e8f0;font-weight:bold;color:#1e293b;">Monthly Change</td>
<td style="padding:12px 16px;border:1px solid #e2e8f0;color:#16a34a;">+0.8%</td>
</tr>
<tr style="background:#f8fafc;">
<td style="padding:12px 16px;border:1px solid #e2e8f0;font-weight:bold;color:#1e293b;">Annual Change</td>
<td style="padding:12px 16px;border:1px solid #e2e8f0;color:#16a34a;">+4.2%</td>
</tr>
<tr>
<td style="padding:12px 16px;border:1px solid #e2e8f0;font-weight:bold;color:#1e293b;">Base Rate</td>
<td style="padding:12px 16px;border:1px solid #e2e8f0;color:#475569;">4.25%</td>
</tr>
</table>
<p style="color:#475569;font-size:16px;line-height:1.6;">Use our <a href="https://Build Wealth Through Property.co.uk/calculator" style="color:#f59e0b;font-weight:bold;">Investment Calculator</a> to see how these numbers affect your returns.</p>
<p style="color:#94a3b8;font-size:14px;margin-top:32px;">Best regards,<br/>The Build Wealth Through Property Team</p>`,
  },
  {
    id: 'welcome',
    name: 'Welcome Series',
    subject: 'Welcome to Build Wealth Through Property - Your Journey Starts Here',
    html: `<h2 style="color:#1e293b;font-size:24px;margin-bottom:16px;">Welcome to Build Wealth Through Property!</h2>
<p style="color:#475569;font-size:16px;line-height:1.6;">Thank you for joining our community of property investors. You've taken the first step towards building lasting wealth through property.</p>
<h3 style="color:#1e293b;font-size:18px;margin-top:24px;">Here's what to do next:</h3>
<ol style="color:#475569;font-size:16px;line-height:2;">
<li><strong>Read your free chapter</strong> - Check your inbox for the download link</li>
<li><strong>Try our calculator</strong> - Model your first investment scenario</li>
<li><strong>Join the community</strong> - Connect with fellow investors</li>
</ol>
<p style="margin-top:24px;"><a href="https://Build Wealth Through Property.co.uk/calculator" style="display:inline-block;background:#f59e0b;color:#1e293b;font-weight:bold;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:16px;">Try the Calculator</a></p>
<p style="color:#94a3b8;font-size:14px;margin-top:32px;">Welcome aboard,<br/>The Build Wealth Through Property Team</p>`,
  },
];

type RecipientMode = 'filter' | 'course' | 'selected' | 'individual';

const RECIPIENT_FILTERS = [
  { value: 'all_active', label: 'All Audiences (Subscribers + Customers + Users)', icon: 'users' },
  { value: 'confirmed_only', label: 'Confirmed Subscribers Only', icon: 'check' },
  { value: 'recent_7d', label: 'Signed Up Last 7 Days', icon: 'clock' },
  { value: 'recent_30d', label: 'Signed Up Last 30 Days', icon: 'calendar' },
  { value: 'source:free-chapter', label: 'Source: Free Chapter', icon: 'book' },
  { value: 'source:starter-pack', label: 'Source: Starter Pack', icon: 'gift' },
  { value: 'source:calculator', label: 'Source: Calculator', icon: 'calc' },
  { value: 'source:homepage', label: 'Source: Homepage', icon: 'home' },
];

const COURSE_FILTERS = [
  { value: 'course_enrolled:beginner-course', label: 'Enrolled in Beginner Course', icon: 'course' },
  { value: 'course_enrolled:masterclass', label: 'Enrolled in Masterclass', icon: 'course' },
];

const parseEmails = (text: string): string[] => {
  return text
    .split(/[\s,;\n]+/)
    .map((e) => e.trim().toLowerCase())
    .filter((e) => e && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
};

const CampaignComposer: React.FC<CampaignComposerProps> = ({ onSendComplete, onNotification, initialSelectedEmails }) => {
  const [subject, setSubject] = useState('');
  const [htmlBody, setHtmlBody] = useState('');
  const [recipientMode, setRecipientMode] = useState<RecipientMode>(initialSelectedEmails?.length ? 'selected' : 'filter');
  const [recipientFilter, setRecipientFilter] = useState('all_active');
  const [courseFilter, setCourseFilter] = useState('course_enrolled:beginner-course');
  const [individualEmail, setIndividualEmail] = useState('');
  const [selectedEmailsText, setSelectedEmailsText] = useState(initialSelectedEmails?.join('\n') || '');
  const [senderName, setSenderName] = useState('Build Wealth Through Property');
  const [senderEmail, setSenderEmail] = useState('noreply@buildwealththroughproperty.com');
  const [previewMode, setPreviewMode] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [sending, setSending] = useState(false);
  const [recipientCount, setRecipientCount] = useState<number | null>(null);
  const [recipientEmails, setRecipientEmails] = useState<string[]>([]);
  const [showRecipientList, setShowRecipientList] = useState(false);
  const [countLoading, setCountLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('blank');
  const [showSettings, setShowSettings] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  // Sync initialSelectedEmails into selectedEmailsText when provided
  useEffect(() => {
    if (initialSelectedEmails?.length) {
      setSelectedEmailsText(initialSelectedEmails.join('\n'));
      setRecipientMode('selected');
    }
  }, [initialSelectedEmails?.join(',')]);

  // Fetch recipients from Firestore (all collections, deduped)
  useEffect(() => {
    const fetchRecipients = async () => {
      setCountLoading(true);
      try {
        if (recipientMode === 'individual') {
          const e = individualEmail.trim().toLowerCase();
          if (e && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
            setRecipientCount(1);
            setRecipientEmails([e]);
          } else {
            setRecipientCount(0);
            setRecipientEmails([]);
          }
        } else if (recipientMode === 'selected') {
          const emails = parseEmails(selectedEmailsText);
          setRecipientCount(emails.length);
          setRecipientEmails(emails);
        } else {
          const { emails } = await getCampaignRecipients({
            recipientFilter: recipientMode === 'course' ? courseFilter : recipientFilter,
            courseId: recipientMode === 'course' ? courseFilter.replace('course_enrolled:', '').trim() : undefined,
          });
          setRecipientCount(emails.length);
          setRecipientEmails(emails);
        }
      } catch (err) {
        console.error('Recipient fetch error:', err);
        setRecipientCount(0);
        setRecipientEmails([]);
      } finally {
        setCountLoading(false);
      }
    };
    fetchRecipients();
  }, [recipientMode, recipientFilter, courseFilter, individualEmail, selectedEmailsText]);

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = EMAIL_TEMPLATES.find((t) => t.id === templateId);
    if (template) {
      setSubject(template.subject);
      setHtmlBody(template.html);
    }
  };

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  }, []);

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      execCommand('insertImage', url);
    }
  };

  const getEditorHtml = () => {
    return editorRef.current?.innerHTML || '';
  };

  const getCurrentHtml = () => {
    if (editorRef.current && !previewMode) {
      return editorRef.current.innerHTML;
    }
    return htmlBody;
  };

  const syncEditorToState = () => {
    if (editorRef.current) {
      setHtmlBody(editorRef.current.innerHTML);
    }
  };

  const getRecipientLabel = () => {
    if (recipientMode === 'individual') return individualEmail.trim() || 'Single email';
    if (recipientMode === 'selected') return `${parseEmails(selectedEmailsText).length} selected`;
    if (recipientMode === 'course') return COURSE_FILTERS.find((f) => f.value === courseFilter)?.label || courseFilter;
    return RECIPIENT_FILTERS.find((f) => f.value === recipientFilter)?.label || recipientFilter;
  };

  const handleSend = async () => {
    const currentHtml = getCurrentHtml();
    if (!subject.trim()) {
      onNotification('Please enter a subject line.', 'error');
      return;
    }
    if (!currentHtml.trim()) {
      onNotification('Please compose your email content.', 'error');
      return;
    }
    if (recipientMode === 'individual' && !individualEmail.trim()) {
      onNotification('Please enter a recipient email.', 'error');
      return;
    }
    if (recipientMode === 'selected') {
      const emails = parseEmails(selectedEmailsText);
      if (emails.length === 0) {
        onNotification('Please enter at least one valid email.', 'error');
        return;
      }
    }
    if ((recipientMode === 'filter' || recipientMode === 'course') && (recipientCount === 0 || recipientCount == null)) {
      onNotification('No recipients match your selection.', 'error');
      return;
    }
    setShowConfirmDialog(true);
  };

  const confirmSend = async () => {
    setSending(true);
    setShowConfirmDialog(false);
    const currentHtml = getCurrentHtml();

    const sendParams: Record<string, unknown> = {
      action: 'send',
      subject: subject.trim(),
      htmlBody: wrapInEmailTemplate(currentHtml),
      plainText: stripHtml(currentHtml),
      senderEmail,
      senderName,
      selectedEmails: recipientEmails,
    };

    try {
      const data = await adminInvoke('send-campaign', sendParams);

      if (data?.success) {
        const msg = data.failedCount > 0
          ? `Campaign sent to ${data.sentCount} of ${data.recipientCount} recipients (${data.failedCount} failed)`
          : `Campaign sent successfully to ${data.sentCount} recipients!`;
        onNotification(msg, data.failedCount > 0 ? 'error' : 'success');
        // Reset form
        setSubject('');
        setHtmlBody('');
        setSelectedTemplate('blank');
        if (editorRef.current) editorRef.current.innerHTML = '';
        onSendComplete();
      } else {
        onNotification(data?.error || 'Failed to send campaign.', 'error');
      }
    } catch (err: any) {
      console.error('Send error:', err);
      onNotification('Failed to send campaign. Please try again.', 'error');
    } finally {
      setSending(false);
    }
  };

  const wrapInEmailTemplate = (content: string) => {
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:40px 20px;">
<div style="background:#ffffff;border-radius:12px;padding:40px;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
<div style="text-align:center;margin-bottom:32px;padding-bottom:24px;border-bottom:1px solid #e2e8f0;">
<h1 style="color:#f59e0b;font-size:24px;margin:0;">Build Wealth Through Property</h1>
</div>
${content}
</div>
<div style="text-align:center;padding:24px;color:#94a3b8;font-size:12px;">
<p>You're receiving this because you subscribed to Build Wealth Through Property updates.</p>
<p><a href="#" style="color:#94a3b8;">Unsubscribe</a> | <a href="https://Build Wealth Through Property.co.uk" style="color:#94a3b8;">Visit Website</a></p>
</div>
</div>
</body>
</html>`;
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Compose Campaign
            </h2>
            <p className="text-slate-400 text-sm mt-1">Create and send email campaigns to your subscribers</p>
          </div>
          {/* Recipient count badge - prominent display */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
            {countLoading ? (
              <div className="w-5 h-5 rounded bg-slate-700 animate-pulse" />
            ) : (
              <span className="text-2xl font-bold text-emerald-400">{recipientCount?.toLocaleString() ?? '—'}</span>
            )}
            <span className="text-emerald-400/80 text-sm font-medium">recipients</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${
              showSettings
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </button>
          <button
            onClick={() => {
              syncEditorToState();
              setPreviewMode(!previewMode);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${
              previewMode
                ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {previewMode ? 'Edit' : 'Preview'}
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 animate-in fade-in slide-in-from-top-2">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Sender Settings
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 text-sm mb-2 font-medium">Sender Name</label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10 transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-2 font-medium">Sender Email</label>
              <input
                type="email"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10 transition-all text-sm"
              />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Template & Recipients */}
        <div className="lg:col-span-1 space-y-4">
          {/* Template Selector */}
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
            <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
              Templates
            </h3>
            <div className="space-y-2">
              {EMAIL_TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateChange(template.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all ${
                    selectedTemplate === template.id
                      ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/50 border border-transparent'
                  }`}
                >
                  {template.name}
                </button>
              ))}
            </div>
          </div>

          {/* Recipients - Unified: Filter / Course / Selected / Individual */}
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
            <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Recipients
            </h3>

            {/* Mode tabs */}
            <div className="grid grid-cols-2 gap-1.5 mb-4">
              {(['filter', 'course', 'selected', 'individual'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setRecipientMode(mode)}
                  className={`px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                    recipientMode === mode
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                      : 'text-slate-500 hover:text-white hover:bg-slate-700/50 border border-transparent'
                  }`}
                >
                  {mode === 'filter' && 'Audience'}
                  {mode === 'course' && 'Course'}
                  {mode === 'selected' && 'Selected'}
                  {mode === 'individual' && 'Single'}
                </button>
              ))}
            </div>

            {recipientMode === 'filter' && (
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {RECIPIENT_FILTERS.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setRecipientFilter(filter.value)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all ${
                      recipientFilter === filter.value
                        ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                        : 'text-slate-400 hover:text-white hover:bg-slate-700/50 border border-transparent'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            )}

            {recipientMode === 'course' && (
              <div className="space-y-1.5">
                {COURSE_FILTERS.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setCourseFilter(filter.value)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all ${
                      courseFilter === filter.value
                        ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                        : 'text-slate-400 hover:text-white hover:bg-slate-700/50 border border-transparent'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            )}

            {recipientMode === 'selected' && (
              <textarea
                value={selectedEmailsText}
                onChange={(e) => setSelectedEmailsText(e.target.value)}
                placeholder="Paste emails (comma, space, or newline separated)"
                rows={4}
                className="w-full px-3 py-2 bg-slate-900/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500/50 resize-none"
              />
            )}

            {recipientMode === 'individual' && (
              <input
                type="email"
                value={individualEmail}
                onChange={(e) => setIndividualEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full px-3 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500/50"
              />
            )}

            <div className="mt-4 pt-4 border-t border-slate-700/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-xs">Recipients</span>
                {countLoading ? (
                  <div className="w-8 h-4 bg-slate-700 rounded animate-pulse" />
                ) : (
                  <span className="text-amber-400 font-bold text-lg">{recipientCount?.toLocaleString() ?? '—'}</span>
                )}
              </div>
              {recipientEmails.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowRecipientList(!showRecipientList)}
                  className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-slate-900/60 hover:bg-slate-800/80 text-slate-400 hover:text-emerald-400 text-xs font-medium transition-all"
                >
                  <span>{showRecipientList ? 'Hide' : 'View'} email addresses</span>
                  <svg className={`w-4 h-4 transition-transform ${showRecipientList ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}
              {showRecipientList && recipientEmails.length > 0 && (
                <div className="max-h-48 overflow-y-auto rounded-lg bg-slate-900/80 border border-slate-700/50 p-2 space-y-1">
                  {recipientEmails.slice(0, 100).map((email, i) => (
                    <div key={i} className="text-xs text-slate-300 font-mono truncate px-2 py-1 hover:bg-slate-800/50 rounded" title={email}>
                      {email}
                    </div>
                  ))}
                  {recipientEmails.length > 100 && (
                    <p className="text-slate-500 text-xs px-2 py-1">... and {recipientEmails.length - 100} more</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="lg:col-span-3 space-y-4">
          {/* Subject Line */}
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
            <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Subject Line</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter your email subject line..."
              className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10 transition-all text-base"
            />
            <p className="text-slate-600 text-xs mt-2">{subject.length}/150 characters</p>
          </div>

          {/* Editor / Preview */}
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden">
            {!previewMode ? (
              <>
                {/* Toolbar */}
                <div className="border-b border-slate-700/50 px-4 py-2 flex flex-wrap items-center gap-1">
                  <div className="flex items-center gap-0.5 border-r border-slate-700/50 pr-2 mr-1">
                    <button onClick={() => execCommand('bold')} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all" title="Bold">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/></svg>
                    </button>
                    <button onClick={() => execCommand('italic')} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all" title="Italic">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/></svg>
                    </button>
                    <button onClick={() => execCommand('underline')} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all" title="Underline">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"/></svg>
                    </button>
                    <button onClick={() => execCommand('strikeThrough')} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all" title="Strikethrough">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M10 19h4v-3h-4v3zM5 4v3h5v3h4V7h5V4H5zM3 14h18v-2H3v2z"/></svg>
                    </button>
                  </div>

                  <div className="flex items-center gap-0.5 border-r border-slate-700/50 pr-2 mr-1">
                    <button onClick={() => execCommand('formatBlock', '<h2>')} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all text-xs font-bold" title="Heading">
                      H2
                    </button>
                    <button onClick={() => execCommand('formatBlock', '<h3>')} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all text-xs font-bold" title="Subheading">
                      H3
                    </button>
                    <button onClick={() => execCommand('formatBlock', '<p>')} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all text-xs" title="Paragraph">
                      P
                    </button>
                  </div>

                  <div className="flex items-center gap-0.5 border-r border-slate-700/50 pr-2 mr-1">
                    <button onClick={() => execCommand('insertUnorderedList')} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all" title="Bullet List">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/></svg>
                    </button>
                    <button onClick={() => execCommand('insertOrderedList')} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all" title="Numbered List">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"/></svg>
                    </button>
                  </div>

                  <div className="flex items-center gap-0.5 border-r border-slate-700/50 pr-2 mr-1">
                    <button onClick={() => execCommand('justifyLeft')} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all" title="Align Left">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z"/></svg>
                    </button>
                    <button onClick={() => execCommand('justifyCenter')} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all" title="Align Center">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M7 15v2h10v-2H7zm-4 6h18v-2H3v2zm0-8h18v-2H3v2zm4-6v2h10V7H7zM3 3v2h18V3H3z"/></svg>
                    </button>
                  </div>

                  <div className="flex items-center gap-0.5">
                    <button onClick={insertLink} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all" title="Insert Link">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                    </button>
                    <button onClick={insertImage} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all" title="Insert Image">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </button>
                    <button onClick={() => execCommand('removeFormat')} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all" title="Clear Formatting">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>

                  {/* Source toggle */}
                  <div className="ml-auto">
                    <span className="text-slate-600 text-xs">Visual Editor</span>
                  </div>
                </div>

                {/* Content Editable Area */}
                <div
                  ref={editorRef}
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={syncEditorToState}
                  dangerouslySetInnerHTML={{ __html: htmlBody }}
                  className="min-h-[400px] p-6 text-slate-200 focus:outline-none prose prose-invert prose-sm max-w-none
                    [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mb-3
                    [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-white [&_h3]:mb-2
                    [&_p]:text-slate-300 [&_p]:leading-relaxed [&_p]:mb-3
                    [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:text-slate-300
                    [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:text-slate-300
                    [&_li]:mb-1
                    [&_a]:text-amber-400 [&_a]:underline
                    [&_strong]:text-white [&_strong]:font-bold
                    [&_em]:italic
                    [&_img]:max-w-full [&_img]:rounded-lg [&_img]:my-4
                    [&_table]:w-full [&_table]:border-collapse
                    [&_td]:p-2 [&_td]:border [&_td]:border-slate-600
                    [&_th]:p-2 [&_th]:border [&_th]:border-slate-600 [&_th]:bg-slate-700/50"
                  style={{ minHeight: '400px' }}
                />
              </>
            ) : (
              /* Preview Mode */
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-700/50">
                  <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span className="text-blue-400 font-medium text-sm">Email Preview</span>
                </div>

                {/* Email Preview Container */}
                <div className="bg-slate-100 rounded-xl p-6 max-w-[640px] mx-auto">
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {/* Email Header */}
                    <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">PW</span>
                        </div>
                        <div>
                          <p className="text-slate-900 font-medium text-sm">{senderName || 'Build Wealth Through Property'}</p>
                          <p className="text-slate-500 text-xs">{senderEmail || 'noreply@buildwealththroughproperty.com'}</p>
                        </div>
                      </div>
                      <p className="text-slate-900 font-semibold">{subject || '(No subject)'}</p>
                    </div>

                    {/* Email Body */}
                    <div
                      className="px-6 py-6 text-slate-700 text-sm leading-relaxed
                        [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mb-3
                        [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-slate-900 [&_h3]:mb-2
                        [&_p]:mb-3 [&_p]:text-slate-600
                        [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-3
                        [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-3
                        [&_li]:mb-1 [&_li]:text-slate-600
                        [&_a]:text-amber-600 [&_a]:underline
                        [&_strong]:text-slate-900 [&_strong]:font-bold
                        [&_img]:max-w-full [&_img]:rounded-lg [&_img]:my-4
                        [&_table]:w-full [&_table]:border-collapse [&_table]:my-4
                        [&_td]:p-3 [&_td]:border [&_td]:border-slate-200
                        [&_tr:nth-child(even)]:bg-slate-50"
                      dangerouslySetInnerHTML={{ __html: htmlBody || '<p style="color:#94a3b8;">Your email content will appear here...</p>' }}
                    />

                    {/* Email Footer */}
                    <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 text-center">
                      <p className="text-slate-400 text-xs">You're receiving this because you subscribed to Build Wealth Through Property updates.</p>
                      <p className="text-slate-400 text-xs mt-1">
                        <span className="underline cursor-pointer">Unsubscribe</span> | <span className="underline cursor-pointer">Visit Website</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Bar */}
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${recipientCount && recipientCount > 0 ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                <span className="text-slate-400">
                  {countLoading ? 'Counting...' : `${recipientCount?.toLocaleString() ?? 0} recipients`}
                </span>
              </div>
              <span className="text-slate-700">|</span>
              <span className="text-slate-500 text-sm truncate max-w-[200px]">
                {getRecipientLabel()}
              </span>
              {recipientEmails.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowRecipientList(!showRecipientList)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-xs font-medium"
                >
                  {showRecipientList ? 'Hide' : 'Show'} emails
                  <svg className={`w-3.5 h-3.5 ${showRecipientList ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setSubject('');
                  setHtmlBody('');
                  setSelectedTemplate('blank');
                  if (editorRef.current) editorRef.current.innerHTML = '';
                }}
                className="px-4 py-2.5 text-slate-400 hover:text-white text-sm transition-all"
              >
                Clear
              </button>
              <button
                onClick={() => {
                  syncEditorToState();
                  if (!previewMode) setPreviewMode(true);
                }}
                className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm font-medium transition-all"
              >
                Preview
              </button>
              <button
                onClick={() => {
                  syncEditorToState();
                  handleSend();
                }}
                disabled={sending || !subject.trim()}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 rounded-xl text-sm font-bold transition-all shadow-lg shadow-amber-500/20"
              >
                {sending ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Send Campaign
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Recipient list panel - expandable below action bar */}
          {showRecipientList && recipientEmails.length > 0 && (
            <div className="bg-slate-800/60 border border-emerald-500/30 rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-700/50 flex items-center justify-between">
                <h4 className="text-emerald-400 font-semibold text-sm">Sending to these {recipientEmails.length} addresses</h4>
                <button type="button" onClick={() => setShowRecipientList(false)} className="text-slate-500 hover:text-white">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 font-mono text-xs text-slate-300">
                {recipientEmails.map((email, i) => (
                  <div key={i} className="truncate px-2 py-1 rounded bg-slate-900/40" title={email}>{email}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Send Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-lg w-full p-8 animate-in fade-in zoom-in-95">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Confirm Send Campaign</h3>
              <p className="text-slate-400 text-sm">Please review the details before sending.</p>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-start justify-between py-3 border-b border-slate-700/50">
                <span className="text-slate-500 text-sm">Subject</span>
                <span className="text-white text-sm font-medium text-right max-w-[300px] truncate">{subject}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-700/50">
                <span className="text-slate-500 text-sm">Recipients</span>
                <span className="text-amber-400 font-bold">{recipientCount?.toLocaleString() ?? 0}</span>
              </div>
              <div className="py-3 border-b border-slate-700/50">
                <span className="text-slate-500 text-sm block mb-2">Sending to:</span>
                <div className="max-h-32 overflow-y-auto rounded-lg bg-slate-900/60 p-2 font-mono text-xs text-slate-300 space-y-0.5">
                  {recipientEmails.slice(0, 20).map((e, i) => (
                    <div key={i} className="truncate" title={e}>{e}</div>
                  ))}
                  {recipientEmails.length > 20 && (
                    <div className="text-slate-500 pt-1">+ {recipientEmails.length - 20} more</div>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-slate-500 text-sm">From</span>
                <span className="text-white text-sm">{senderName} &lt;{senderEmail}&gt;</span>
              </div>
            </div>

            <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <p className="text-amber-400 text-sm font-medium">This action cannot be undone</p>
                  <p className="text-slate-400 text-xs mt-1">Emails will be sent immediately to all matching recipients.</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmSend}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 rounded-xl text-sm font-bold transition-all shadow-lg shadow-amber-500/20"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Send Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignComposer;
