import React, { useState, useEffect, useCallback } from 'react';
import {
  fetchAdminReviews,
  approveReview,
  deleteReview,
  type AdminReview,
} from '@/lib/adminFirestore';
import StarRating from '@/components/Reviews/StarRating';

interface AdminReviewsManagerProps {
  onNotification: (message: string, type: 'success' | 'error') => void;
}

const AdminReviewsManager: React.FC<AdminReviewsManagerProps> = ({ onNotification }) => {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('pending');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [actioning, setActioning] = useState<string | null>(null);

  const loadReviews = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAdminReviews();
      setReviews(data);
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
      onNotification('Failed to load reviews', 'error');
    } finally {
      setLoading(false);
    }
  }, [onNotification]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const handleApprove = async (id: string) => {
    setActioning(id);
    try {
      await approveReview(id);
      setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'approved' } : r)));
      onNotification('Review approved', 'success');
    } catch (err) {
      console.error('Approve error:', err);
      onNotification('Failed to approve review', 'error');
    } finally {
      setActioning(null);
    }
  };

  const handleDelete = async (id: string) => {
    setActioning(id);
    try {
      await deleteReview(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
      setConfirmDelete(null);
      onNotification('Review deleted', 'success');
    } catch (err) {
      console.error('Delete error:', err);
      onNotification('Failed to delete review', 'error');
    } finally {
      setActioning(null);
    }
  };

  const filtered = reviews.filter((r) => {
    if (filter === 'all') return true;
    if (filter === 'pending') return (r.status || 'pending') !== 'approved';
    return r.status === 'approved';
  });

  const pendingCount = reviews.filter((r) => (r.status || 'pending') !== 'approved').length;
  const approvedCount = reviews.filter((r) => r.status === 'approved').length;

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 via-slate-800/95 to-yellow-900/15 border border-slate-700/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-yellow-500/5 via-transparent to-transparent" />
        <div className="relative p-8 sm:p-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white flex items-center gap-3">
                <svg className="w-8 h-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                Book Reviews
              </h1>
              <p className="text-slate-400 mt-1">Approve or delete reader reviews before they appear on the site</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex gap-4 text-sm">
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-400">{pendingCount}</p>
                  <p className="text-slate-500">Pending</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-400">{approvedCount}</p>
                  <p className="text-slate-500">Approved</p>
                </div>
              </div>
              <button
                onClick={loadReviews}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-slate-600 rounded-xl text-slate-300 hover:text-white transition-all text-sm font-medium disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>

          {/* Filter chips */}
          <div className="mt-6 pt-6 border-t border-slate-700/50 flex flex-wrap gap-2">
            {[
              { value: 'pending' as const, label: 'Pending', count: pendingCount },
              { value: 'approved' as const, label: 'Approved', count: approvedCount },
              { value: 'all' as const, label: 'All', count: reviews.length },
            ].map(({ value, label, count }) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  filter === value
                    ? 'bg-yellow-500/20 border border-yellow-500/50 text-yellow-400'
                    : 'bg-slate-800/60 border border-slate-700/50 text-slate-400 hover:text-white hover:border-slate-600'
                }`}
              >
                {label} ({count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews list */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-slate-400">Loading reviews…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-700/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <h3 className="text-white text-lg font-bold mb-2">No reviews found</h3>
            <p className="text-slate-400 text-sm">
              {filter === 'pending' ? 'No reviews are pending approval.' : filter === 'approved' ? 'No approved reviews yet.' : 'No book reviews have been submitted.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-700/50">
            {filtered.map((review) => {
              const isPending = (review.status || 'pending') !== 'approved';
              const busy = actioning === review.id;
              return (
                <div
                  key={review.id}
                  className="p-6 hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap mb-2">
                        <span className="text-white font-semibold">{review.display_name}</span>
                        <StarRating rating={review.rating} size="sm" />
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            isPending
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          }`}
                        >
                          {review.status || 'pending'}
                        </span>
                        <span className="text-slate-500 text-xs">{formatDate(review.created_at)}</span>
                      </div>
                      <p className="text-slate-300 text-sm leading-relaxed">{review.review_text}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {isPending && (
                        <button
                          onClick={() => handleApprove(review.id)}
                          disabled={busy}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-all text-sm font-medium disabled:opacity-50"
                        >
                          {busy ? (
                            <span className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                          Approve
                        </button>
                      )}
                      {confirmDelete === review.id ? (
                        <div className="flex items-center gap-2">
                          <span className="text-amber-400 text-xs">Delete?</span>
                          <button
                            onClick={() => handleDelete(review.id)}
                            disabled={busy}
                            className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/30 disabled:opacity-50"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setConfirmDelete(null)}
                            disabled={busy}
                            className="px-3 py-1.5 rounded-lg bg-slate-700 text-slate-400 text-sm hover:bg-slate-600"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDelete(review.id)}
                          disabled={busy}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all text-sm font-medium disabled:opacity-50"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReviewsManager;
