/**
 * Admin API - calls backend with Firebase auth token
 */

import { auth } from './firebase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function getAuthHeaders(forceRefresh = false): Promise<HeadersInit> {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');
  const token = await user.getIdToken(forceRefresh);
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

async function adminFetch(endpoint: string, body: Record<string, unknown>): Promise<{ success: boolean; [k: string]: unknown }> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export async function adminSubscribersStats() {
  return adminFetch('/api/admin/subscribers', { action: 'stats' });
}

export async function adminSubscribersList(params: { page?: number; perPage?: number; status?: string; search?: string; source?: string }) {
  return adminFetch('/api/admin/subscribers', { action: 'list', ...params });
}

export async function adminSubscribersExport(status?: string, source?: string) {
  return adminFetch('/api/admin/subscribers', { action: 'export', status, source });
}

export async function adminSubscribersUpdateStatus(subscriberId: string, newStatus: string) {
  return adminFetch('/api/admin/subscribers', { action: 'update-status', subscriberId, newStatus });
}

export async function adminSubscribersDelete(subscriberId: string) {
  return adminFetch('/api/admin/subscribers', { action: 'delete', subscriberId });
}

/** Invoke migrated admin functions (send-campaign, email-funnel, etc.) - stubs until implemented */
export async function adminInvoke(
  fnName: string,
  body: Record<string, unknown>
): Promise<{ success?: boolean; [k: string]: unknown }> {
  let headers = await getAuthHeaders();
  let res = await fetch(`${API_URL}/api/admin/invoke`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ function: fnName, body }),
  });

  // If token expired, force refresh and retry once
  if (res.status === 401) {
    headers = await getAuthHeaders(true);
    res = await fetch(`${API_URL}/api/admin/invoke`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ function: fnName, body }),
    });
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}
