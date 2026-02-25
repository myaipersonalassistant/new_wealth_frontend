import React, { useState } from 'react';

interface Subscriber {
  id: string;
  email: string;
  source: string;
  status: string;
  confirmed?: boolean;
  subscribed_at: string;
  ip_address?: string;
  referrer?: string;
  unsubscribed_at?: string;
  /** When set, update/delete apply to email_subscriptions doc */
  subscriptionDocId?: string;
}

interface AdminTableProps {
  subscribers: Subscriber[];
  loading: boolean;
  total: number;
  page: number;
  totalPages: number;
  search: string;
  statusFilter: string;
  sourceFilter?: string;
  onSearchChange: (search: string) => void;
  onStatusFilterChange: (status: string) => void;
  onPageChange: (page: number) => void;
  onUpdateStatus: (subscriberId: string, newStatus: string) => void;
  onDelete: (subscriberId: string, email: string) => void;
  onExport: () => void;
  exporting: boolean;
  /** Enable selection mode with checkboxes; fires callback with selected emails */
  selectionMode?: boolean;
  onSelectionChange?: (selectedEmails: string[]) => void;
}

const statusColors: Record<string, string> = {
  active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  unsubscribed: 'bg-red-500/10 text-red-400 border-red-500/20',
  bounced: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
};

const AdminTable: React.FC<AdminTableProps> = ({
  subscribers,
  loading,
  total,
  page,
  totalPages,
  search,
  statusFilter,
  sourceFilter,
  onSearchChange,
  onStatusFilterChange,
  onPageChange,
  onUpdateStatus,
  onDelete,
  onExport,
  exporting,
  selectionMode = false,
  onSelectionChange,
}) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [selectedMap, setSelectedMap] = useState<Map<string, string>>(new Map());

  const handleToggleSelect = (id: string, email: string) => {
    setSelectedMap((prev) => {
      const next = new Map(prev);
      if (next.has(id)) next.delete(id);
      else next.set(id, email);
      onSelectionChange?.(Array.from(next.values()));
      return next;
    });
  };

  const handleSelectAllPage = () => {
    const allOnPage = subscribers.map((s) => ({ id: s.id, email: s.email }));
    const allSelected = allOnPage.every(({ id }) => selectedMap.has(id));
    setSelectedMap((prev) => {
      const next = new Map(prev);
      if (allSelected) allOnPage.forEach(({ id }) => next.delete(id));
      else allOnPage.forEach(({ id, email }) => next.set(id, email));
      onSelectionChange?.(Array.from(next.values()));
      return next;
    });
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', {
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

  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 sm:p-6 border-b border-slate-700/50">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search by email..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10 transition-all text-sm"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="px-4 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500/50 text-sm cursor-pointer appearance-none min-w-[140px]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2394a3b8' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
              }}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="unsubscribed">Unsubscribed</option>
              <option value="bounced">Bounced</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* Send to selected - only when selectionMode and has selection */}
          {selectionMode && selectedMap.size > 0 && (
            <span className="text-emerald-400 text-sm font-medium">{selectedMap.size} selected</span>
          )}

          {/* Export Button */}
          <button
            onClick={onExport}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded-xl transition-all text-sm font-medium whitespace-nowrap"
          >
            {exporting ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            )}
            {exporting ? 'Exporting...' : 'Export CSV'}
          </button>
        </div>

        {/* Results count */}
        <p className="text-slate-500 text-xs mt-3">
          Showing {subscribers.length} of {total.toLocaleString()} subscriber{total !== 1 ? 's' : ''}
          {search && ` matching "${search}"`}
          {statusFilter !== 'all' && ` with status "${statusFilter}"`}
          {sourceFilter && ` from source "${sourceFilter}"`}
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700/50">
              {selectionMode && (
                <th className="w-12 px-4 py-3">
                  <button
                    type="button"
                    onClick={handleSelectAllPage}
                    className="p-1.5 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all"
                    title="Select all on page"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </th>
              )}
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Email
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:table-cell">
                Source
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Status
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">
                Signed Up
              </th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/30">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {selectionMode && <td className="px-4 py-4"><div className="h-5 w-5 bg-slate-700/50 rounded" /></td>}
                  <td className="px-6 py-4"><div className="h-4 w-48 bg-slate-700 rounded" /></td>
                  <td className="px-6 py-4 hidden sm:table-cell"><div className="h-4 w-24 bg-slate-700/50 rounded" /></td>
                  <td className="px-6 py-4"><div className="h-6 w-16 bg-slate-700/50 rounded-full" /></td>
                  <td className="px-6 py-4 hidden md:table-cell"><div className="h-4 w-32 bg-slate-700/50 rounded" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-16 bg-slate-700/50 rounded ml-auto" /></td>
                </tr>
              ))
            ) : subscribers.length === 0 ? (
              <tr>
                <td colSpan={selectionMode ? 6 : 5} className="px-6 py-16 text-center">
                  <svg className="w-12 h-12 text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p className="text-slate-400 font-medium">No subscribers found</p>
                  <p className="text-slate-500 text-sm mt-1">
                    {search ? 'Try adjusting your search query' : 'Subscribers will appear here once people sign up'}
                  </p>
                </td>
              </tr>
            ) : (
              subscribers.map((sub) => (
                <React.Fragment key={sub.id}>
                  <tr
                    className="hover:bg-slate-700/20 transition-colors cursor-pointer"
                    onClick={() => setExpandedRow(expandedRow === sub.id ? null : sub.id)}
                  >
                    {selectionMode && (
                      <td className="w-12 px-4 py-4" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => handleToggleSelect(sub.email, sub.email)}
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                            selectedMap.has(sub.email)
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : 'border-slate-500 hover:border-slate-400'
                          }`}
                        >
                          {selectedMap.has(sub.email) && (
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      </td>
                    )}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-amber-400 text-xs font-bold">
                            {sub.email[0]?.toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-white text-sm font-medium truncate">{sub.email}</p>
                          <p className="text-slate-500 text-xs sm:hidden">{sub.source || 'Direct'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span className="text-slate-400 text-sm capitalize">{sub.source || 'Direct'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          statusColors[sub.status] || 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                        }`}
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div>
                        <p className="text-slate-300 text-sm">{getRelativeTime(sub.subscribed_at)}</p>
                        <p className="text-slate-500 text-xs">{formatDate(sub.subscribed_at)}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        {/* Status Toggle - only when we have subscriptionDocId */}
                        {sub.subscriptionDocId ? (
                          sub.status === 'active' ? (
                            <button
                              onClick={() => onUpdateStatus(sub.subscriptionDocId!, 'unsubscribed')}
                              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                              title="Unsubscribe"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                              </svg>
                            </button>
                          ) : (
                            <button
                              onClick={() => onUpdateStatus(sub.subscriptionDocId!, 'active')}
                              className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all"
                              title="Reactivate"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </button>
                          )
                        ) : (
                          <span className="text-slate-600 text-xs px-1" title="No subscription record">—</span>
                        )}

                        {/* Delete */}
                        {confirmDelete === sub.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                onDelete(sub.subscriptionDocId!, sub.email);
                                setConfirmDelete(null);
                              }}
                              className="px-2 py-1 text-xs bg-red-500 hover:bg-red-400 text-white rounded-lg transition-all font-medium"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setConfirmDelete(null)}
                              className="px-2 py-1 text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-all"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : sub.subscriptionDocId ? (
                          <button
                            onClick={() => setConfirmDelete(sub.id)}
                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Row Details */}
                  {expandedRow === sub.id && (
                    <tr className="bg-slate-800/40">
                      <td colSpan={selectionMode ? 6 : 5} className="px-6 py-4">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-slate-500 text-xs mb-1">Confirmed</p>
                            <p className="text-slate-300">{sub.confirmed ? 'Yes' : 'No'}</p>
                          </div>
                          <div>
                            <p className="text-slate-500 text-xs mb-1">IP Address</p>
                            <p className="text-slate-300 font-mono text-xs">{sub.ip_address || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-slate-500 text-xs mb-1">Referrer</p>
                            <p className="text-slate-300 truncate text-xs">{sub.referrer || 'Direct'}</p>
                          </div>
                          <div>
                            <p className="text-slate-500 text-xs mb-1">Unsubscribed At</p>
                            <p className="text-slate-300 text-xs">
                              {sub.unsubscribed_at ? formatDate(sub.unsubscribed_at) : 'N/A'}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-slate-700/50 flex items-center justify-between">
          <p className="text-slate-500 text-sm">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-lg transition-all text-sm"
            >
              Previous
            </button>
            {/* Page numbers */}
            <div className="hidden sm:flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                      pageNum === page
                        ? 'bg-amber-500 text-slate-900'
                        : 'bg-slate-700/50 text-slate-400 hover:bg-slate-600'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-lg transition-all text-sm"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTable;
