import React, { useState, useEffect, useCallback } from 'react';
import { adminInvoke } from '@/lib/adminApi';
import FunnelStepEditor, { type FunnelStep } from './FunnelStepEditor';
import {
  COURSE_FUNNEL_TEMPLATES,
  PURPOSE_COLORS,
  PURPOSE_LABELS,
  type CourseFunnelTemplate,
} from '@/data/courseFunnelTemplates';



interface Funnel {
  id: string;
  name: string;
  description: string;
  trigger_on: string;
  trigger_filter: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_processed_at: string | null;
  chain_to_funnel_id: string | null;
  step_count: number;
  enrollments: { active: number; completed: number; unsubscribed: number; total: number };
  sends: { sent: number; opened: number };
}


interface FunnelAnalytics {
  totalEnrolled: number;
  activeEnrolled: number;
  completedEnrolled: number;
  unsubscribedEnrolled: number;
  unsubscribeRate: string;
  totalSent: number;
  totalOpened: number;
  completionRate: string;
  openRate: string;
}

interface ProcessorRun {
  id: string;
  startedAt: string;
  completedAt: string | null;
  triggerType: string;
  triggeredBy: string;
  funnelsProcessed: number;
  totalEmailsSent: number;
  totalEmailsFailed: number;
  totalSkipped?: number;
  status: string;
  durationMs: number | null;
  funnelResults?: Array<{
    funnelName: string;
    processed: number;
    sent: number;
    failed: number;
    skipped: number;
    completed: number;
  }>;
}

interface ProcessorStatus {
  lastRun: ProcessorRun | null;
  recentRuns: ProcessorRun[];
  funnelTimestamps: Array<{ id: string; name: string; isActive: boolean; lastProcessedAt: string | null }>;
  pendingEmails: number;
  nextScheduledRun: string;
}

interface FunnelBuilderProps {
  onNotification: (message: string, type: 'success' | 'error') => void;
}

const RECIPIENT_FILTERS = [
  { value: 'all_active', label: 'All Active Subscribers' },
  { value: 'confirmed_only', label: 'Confirmed Only' },
  { value: 'recent_7d', label: 'Signed Up Last 7 Days' },
  { value: 'recent_30d', label: 'Signed Up Last 30 Days' },
  { value: 'source:starter-pack', label: 'Source: Starter Pack Download' },
  { value: 'source:free-chapter', label: 'Source: Free Chapter Download' },
  { value: 'source:calculator', label: 'Source: Calculator Tool' },
  { value: 'source:homepage', label: 'Source: Homepage' },
];

const TRIGGER_OPTIONS = [
  { value: 'signup', label: 'On Signup', desc: 'Auto-enroll when subscriber downloads the Starter Pack' },
  { value: 'funnel_completed', label: 'On Funnel Completion', desc: 'Auto-enroll when subscriber completes another funnel (chain)' },
  { value: 'manual', label: 'Manual', desc: 'Manually enroll subscribers into the funnel' },
];


function formatTimeAgo(dateStr: string | null): string {
  if (!dateStr) return 'Never';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return `${diffSecs}s ago`;
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ${diffMins % 60}m ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function formatTimestamp(dateStr: string | null): string {
  if (!dateStr) return 'Never';
  const date = new Date(dateStr);
  return date.toLocaleString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
}



const FunnelBuilder: React.FC<FunnelBuilderProps> = ({ onNotification }) => {
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [selectedFunnelId, setSelectedFunnelId] = useState<string | null>(null);
  const [funnels, setFunnels] = useState<Funnel[]>([]);
  const [funnelsLoading, setFunnelsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Course template selection for new funnel creation
  const defaultTemplate = COURSE_FUNNEL_TEMPLATES[0];
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(defaultTemplate.courseId);
  const selectedTemplate = COURSE_FUNNEL_TEMPLATES.find(t => t.courseId === selectedTemplateId) || defaultTemplate;

  const [newFunnelName, setNewFunnelName] = useState(defaultTemplate.funnelName);
  const [newFunnelDesc, setNewFunnelDesc] = useState(defaultTemplate.funnelDescription);
  const [newFunnelTrigger, setNewFunnelTrigger] = useState(defaultTemplate.funnelTrigger);
  const [newFunnelFilter, setNewFunnelFilter] = useState(defaultTemplate.funnelFilter);

  const [creating, setCreating] = useState(false);
  const [scaffoldSteps, setScaffoldSteps] = useState(true);
  const [selectedFunnel, setSelectedFunnel] = useState<Funnel | null>(null);

  const [steps, setSteps] = useState<FunnelStep[]>([]);
  const [stepsLoading, setStepsLoading] = useState(false);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [savingStep, setSavingStep] = useState<number | null>(null);
  const [analytics, setAnalytics] = useState<FunnelAnalytics | null>(null);
  const [showEnrollDialog, setShowEnrollDialog] = useState(false);
  const [enrollFilter, setEnrollFilter] = useState('source:free-chapter');
  const [enrolling, setEnrolling] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [deletingFunnelId, setDeletingFunnelId] = useState<string | null>(null);

  // Processor status state
  const [processingAll, setProcessingAll] = useState(false);
  const [processorStatus, setProcessorStatus] = useState<ProcessorStatus | null>(null);
  const [showProcessorPanel, setShowProcessorPanel] = useState(false);

  // ============ DATA FETCHING ============
  const fetchFunnels = useCallback(async () => {
    setFunnelsLoading(true);
    try {
      const data = await adminInvoke('email-funnel', { action: 'list-funnels' });
      if (data?.success) {
        setFunnels((data.funnels as Funnel[]) || []);
      }
    } catch (err) {
      console.error('Fetch funnels error:', err);
    } finally {
      setFunnelsLoading(false);
    }
  }, []);

  const fetchSteps = useCallback(async (funnelId: string) => {
    setStepsLoading(true);
    try {
      const data = await adminInvoke('email-funnel', { action: 'get-steps', funnelId });
      if (data?.success) {
        setSteps((data.steps as FunnelStep[]) || []);
      }
    } catch (err) {
      console.error('Fetch steps error:', err);
    } finally {
      setStepsLoading(false);
    }
  }, []);

  const fetchAnalytics = useCallback(async (funnelId: string) => {
    try {
      const data = await adminInvoke('email-funnel', { action: 'funnel-analytics', funnelId });
      if (data?.success) {
        setAnalytics(data.overview as FunnelAnalytics);
        // Update selectedFunnel with latest data from analytics response
        if (data.funnel) {
          setSelectedFunnel(prev => prev ? { ...prev, last_processed_at: data.funnel.last_processed_at } : prev);
        }
      }
    } catch (err) {
      console.error('Fetch analytics error:', err);
    }
  }, []);

  const fetchProcessorStatus = useCallback(async () => {
    try {
      const data = await adminInvoke('email-funnel', { action: 'get-processor-status' });
      if (data?.success) {
        setProcessorStatus(data as ProcessorStatus);
      }
    } catch (err) {
      console.error('Fetch processor status error:', err);
    }
  }, []);

  useEffect(() => { fetchFunnels(); fetchProcessorStatus(); }, [fetchFunnels, fetchProcessorStatus]);

  useEffect(() => {
    if (selectedFunnelId && view === 'detail') {
      fetchSteps(selectedFunnelId);
      fetchAnalytics(selectedFunnelId);
    }
  }, [selectedFunnelId, view, fetchSteps, fetchAnalytics]);

  // ============ ACTIONS ============
  const handleProcessAllFunnels = async () => {
    setProcessingAll(true);
    try {
      const data = await adminInvoke('process-all-funnels', { triggerType: 'force_all' });
      if (data?.success) {
        const sent = data.totalEmailsSent || 0;
        const failed = data.totalEmailsFailed || 0;
        const funnelCount = data.funnelsProcessed || 0;
        if (sent > 0) {
          onNotification(`All funnels processed! ${funnelCount} funnels, ${sent} emails sent${failed > 0 ? `, ${failed} failed` : ''}.`, 'success');
        } else {
          onNotification(`All ${funnelCount} funnels checked. No emails due to send right now.`, 'success');
        }
        fetchFunnels();
        fetchProcessorStatus();
        if (selectedFunnelId) {
          fetchSteps(selectedFunnelId);
          fetchAnalytics(selectedFunnelId);
        }
      } else {
        onNotification(data?.error || 'Failed to process funnels.', 'error');
      }
    } catch (err) {
      onNotification('Failed to process all funnels.', 'error');
    } finally {
      setProcessingAll(false);
    }
  };

  const handleCreateFunnel = async () => {
    if (!newFunnelName.trim()) {
      onNotification('Please enter a funnel name.', 'error');
      return;
    }
    setCreating(true);
    try {
      const data = await adminInvoke('email-funnel', {
        action: 'create-funnel',
        name: newFunnelName.trim(),
        description: newFunnelDesc.trim(),
        trigger_on: newFunnelTrigger,
        trigger_filter: newFunnelFilter,
      });
      if (data?.success) {
        onNotification('Funnel created successfully!', 'success');
        const funnel = data.funnel as { id: string } | undefined;
        if (scaffoldSteps && funnel?.id) {
          for (const stepDef of selectedTemplate.emails) {
            await adminInvoke('email-funnel', {
              action: 'save-step',
              funnelId: funnel.id,
              step_number: stepDef.step_number,
              subject: stepDef.subject,
              html_body: stepDef.html_body,
              delay_days: stepDef.delay_days,
              delay_hours: stepDef.delay_hours,
              step_purpose: stepDef.step_purpose || '',
              cta_url: stepDef.cta_url || '',
              cta_label: stepDef.cta_label || '',
              sender_name: stepDef.sender_name || 'Chris Ifonlaja',
              sender_email: stepDef.sender_email || 'noreply@buildwealththroughproperty.com',
            });
          }
        }
        setShowCreateDialog(false);
        setNewFunnelName(defaultTemplate.funnelName);
        setNewFunnelDesc(defaultTemplate.funnelDescription);
        setNewFunnelTrigger(defaultTemplate.funnelTrigger);
        setNewFunnelFilter(defaultTemplate.funnelFilter);
        setScaffoldSteps(true);


        fetchFunnels();
        if (funnel?.id) {
          setSelectedFunnelId(funnel.id);
          setSelectedFunnel(data.funnel as Funnel);
          setView('detail');
        }
      } else {
        onNotification((data?.error as string) || 'Failed to create funnel.', 'error');
      }
    } catch (err) {
      onNotification(err instanceof Error ? err.message : 'Failed to create funnel.', 'error');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteFunnel = async (funnelId: string) => {
    try {
      const data = await adminInvoke('email-funnel', { action: 'delete-funnel', funnelId });
      if (data?.success) {
        onNotification('Funnel deleted.', 'success');
        fetchFunnels();
        if (selectedFunnelId === funnelId) {
          setView('list');
          setSelectedFunnelId(null);
        }
      } else {
        onNotification((data?.error as string) || 'Failed to delete funnel.', 'error');
      }
    } catch (err) {
      onNotification(err instanceof Error ? err.message : 'Failed to delete funnel.', 'error');
    }
    setDeletingFunnelId(null);
  };

  const handleToggleFunnel = async (funnel: Funnel) => {
    try {
      const data = await adminInvoke('email-funnel', { action: 'update-funnel', funnelId: funnel.id, is_active: !funnel.is_active });
      if (data?.success) {
        onNotification(`Funnel ${!funnel.is_active ? 'activated' : 'paused'}.`, 'success');
        fetchFunnels();
        if (selectedFunnel?.id === funnel.id) {
          setSelectedFunnel({ ...selectedFunnel, is_active: !funnel.is_active });
        }
      }
    } catch (err) {
      onNotification(err instanceof Error ? err.message : 'Failed to update funnel.', 'error');
    }
  };

  const handleSaveStep = async (step: FunnelStep) => {
    setSavingStep(step.step_number);
    try {
      const data = await adminInvoke('email-funnel', {
        action: 'save-step',
          funnelId: selectedFunnelId,
          stepId: step.id || undefined,
          step_number: step.step_number,
          subject: step.subject,
          html_body: step.html_body,
          plain_text: '',
          delay_days: step.delay_days,
          delay_hours: step.delay_hours,
          is_active: step.is_active,
          sender_name: step.sender_name,
          sender_email: step.sender_email,
          step_purpose: step.step_purpose || '',
          cta_url: step.cta_url || '',
          cta_label: step.cta_label || '',
      });
      if (data?.success) {
        onNotification(`Step ${step.step_number} saved.`, 'success');
        fetchSteps(selectedFunnelId!);
      } else {
        onNotification((data?.error as string) || 'Failed to save step.', 'error');
      }
    } catch (err) {
      onNotification(err instanceof Error ? err.message : 'Failed to save step.', 'error');
    } finally {
      setSavingStep(null);
    }
  };

  const handleDeleteStep = async (stepId: string, stepNum: number) => {
    try {
      const data = await adminInvoke('email-funnel', { action: 'delete-step', stepId });
      if (data?.success) {
        onNotification(`Step ${stepNum} deleted.`, 'success');
        fetchSteps(selectedFunnelId!);
      } else {
        onNotification((data?.error as string) || 'Failed to delete step.', 'error');
      }
    } catch (err) {
      onNotification(err instanceof Error ? err.message : 'Failed to delete step.', 'error');
    }
  };

  const handleAddStep = async () => {
    const nextNum = steps.length > 0 ? Math.max(...steps.map(s => s.step_number)) + 1 : 1;
    const prevStep = steps[steps.length - 1];
    const defaultDelay = prevStep ? Math.max(prevStep.delay_days, 1) : 0;
    try {
      const data = await adminInvoke('email-funnel', {
        action: 'save-step',
        funnelId: selectedFunnelId,
        step_number: nextNum,
        subject: `Step ${nextNum}`,
        html_body: '',
        delay_days: defaultDelay,
        delay_hours: 0,
      });
      if (data?.success) {
        onNotification(`Step ${nextNum} added.`, 'success');
        fetchSteps(selectedFunnelId!);
        setExpandedStep(nextNum);
      }
    } catch (err) {
      onNotification(err instanceof Error ? err.message : 'Failed to add step.', 'error');
    }
  };

  const handleEnrollSubscribers = async () => {
    setEnrolling(true);
    try {
      const data = await adminInvoke('email-funnel', {
        action: 'enroll-subscribers',
        funnelId: selectedFunnelId,
        recipientFilter: enrollFilter,
      });
      if (data?.success) {
        const msg = data.enrolled > 0
          ? `Enrolled ${data.enrolled} new subscribers (${data.alreadyEnrolled || 0} already enrolled).`
          : data.message || 'No new subscribers to enroll.';
        onNotification(msg, (data.enrolled as number) > 0 ? 'success' : 'error');
        setShowEnrollDialog(false);
        fetchAnalytics(selectedFunnelId!);
      } else {
        onNotification((data?.error as string) || 'Failed to enroll subscribers.', 'error');
      }
    } catch (err) {
      onNotification(err instanceof Error ? err.message : 'Failed to enroll subscribers.', 'error');
    } finally {
      setEnrolling(false);
    }
  };

  const handleProcessFunnel = async () => {
    setProcessing(true);
    try {
      const data = await adminInvoke('email-funnel', { action: 'process-funnel', funnelId: selectedFunnelId });
      if (data?.success) {
        if (data.sentCount > 0) {
          onNotification(`Processed: ${data.sentCount} emails sent, ${data.failedCount || 0} failed.`, 'success');
        } else {
          onNotification(data.message || 'No emails due to send right now.', 'success');
        }
        fetchSteps(selectedFunnelId!);
        fetchAnalytics(selectedFunnelId!);
        fetchProcessorStatus();
      } else {
        onNotification((data?.error as string) || 'Failed to process funnel.', 'error');
      }
    } catch (err) {
      onNotification(err instanceof Error ? err.message : 'Failed to process funnel.', 'error');
    } finally {
    }
  };

  const handleSetChain = async (sourceFunnelId: string, targetFunnelId: string | null) => {
    try {
      const data = await adminInvoke('email-funnel', { action: 'update-funnel', funnelId: sourceFunnelId, chain_to_funnel_id: targetFunnelId });
      if (data?.success) {
        onNotification(targetFunnelId ? 'Funnel chain configured!' : 'Funnel chain removed.', 'success');
        fetchFunnels();
        if (selectedFunnel?.id === sourceFunnelId) {
          setSelectedFunnel({ ...selectedFunnel, chain_to_funnel_id: targetFunnelId });
        }
      } else {
        onNotification((data?.error as string) || 'Failed to update chain.', 'error');
      }
    } catch (err) {
      onNotification(err instanceof Error ? err.message : 'Failed to update chain.', 'error');
    }
  };

  const openFunnel = (funnel: Funnel) => {
    setSelectedFunnelId(funnel.id);
    setSelectedFunnel(funnel);
    setView('detail');
    setExpandedStep(null);
  };

  // ============ RENDER: FUNNEL LIST ============
  if (view === 'list') {
    return (
      <div className="space-y-6">
        {/* Pipeline Overview — Both Courses */}


        <div className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 border border-slate-700/50 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Book Reader Conversion Pipelines</h2>
              <p className="text-slate-400 text-sm">Two funnels — one per course — converting readers into students</p>
            </div>
          </div>

          <div className="space-y-6">
            {COURSE_FUNNEL_TEMPLATES.map((template) => (
              <div key={template.courseId} className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${template.color} flex items-center justify-center`}>
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={template.icon} />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{template.courseName}</p>
                    <p className="text-slate-500 text-[10px]">{template.coursePrice} launch · {template.courseFullPrice} full price · Save {template.courseDiscount}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 pl-2">
                  {template.pipelineStages.map((stage, i) => (
                    <React.Fragment key={i}>
                      <div className="flex flex-col items-center min-w-[90px] flex-1">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stage.color} flex items-center justify-center mb-1.5 shadow-lg`}>
                          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stage.icon} />
                          </svg>
                        </div>
                        <p className="text-white font-semibold text-[11px] text-center">{stage.label}</p>
                        <p className="text-slate-500 text-[9px] text-center">{stage.sublabel}</p>
                      </div>
                      {i < template.pipelineStages.length - 1 && (
                        <div className="flex items-center flex-shrink-0 mt-[-20px]">
                          <div className="w-6 h-0.5 bg-gradient-to-r from-slate-600 to-slate-500" />
                          <svg className="w-2.5 h-2.5 text-slate-500 -ml-0.5" fill="currentColor" viewBox="0 0 6 10">
                            <path d="M1 1l4 4-4 4" />
                          </svg>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>


        {/* ═══════════════════════════════════════════════════════════ */}
        {/* CRON PROCESSOR STATUS BANNER                              */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden">
          <button
            onClick={() => { setShowProcessorPanel(!showProcessorPanel); if (!showProcessorPanel) fetchProcessorStatus(); }}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-800/80 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center">
                <svg className="w-4.5 h-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-semibold text-sm">Automated Processor</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                    Hourly Cron
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-slate-500 text-xs">
                    Last run: <span className="text-slate-300">{processorStatus?.lastRun ? formatTimeAgo(processorStatus.lastRun.startedAt) : 'Never'}</span>
                  </span>
                  {processorStatus?.lastRun && (
                    <>
                      <span className="text-slate-700">|</span>
                      <span className="text-slate-500 text-xs">
                        Sent: <span className="text-emerald-400">{processorStatus.lastRun.totalEmailsSent}</span>
                      </span>
                      {processorStatus.pendingEmails > 0 && (
                        <>
                          <span className="text-slate-700">|</span>
                          <span className="text-amber-400 text-xs font-medium">
                            {processorStatus.pendingEmails} pending
                          </span>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <svg className={`w-4 h-4 text-slate-500 transition-transform ${showProcessorPanel ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          {showProcessorPanel && processorStatus && (
            <div className="border-t border-slate-700/50 px-6 py-5 space-y-4">
              {/* Status Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-900/40 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-white">{processorStatus.pendingEmails}</p>
                  <p className="text-slate-500 text-[10px] uppercase">Pending Emails</p>
                </div>
                <div className="bg-slate-900/40 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-emerald-400">{processorStatus.lastRun?.totalEmailsSent ?? 0}</p>
                  <p className="text-slate-500 text-[10px] uppercase">Last Run Sent</p>
                </div>
                <div className="bg-slate-900/40 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-slate-300">{processorStatus.lastRun?.funnelsProcessed ?? 0}</p>
                  <p className="text-slate-500 text-[10px] uppercase">Funnels Checked</p>
                </div>
                <div className="bg-slate-900/40 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-cyan-400">{processorStatus.lastRun?.durationMs ? `${processorStatus.lastRun.durationMs}ms` : '-'}</p>
                  <p className="text-slate-500 text-[10px] uppercase">Duration</p>
                </div>
              </div>

              {/* Recent Runs Table */}
              {processorStatus.recentRuns.length > 0 && (
                <div>
                  <h4 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Recent Processor Runs</h4>
                  <div className="bg-slate-900/30 rounded-xl border border-slate-700/30 overflow-hidden">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-slate-700/30">
                          <th className="text-left text-slate-500 font-medium px-3 py-2">Time</th>
                          <th className="text-left text-slate-500 font-medium px-3 py-2">Trigger</th>
                          <th className="text-center text-slate-500 font-medium px-3 py-2">Funnels</th>
                          <th className="text-center text-slate-500 font-medium px-3 py-2">Sent</th>
                          <th className="text-center text-slate-500 font-medium px-3 py-2">Failed</th>
                          <th className="text-center text-slate-500 font-medium px-3 py-2">Status</th>
                          <th className="text-right text-slate-500 font-medium px-3 py-2">Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        {processorStatus.recentRuns.map((run, i) => (
                          <tr key={run.id} className={`border-b border-slate-700/20 ${i === 0 ? 'bg-slate-800/30' : ''}`}>
                            <td className="px-3 py-2 text-slate-300">{formatTimeAgo(run.startedAt)}</td>
                            <td className="px-3 py-2">
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                                run.triggerType === 'cron' ? 'bg-teal-500/10 text-teal-400' :
                                run.triggerType === 'force_all' ? 'bg-purple-500/10 text-purple-400' :
                                'bg-blue-500/10 text-blue-400'
                              }`}>
                                {run.triggerType === 'force_all' ? 'Manual' : run.triggerType === 'cron' ? 'Cron' : 'Manual'}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-center text-slate-400">{run.funnelsProcessed}</td>
                            <td className="px-3 py-2 text-center text-emerald-400 font-medium">{run.totalEmailsSent}</td>
                            <td className="px-3 py-2 text-center">
                              <span className={run.totalEmailsFailed > 0 ? 'text-red-400 font-medium' : 'text-slate-600'}>{run.totalEmailsFailed}</span>
                            </td>
                            <td className="px-3 py-2 text-center">
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                                run.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                                run.status === 'running' ? 'bg-amber-500/10 text-amber-400' :
                                'bg-red-500/10 text-red-400'
                              }`}>
                                {run.status}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-right text-slate-500">{run.durationMs ? `${run.durationMs}ms` : '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Funnel Last Processed Timestamps */}
              {processorStatus.funnelTimestamps.length > 0 && (
                <div>
                  <h4 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Funnel Processing Timestamps</h4>
                  <div className="space-y-1.5">
                    {processorStatus.funnelTimestamps.map(ft => (
                      <div key={ft.id} className="flex items-center justify-between px-3 py-2 bg-slate-900/30 rounded-lg border border-slate-700/20">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${ft.isActive ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                          <span className="text-slate-300 text-xs font-medium">{ft.name}</span>
                        </div>
                        <span className="text-slate-500 text-xs">
                          {ft.lastProcessedAt ? formatTimeAgo(ft.lastProcessedAt) : 'Never processed'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cron Setup Info */}
              <div className="bg-slate-900/30 rounded-xl border border-slate-700/20 p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-xs text-slate-500 leading-relaxed">
                    <p className="text-slate-400 font-medium mb-1">Cron Setup</p>
                    <p>The <code className="px-1 py-0.5 bg-slate-800 rounded text-teal-400">process-all-funnels</code> edge function runs automatically every hour via cron. It processes all active funnels, sends due emails, and records run history.</p>
                    <p className="mt-1">Next scheduled run: <span className="text-slate-300">{formatTimestamp(processorStatus.nextScheduledRun)}</span></p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>


        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Email Funnels
            </h2>
            <p className="text-slate-400 text-sm mt-1">Automated email sequences that nurture book readers into course buyers</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Force Process All Button */}
            <button
              onClick={handleProcessAllFunnels}
              disabled={processingAll}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-500/20"
            >
              {processingAll ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Processing...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Force Process All
                </>
              )}
            </button>
            <button
              onClick={() => setShowCreateDialog(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-purple-500/20"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Funnel
            </button>
          </div>
        </div>

        {/* Funnel Cards */}
        {funnelsLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[1, 2].map(i => (
              <div key={i} className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 animate-pulse">
                <div className="h-5 w-48 bg-slate-700 rounded mb-3" />
                <div className="h-3 w-32 bg-slate-700/50 rounded mb-6" />
                <div className="flex gap-4">
                  <div className="h-8 w-20 bg-slate-700/50 rounded" />
                  <div className="h-8 w-20 bg-slate-700/50 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : funnels.length === 0 ? (
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-12 text-center">
            <div className="w-20 h-20 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-white text-xl font-bold mb-2">Create Your Book-to-Course Funnel</h3>
            <p className="text-slate-400 text-sm mb-3 max-w-lg mx-auto">
              Set up a 10-email automated sequence that captures readers through the free chapter, educates them about property investing, and converts them into buyers of the Property Investor Masterclass.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {['Deliver Lead Magnet', 'Educate', 'Build Trust', 'Introduce Course', 'Convert to Sale'].map((phase, i) => (
                <span key={i} className="px-3 py-1 bg-slate-700/50 text-slate-300 rounded-full text-xs border border-slate-600/50">
                  {i > 0 && <span className="text-slate-600 mr-1">→</span>}
                  {phase}
                </span>
              ))}
            </div>
            <button
              onClick={() => setShowCreateDialog(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-purple-500/20"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Book-to-Course Funnel
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {funnels.map(funnel => {
              const isAutoEnroll = funnel.trigger_on === 'signup' && funnel.is_active;
              return (
              <div
                key={funnel.id}
                className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 hover:border-purple-500/30 transition-all group cursor-pointer"
                onClick={() => openFunnel(funnel)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="text-white font-semibold truncate group-hover:text-purple-300 transition-colors">{funnel.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                        funnel.is_active
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : 'bg-slate-700 border-slate-600 text-slate-400'
                      }`}>
                        {funnel.is_active ? 'Active' : 'Paused'}
                      </span>
                      {isAutoEnroll && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border bg-cyan-500/10 border-cyan-500/30 text-cyan-400 flex items-center gap-1">
                          <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Auto-Enroll
                        </span>
                      )}
                    </div>
                    {funnel.description && (
                      <p className="text-slate-500 text-xs truncate">{funnel.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 ml-3" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => handleToggleFunnel(funnel)}
                      className={`p-2 rounded-lg transition-all ${
                        funnel.is_active
                          ? 'text-emerald-400 hover:bg-emerald-500/10'
                          : 'text-slate-500 hover:bg-slate-700/50 hover:text-white'
                      }`}
                      title={funnel.is_active ? 'Pause funnel' : 'Activate funnel'}
                    >
                      {funnel.is_active ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      )}
                    </button>
                    {deletingFunnelId === funnel.id ? (
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleDeleteFunnel(funnel.id)} className="p-1.5 bg-red-500 hover:bg-red-400 text-white rounded-lg text-[10px] font-bold">Yes</button>
                        <button onClick={() => setDeletingFunnelId(null)} className="p-1.5 bg-slate-700 text-slate-300 rounded-lg text-[10px]">No</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeletingFunnelId(funnel.id)}
                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                        title="Delete funnel"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    )}
                  </div>
                </div>

                {/* Auto-enrollment status bar */}
                {funnel.trigger_on === 'signup' && (
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-4 text-xs ${
                    isAutoEnroll
                      ? 'bg-cyan-500/5 border border-cyan-500/20 text-cyan-400'
                      : 'bg-slate-700/30 border border-slate-700/50 text-slate-500'
                  }`}>
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {isAutoEnroll ? (
                      <span>New /start signups are <strong>automatically enrolled</strong> in this funnel</span>
                    ) : (
                      <span>Auto-enrollment paused — activate funnel to resume</span>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-5 gap-3">
                  <div className="text-center">
                    <p className="text-purple-400 font-bold text-lg">{funnel.step_count}</p>
                    <p className="text-slate-600 text-[10px] uppercase">Steps</p>
                  </div>
                  <div className="text-center">
                    <p className="text-amber-400 font-bold text-lg">{funnel.enrollments.total}</p>
                    <p className="text-slate-600 text-[10px] uppercase">Enrolled</p>
                  </div>
                  <div className="text-center">
                    <p className="text-emerald-400 font-bold text-lg">{funnel.enrollments.active}</p>
                    <p className="text-slate-600 text-[10px] uppercase">Active</p>
                  </div>
                  <div className="text-center">
                    <p className="text-blue-400 font-bold text-lg">{funnel.sends.sent}</p>
                    <p className="text-slate-600 text-[10px] uppercase">Sent</p>
                  </div>
                  <div className="text-center">
                    <p className={`font-bold text-lg ${funnel.enrollments.unsubscribed > 0 ? 'text-red-400' : 'text-slate-600'}`}>{funnel.enrollments.unsubscribed}</p>
                    <p className="text-slate-600 text-[10px] uppercase">Unsubs</p>
                  </div>
                </div>

                {/* Last processed timestamp */}
                <div className="mt-3 pt-3 border-t border-slate-700/30 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {Array.from({ length: Math.min(funnel.step_count, 10) }).map((_, i) => (
                      <div key={i} className="flex-1 h-1.5 rounded-full bg-purple-500/30" style={{ width: '16px' }}>
                        <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-purple-400" style={{ width: '100%' }} />
                      </div>
                    ))}
                    {funnel.step_count === 0 && (
                      <p className="text-slate-600 text-xs">No steps configured</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 flex-shrink-0 ml-3">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {funnel.last_processed_at ? formatTimeAgo(funnel.last_processed_at) : 'Never processed'}
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        )}


        {/* Create Funnel Dialog */}
        {showCreateDialog && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-lg w-full p-8 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">Create Conversion Funnel</h3>
                <p className="text-slate-400 text-sm">Book lead magnet → Email nurture → Course conversion</p>
              </div>
              <div className="space-y-4">
                {/* Course Template Selector */}
                <div>
                  <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Select Course</label>
                  <div className="grid grid-cols-2 gap-2">
                    {COURSE_FUNNEL_TEMPLATES.map(tmpl => (
                      <button
                        key={tmpl.courseId}
                        onClick={() => {
                          setSelectedTemplateId(tmpl.courseId);
                          setNewFunnelName(tmpl.funnelName);
                          setNewFunnelDesc(tmpl.funnelDescription);
                          setNewFunnelTrigger(tmpl.funnelTrigger);
                          setNewFunnelFilter(tmpl.funnelFilter);
                        }}
                        className={`p-3 rounded-xl text-left border transition-all ${
                          selectedTemplateId === tmpl.courseId
                            ? 'bg-purple-500/10 border-purple-500/30 text-purple-300'
                            : 'border-slate-700 text-slate-400 hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${tmpl.color} flex items-center justify-center`}>
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tmpl.icon} />
                            </svg>
                          </div>
                          <p className="font-medium text-sm">{tmpl.courseName}</p>
                        </div>
                        <p className="text-[10px] mt-0.5 opacity-70">{tmpl.coursePrice} launch price</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Funnel Name</label>
                  <input
                    type="text"
                    value={newFunnelName}
                    onChange={(e) => setNewFunnelName(e.target.value)}
                    placeholder="e.g., Book-to-Course Conversion Funnel"
                    autoFocus
                    className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Description</label>
                  <input
                    type="text"
                    value={newFunnelDesc}
                    onChange={(e) => setNewFunnelDesc(e.target.value)}
                    placeholder="Brief description of this funnel's purpose"
                    className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Trigger</label>
                  <div className="grid grid-cols-2 gap-2">
                    {TRIGGER_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setNewFunnelTrigger(opt.value)}
                        className={`p-3 rounded-xl text-left border transition-all ${
                          newFunnelTrigger === opt.value
                            ? 'bg-purple-500/10 border-purple-500/30 text-purple-300'
                            : 'border-slate-700 text-slate-400 hover:border-slate-600'
                        }`}
                      >
                        <p className="font-medium text-sm">{opt.label}</p>
                        <p className="text-[10px] mt-0.5 opacity-70">{opt.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Target Audience</label>
                  <select
                    value={newFunnelFilter}
                    onChange={(e) => setNewFunnelFilter(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500/50 transition-all"
                  >
                    {RECIPIENT_FILTERS.map(f => (
                      <option key={f.value} value={f.value}>{f.label}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-900/40 rounded-xl border border-slate-700/50">
                  <button
                    onClick={() => setScaffoldSteps(!scaffoldSteps)}
                    className={`w-5 h-5 rounded flex items-center justify-center border transition-all flex-shrink-0 ${
                      scaffoldSteps
                        ? 'bg-purple-500 border-purple-500'
                        : 'border-slate-600 bg-slate-800'
                    }`}
                  >
                    {scaffoldSteps && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <div>
                    <p className="text-white text-sm font-medium">Pre-fill {selectedTemplate.emails.length}-step conversion sequence</p>
                    <p className="text-slate-500 text-xs">Deliver → Educate → Social Proof → Engage → Sell {selectedTemplate.courseName}</p>
                  </div>
                </div>

                {scaffoldSteps && (
                  <div className="bg-slate-900/30 rounded-xl border border-slate-700/30 p-4">
                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Funnel Sequence Preview — {selectedTemplate.courseName}</p>
                    <div className="space-y-1.5">
                      {selectedTemplate.emails.map((s, i) => {
                        const purposeColor = s.step_purpose ? PURPOSE_COLORS[s.step_purpose] || 'from-slate-500 to-slate-600' : 'from-slate-500 to-slate-600';
                        const purposeLabel = s.step_purpose ? PURPOSE_LABELS[s.step_purpose] || '' : '';
                        return (
                          <div key={i} className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${purposeColor} flex items-center justify-center flex-shrink-0`}>
                              <span className="text-white text-[9px] font-bold">{s.step_number}</span>
                            </div>
                            <span className="text-slate-300 text-xs truncate flex-1">{s.subject}</span>
                            <span className="text-slate-600 text-[10px] flex-shrink-0">Day {s.delay_days}</span>
                            {purposeLabel && (
                              <span className="text-slate-500 text-[9px] uppercase font-medium flex-shrink-0 hidden sm:inline">{purposeLabel}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 mt-6">

                <button
                  onClick={() => setShowCreateDialog(false)}
                  className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateFunnel}
                  disabled={creating || !newFunnelName.trim()}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition-all"
                >
                  {creating ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                      Creating...
                    </>
                  ) : 'Create Funnel'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ============ RENDER: FUNNEL DETAIL ============
  const totalDays = steps.reduce((sum, s) => sum + s.delay_days, 0);

  return (
    <div className="space-y-6">
      {/* Back + Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setView('list'); setSelectedFunnelId(null); fetchFunnels(); }}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-xl transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">{selectedFunnel?.name || 'Funnel'}</h2>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                selectedFunnel?.is_active
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-slate-700 border-slate-600 text-slate-400'
              }`}>
                {selectedFunnel?.is_active ? 'Active' : 'Paused'}
              </span>
            </div>
            <p className="text-slate-500 text-xs mt-0.5">
              {steps.length} steps · ~{totalDays} days · {RECIPIENT_FILTERS.find(f => f.value === selectedFunnel?.trigger_filter)?.label || 'All'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => selectedFunnel && handleToggleFunnel(selectedFunnel)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
              selectedFunnel?.is_active
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
            }`}
          >
            {selectedFunnel?.is_active ? (
              <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>Pause</>
            ) : (
              <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>Activate</>
            )}
          </button>
          <button
            onClick={() => setShowEnrollDialog(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-300 hover:text-white text-sm font-medium transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
            Enroll
          </button>
          <button
            onClick={handleProcessFunnel}
            disabled={processing || !selectedFunnel?.is_active}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition-all"
          >
            {processing ? (
              <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Processing...</>
            ) : (
              <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>Process Now</>
            )}
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* LAST PROCESSED TIMESTAMP BANNER                            */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <div className="bg-slate-800/40 border border-slate-700/30 rounded-xl px-5 py-3 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-slate-400 text-sm">Last Processed:</span>
          </div>
          {selectedFunnel?.last_processed_at ? (
            <div className="flex items-center gap-2">
              <span className="text-white text-sm font-medium">{formatTimeAgo(selectedFunnel.last_processed_at)}</span>
              <span className="text-slate-600 text-xs">({formatTimestamp(selectedFunnel.last_processed_at)})</span>
            </div>
          ) : (
            <span className="text-slate-500 text-sm">Never processed</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {processorStatus?.lastRun && (
            <div className="flex items-center gap-1.5 text-xs">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-500">Cron active</span>
              <span className="text-slate-700">·</span>
              <span className="text-slate-500">Next: <span className="text-slate-400">{formatTimeAgo(processorStatus.nextScheduledRun).replace(' ago', '')}</span></span>
            </div>
          )}
          <button
            onClick={handleProcessAllFunnels}
            disabled={processingAll}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-500/10 border border-teal-500/20 text-teal-400 hover:bg-teal-500/20 rounded-lg text-xs font-medium transition-all disabled:opacity-50"
          >
            {processingAll ? (
              <><svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Processing...</>
            ) : (
              <><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>Force Process All</>
            )}
          </button>
        </div>
      </div>


      {/* Auto-Enrollment Status Banner */}
      {selectedFunnel?.trigger_on === 'signup' && (
        <div className={`rounded-2xl p-5 border ${
          selectedFunnel.is_active
            ? 'bg-gradient-to-r from-cyan-500/5 to-emerald-500/5 border-cyan-500/20'
            : 'bg-slate-800/40 border-slate-700/50'
        }`}>
          <div className="flex items-start gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
              selectedFunnel.is_active
                ? 'bg-cyan-500/15'
                : 'bg-slate-700/50'
            }`}>
              <svg className={`w-5 h-5 ${selectedFunnel.is_active ? 'text-cyan-400' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className={`font-semibold text-sm ${selectedFunnel.is_active ? 'text-cyan-300' : 'text-slate-400'}`}>
                  Automatic Enrollment
                </h4>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  selectedFunnel.is_active
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                    : 'bg-slate-700 text-slate-500 border border-slate-600'
                }`}>
                  {selectedFunnel.is_active ? 'Live' : 'Paused'}
                </span>
              </div>
              {selectedFunnel.is_active ? (
                <p className="text-slate-400 text-xs leading-relaxed">
                  Every new subscriber from <span className="text-white font-medium">/start</span> is automatically enrolled in this funnel.
                  They'll receive Email 1 (Welcome + Starter Pack) immediately when the processor runs, then follow the full 22-day sequence.
                </p>
              ) : (
                <p className="text-slate-500 text-xs leading-relaxed">
                  Auto-enrollment is paused. Activate this funnel to automatically enroll new /start subscribers.
                  Existing enrollments will continue to be processed.
                </p>
              )}
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5 text-xs">
                  <div className={`w-2 h-2 rounded-full ${selectedFunnel.is_active ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600'}`} />
                  <span className={selectedFunnel.is_active ? 'text-cyan-400' : 'text-slate-600'}>
                    {selectedFunnel.is_active ? 'Listening for new signups' : 'Not listening'}
                  </span>
                </div>
                <span className="text-slate-700 text-xs">|</span>
                <span className="text-slate-500 text-xs">
                  Trigger: <span className="text-slate-400">{RECIPIENT_FILTERS.find(f => f.value === selectedFunnel.trigger_filter)?.label || 'All Active'}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* FUNNEL CHAINING CONFIGURATION                              */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <div className={`rounded-2xl p-5 border ${
        selectedFunnel?.chain_to_funnel_id
          ? 'bg-gradient-to-r from-fuchsia-500/5 to-purple-500/5 border-fuchsia-500/20'
          : 'bg-slate-800/40 border-slate-700/50'
      }`}>
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
            selectedFunnel?.chain_to_funnel_id ? 'bg-fuchsia-500/15' : 'bg-slate-700/50'
          }`}>
            <svg className={`w-5 h-5 ${selectedFunnel?.chain_to_funnel_id ? 'text-fuchsia-400' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className={`font-semibold text-sm ${selectedFunnel?.chain_to_funnel_id ? 'text-fuchsia-300' : 'text-slate-400'}`}>
                Funnel Chaining
              </h4>
              {selectedFunnel?.chain_to_funnel_id && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-fuchsia-500/15 text-fuchsia-400 border border-fuchsia-500/30">
                  Chained
                </span>
              )}
            </div>
            <p className="text-slate-500 text-xs leading-relaxed mb-3">
              When subscribers complete this funnel, automatically enroll them into another funnel. Use this to create multi-stage conversion paths (e.g., BTL course completers → Masterclass upsell).
            </p>
            <div className="flex items-center gap-3">
              <select
                value={selectedFunnel?.chain_to_funnel_id || ''}
                onChange={(e) => {
                  if (selectedFunnel) {
                    handleSetChain(selectedFunnel.id, e.target.value || null);
                  }
                }}
                className="flex-1 px-3 py-2 bg-slate-900/60 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-fuchsia-500/50 transition-all"
              >
                <option value="">No chain (completions end here)</option>
                {funnels
                  .filter(f => f.id !== selectedFunnel?.id)
                  .map(f => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.step_count} steps, {f.is_active ? 'Active' : 'Paused'})
                    </option>
                  ))
                }
              </select>
              {selectedFunnel?.chain_to_funnel_id && (
                <button
                  onClick={() => selectedFunnel && handleSetChain(selectedFunnel.id, null)}
                  className="px-3 py-2 text-red-400 hover:bg-red-500/10 border border-red-500/20 rounded-xl text-xs font-medium transition-all"
                >
                  Remove
                </button>
              )}
            </div>
            {selectedFunnel?.chain_to_funnel_id && (() => {
              const chainTarget = funnels.find(f => f.id === selectedFunnel.chain_to_funnel_id);
              return chainTarget ? (
                <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-fuchsia-500/5 border border-fuchsia-500/15 rounded-lg">
                  <svg className="w-3.5 h-3.5 text-fuchsia-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span className="text-fuchsia-300 text-xs">
                    Completions auto-enroll into <strong>{chainTarget.name}</strong>
                    {!chainTarget.is_active && <span className="text-amber-400 ml-1">(currently paused)</span>}
                  </span>
                </div>
              ) : (
                <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-amber-500/5 border border-amber-500/15 rounded-lg">
                  <svg className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span className="text-amber-400 text-xs">Chain target funnel not found — it may have been deleted</span>
                </div>
              );
            })()}
          </div>
        </div>
      </div>


      {/* Analytics Overview */}
      {analytics && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-white">{analytics.totalEnrolled}</p>
              <p className="text-slate-500 text-[10px] uppercase mt-1">Enrolled</p>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-emerald-400">{analytics.activeEnrolled}</p>
              <p className="text-slate-500 text-[10px] uppercase mt-1">In Funnel</p>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-blue-400">{analytics.completedEnrolled}</p>
              <p className="text-slate-500 text-[10px] uppercase mt-1">Completed</p>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-amber-400">{analytics.totalSent}</p>
              <p className="text-slate-500 text-[10px] uppercase mt-1">Emails Sent</p>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-purple-400">{analytics.totalOpened}</p>
              <p className="text-slate-500 text-[10px] uppercase mt-1">Opened</p>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-cyan-400">{analytics.openRate}%</p>
              <p className="text-slate-500 text-[10px] uppercase mt-1">Open Rate</p>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-rose-400">{analytics.completionRate}%</p>
              <p className="text-slate-500 text-[10px] uppercase mt-1">Completion</p>
            </div>
            {/* Unsubscribe Count Card */}
            <div className={`border rounded-xl p-4 text-center ${
              analytics.unsubscribedEnrolled > 0
                ? 'bg-red-500/5 border-red-500/20'
                : 'bg-slate-800/60 border-slate-700/50'
            }`}>
              <div className="flex items-center justify-center gap-1.5">
                <p className={`text-2xl font-bold ${analytics.unsubscribedEnrolled > 0 ? 'text-red-400' : 'text-slate-600'}`}>
                  {analytics.unsubscribedEnrolled}
                </p>
                {analytics.unsubscribedEnrolled > 0 && (
                  <svg className="w-4 h-4 text-red-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  </svg>
                )}
              </div>
              <p className="text-slate-500 text-[10px] uppercase mt-1">Unsubscribed</p>
              {analytics.unsubscribeRate !== '0.0' && (
                <p className="text-red-400/70 text-[9px] mt-0.5">{analytics.unsubscribeRate}% rate</p>
              )}
            </div>
          </div>
        </div>
      )}


      {/* Visual Conversion Timeline */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Conversion Timeline
          </h3>
          <span className="text-slate-500 text-xs">{steps.length} steps over ~{totalDays} days</span>
        </div>

        <div className="relative overflow-x-auto pb-2">
          <div className="flex items-center gap-0 min-w-max">
            {steps.map((step, i) => {
              const cumDays = steps.slice(0, i + 1).reduce((s, st) => s + st.delay_days, 0);
              const purposeColor = step.step_purpose ? PURPOSE_COLORS[step.step_purpose] || 'from-slate-500 to-slate-600' : 'from-slate-500 to-slate-600';
              const purposeLabel = step.step_purpose ? PURPOSE_LABELS[step.step_purpose] || '' : '';
              return (
                <div key={step.id || i} className="flex items-center">
                  <button
                    onClick={() => setExpandedStep(expandedStep === step.step_number ? null : step.step_number)}
                    className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all min-w-[80px] ${
                      expandedStep === step.step_number
                        ? 'bg-purple-500/10 border border-purple-500/30'
                        : 'hover:bg-slate-700/30'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                      step.is_active
                        ? `bg-gradient-to-br ${purposeColor} text-white`
                        : 'bg-slate-700 text-slate-400'
                    }`}>
                      {step.step_number}
                    </div>
                    <span className="text-slate-400 text-[10px] whitespace-nowrap">Day {cumDays}</span>
                    {purposeLabel && (
                      <span className="text-slate-600 text-[8px] uppercase font-medium">{purposeLabel}</span>
                    )}
                  </button>
                  {i < steps.length - 1 && (
                    <div className="flex items-center px-1">
                      <div className="w-6 h-0.5 bg-slate-700" />
                      <svg className="w-2 h-2 text-slate-600 -ml-0.5" fill="currentColor" viewBox="0 0 6 10">
                        <path d="M1 1l4 4-4 4" />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Steps Editor */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold">Email Steps</h3>
          <button
            onClick={handleAddStep}
            className="flex items-center gap-1.5 px-3 py-1.5 text-purple-400 hover:bg-purple-500/10 rounded-lg text-xs font-medium transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Step
          </button>
        </div>

        {stepsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-700 rounded-xl" />
                  <div className="flex-1">
                    <div className="h-4 w-48 bg-slate-700 rounded mb-2" />
                    <div className="h-3 w-24 bg-slate-700/50 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : steps.length === 0 ? (
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-8 text-center">
            <p className="text-slate-400 mb-3">No steps yet. Add your first email step.</p>
            <button
              onClick={handleAddStep}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded-xl text-sm font-medium transition-all hover:bg-purple-500/20"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add First Step
            </button>
          </div>
        ) : (
          steps.map(step => (
            <FunnelStepEditor
              key={step.id || step.step_number}
              step={step}
              totalSteps={steps.length}
              isExpanded={expandedStep === step.step_number}
              isSaving={savingStep === step.step_number}
              onToggleExpand={() => setExpandedStep(expandedStep === step.step_number ? null : step.step_number)}
              onSave={handleSaveStep}
              onDelete={() => step.id && handleDeleteStep(step.id, step.step_number)}
            />
          ))
        )}
      </div>

      {/* Enroll Dialog */}
      {showEnrollDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-md w-full p-8 animate-in fade-in zoom-in-95">
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Enroll Subscribers</h3>
              <p className="text-slate-400 text-sm">Add book readers to the conversion funnel</p>
            </div>

            <div className="space-y-3 mb-6">
              <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider">Select Audience</label>
              {RECIPIENT_FILTERS.map(f => (
                <button
                  key={f.value}
                  onClick={() => setEnrollFilter(f.value)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all border ${
                    enrollFilter === f.value
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'border-slate-700 text-slate-400 hover:border-slate-600 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 mb-6">
              <p className="text-amber-400 text-xs">Already enrolled subscribers will be skipped automatically.</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowEnrollDialog(false)}
                className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleEnrollSubscribers}
                disabled={enrolling}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition-all"
              >
                {enrolling ? (
                  <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Enrolling...</>
                ) : 'Enroll Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FunnelBuilder;
