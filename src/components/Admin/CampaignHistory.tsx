import React, { useState, useEffect, useCallback } from 'react';
import { adminInvoke } from '@/lib/adminApi';

interface Campaign {
  id: string;
  subject: string;
  html_body: string;
  plain_text: string;
  recipient_filter: string;
  recipient_count: number;
  sent_count: number;
  failed_count: number;
  open_count: number;
  click_count: number;
  status: string;
  created_at: string;
  sent_at: string;
  completed_at: string;
  error_message: string | null;
  sender_email: string;
  sender_name: string;
}

interface CampaignHistoryProps {
  refreshTrigger: number;
  onNotification: (message: string, type: 'success' | 'error') => void;
}

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
  draft: { bg: 'bg-slate-500/10 border-slate-500/20', text: 'text-slate-400', label: 'Draft' },
  sending: { bg: 'bg-blue-500/10 border-blue-500/20', text: 'text-blue-400', label: 'Sending' },
  sent: { bg: 'bg-emerald-500/10 border-emerald-500/20', text: 'text-emerald-400', label: 'Sent' },
  failed: { bg: 'bg-red-500/10 border-red-500/20', text: 'text-red-400', label: 'Failed' },
  partial: { bg: 'bg-amber-500/10 border-amber-500/20', text: 'text-amber-400', label: 'Partial' },
};

const filterLabels: Record<string, string> = {
  all_active: 'All Audiences',
  confirmed_only: 'Confirmed Only',
  recent_7d: 'Last 7 Days',
  recent_30d: 'Last 30 Days',
  'source:free-chapter': 'Free Chapter',
  'source:starter-pack': 'Starter Pack',
  'source:calculator': 'Calculator',
  'source:homepage': 'Homepage',
  individual: 'Single recipient',
  selected: 'Selected subscribers',
  'course_enrolled:beginner-course': 'Beginner Course',
  'course_enrolled:masterclass': 'Masterclass',
};

const CampaignHistory: React.FC<CampaignHistoryProps> = ({ refreshTrigger, onNotification }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const perPage = 10;

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminInvoke('send-campaign', { action: 'list', page, perPage });
      if (data?.success) {
        setCampaigns((data.campaigns as Campaign[]) || []);
        setTotal((data.total as number) || 0);
        setTotalPages((data.totalPages as number) || 1);
      }
    } catch (err) {
      console.error('Fetch campaigns error:', err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns, refreshTrigger]);

  const handleDelete = async (campaignId: string) => {
    try {
      const data = await adminInvoke('send-campaign', { action: 'delete', campaignId });
      if (data?.success) {
        onNotification('Campaign deleted successfully', 'success');
        fetchCampaigns();
      } else {
        onNotification((data?.error as string) || 'Failed to delete campaign', 'error');
      }
    } catch (err) {
      onNotification((err instanceof Error ? err.message : 'Failed to delete campaign'), 'error');
    }
    setConfirmDeleteId(null);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRelativeTime = (dateStr: string) => {
    if (!dateStr) return '';
    const now = new Date();
    const d = new Date(dateStr);
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return `${Math.floor(diffDays / 30)}mo ago`;
  };

  // Summary stats
  const totalSent = campaigns.reduce((sum, c) => sum + (c.sent_count || 0), 0);
  const totalRecipients = campaigns.reduce((sum, c) => sum + (c.recipient_count || 0), 0);
  const totalOpens = campaigns.reduce((sum, c) => sum + (c.open_count || 0), 0);
  const avgOpenRate = totalSent > 0 ? ((totalOpens / totalSent) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Total Campaigns</p>
          <p className="text-3xl font-bold text-white">{total}</p>
        </div>
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Emails Sent</p>
          <p className="text-3xl font-bold text-amber-400">{totalSent.toLocaleString()}</p>
        </div>
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Total Opens</p>
          <p className="text-3xl font-bold text-emerald-400">{totalOpens.toLocaleString()}</p>
        </div>
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Avg Open Rate</p>
          <p className="text-3xl font-bold text-blue-400">{avgOpenRate}%</p>
        </div>
      </div>

      {/* Campaign Table */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Campaign History
            </h3>
            <p className="text-slate-500 text-xs mt-1">{total} campaign{total !== 1 ? 's' : ''} total</p>
          </div>
          <button
            onClick={fetchCampaigns}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all"
            title="Refresh"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="p-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 py-4 animate-pulse">
                <div className="h-4 w-48 bg-slate-700 rounded" />
                <div className="h-4 w-20 bg-slate-700/50 rounded" />
                <div className="h-6 w-16 bg-slate-700/50 rounded-full ml-auto" />
              </div>
            ))}
          </div>
        ) : campaigns.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <svg className="w-16 h-16 text-slate-700 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="text-slate-400 font-medium text-lg">No campaigns yet</p>
            <p className="text-slate-500 text-sm mt-1">Compose your first campaign to get started</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-700/30">
            {campaigns.map((campaign) => {
              const status = statusConfig[campaign.status] || statusConfig.draft;
              const openRate = campaign.sent_count > 0
                ? ((campaign.open_count / campaign.sent_count) * 100).toFixed(1)
                : '0.0';
              const clickRate = campaign.sent_count > 0
                ? ((campaign.click_count / campaign.sent_count) * 100).toFixed(1)
                : '0.0';
              const deliveryRate = campaign.recipient_count > 0
                ? ((campaign.sent_count / campaign.recipient_count) * 100).toFixed(0)
                : '0';

              return (
                <React.Fragment key={campaign.id}>
                  <div
                    className="px-6 py-4 hover:bg-slate-700/10 transition-colors cursor-pointer"
                    onClick={() => setExpandedId(expandedId === campaign.id ? null : campaign.id)}
                  >
                    <div className="flex items-start sm:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="text-white font-medium text-sm truncate">{campaign.subject}</h4>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${status.bg} ${status.text}`}>
                            {status.label}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {campaign.sent_at ? getRelativeTime(campaign.sent_at) : 'Not sent'}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {campaign.sent_count.toLocaleString()} / {campaign.recipient_count.toLocaleString()}
                          </span>
                          <span className="text-slate-600">
                            {filterLabels[campaign.recipient_filter] || campaign.recipient_filter}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Mini Stats */}
                        <div className="hidden md:flex items-center gap-4">
                          <div className="text-center">
                            <p className="text-emerald-400 font-bold text-sm">{openRate}%</p>
                            <p className="text-slate-600 text-[10px] uppercase">Opens</p>
                          </div>
                          <div className="text-center">
                            <p className="text-blue-400 font-bold text-sm">{clickRate}%</p>
                            <p className="text-slate-600 text-[10px] uppercase">Clicks</p>
                          </div>
                          <div className="text-center">
                            <p className="text-amber-400 font-bold text-sm">{deliveryRate}%</p>
                            <p className="text-slate-600 text-[10px] uppercase">Delivered</p>
                          </div>
                        </div>

                        <svg
                          className={`w-4 h-4 text-slate-500 transition-transform ${expandedId === campaign.id ? 'rotate-180' : ''}`}
                          fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedId === campaign.id && (
                    <div className="px-6 py-5 bg-slate-800/40 border-t border-slate-700/30">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
                        <div className="bg-slate-900/40 rounded-xl p-3">
                          <p className="text-slate-500 text-xs mb-1">Recipients</p>
                          <p className="text-white font-bold">{campaign.recipient_count.toLocaleString()}</p>
                        </div>
                        <div className="bg-slate-900/40 rounded-xl p-3">
                          <p className="text-slate-500 text-xs mb-1">Delivered</p>
                          <p className="text-emerald-400 font-bold">{campaign.sent_count.toLocaleString()}</p>
                        </div>
                        <div className="bg-slate-900/40 rounded-xl p-3">
                          <p className="text-slate-500 text-xs mb-1">Failed</p>
                          <p className={`font-bold ${campaign.failed_count > 0 ? 'text-red-400' : 'text-slate-500'}`}>
                            {campaign.failed_count.toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-slate-900/40 rounded-xl p-3">
                          <p className="text-slate-500 text-xs mb-1">Open Rate</p>
                          <p className="text-blue-400 font-bold">{openRate}%</p>
                        </div>
                      </div>

                      {/* Delivery Progress Bar */}
                      <div className="mb-5">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-slate-400 text-xs">Delivery Progress</span>
                          <span className="text-slate-400 text-xs">{deliveryRate}%</span>
                        </div>
                        <div className="w-full bg-slate-700/50 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full h-2 transition-all"
                            style={{ width: `${deliveryRate}%` }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5 text-sm">
                        <div>
                          <p className="text-slate-500 text-xs mb-1">Sent At</p>
                          <p className="text-slate-300">{formatDate(campaign.sent_at)}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-xs mb-1">Completed At</p>
                          <p className="text-slate-300">{formatDate(campaign.completed_at)}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-xs mb-1">From</p>
                          <p className="text-slate-300">{campaign.sender_name} &lt;{campaign.sender_email}&gt;</p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-xs mb-1">Audience</p>
                          <p className="text-slate-300">{filterLabels[campaign.recipient_filter] || campaign.recipient_filter}</p>
                        </div>
                      </div>

                      {campaign.error_message && (
                        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 mb-5">
                          <p className="text-red-400 text-xs font-medium mb-1">Error Details</p>
                          <p className="text-red-300 text-xs font-mono break-all">{campaign.error_message}</p>
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewId(previewId === campaign.id ? null : campaign.id);
                          }}
                          className="flex items-center gap-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-medium transition-all"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          {previewId === campaign.id ? 'Hide Preview' : 'View Content'}
                        </button>

                        {confirmDeleteId === campaign.id ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(campaign.id);
                              }}
                              className="px-3 py-2 bg-red-500 hover:bg-red-400 text-white rounded-xl text-xs font-medium transition-all"
                            >
                              Confirm Delete
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setConfirmDeleteId(null);
                              }}
                              className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl text-xs transition-all"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmDeleteId(campaign.id);
                            }}
                            className="flex items-center gap-2 px-3 py-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl text-xs transition-all"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        )}
                      </div>

                      {/* Content Preview */}
                      {previewId === campaign.id && (
                        <div className="mt-5 bg-white rounded-xl overflow-hidden max-h-[400px] overflow-y-auto">
                          <div
                            className="p-6 text-sm"
                            dangerouslySetInnerHTML={{ __html: campaign.html_body }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-700/50 flex items-center justify-between">
            <p className="text-slate-500 text-sm">Page {page} of {totalPages}</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-lg transition-all text-sm"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-lg transition-all text-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignHistory;
