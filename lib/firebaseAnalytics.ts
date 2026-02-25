/**
 * Analytics: Firebase Analytics (GA4) + Firestore for Admin dashboard.
 * Uses batched writes to Firestore to minimize write count (1 doc per N events).
 */

import { logEvent, type Analytics } from 'firebase/analytics';
import { collection, addDoc } from 'firebase/firestore';
import { initAnalytics, getAnalyticsInstance } from './firebase';
import { db } from './firebase';

const ANALYTICS_BATCHES_COLLECTION = 'analytics_batches';

/** Max events per batch (Firestore doc ~1 MiB; ~80 bytes/event => safe up to hundreds) */
const BATCH_SIZE = 25;
/** Flush buffer after this ms if not full (so we don't hold data too long) */
const FLUSH_MS = 15000;

/** Free CORS-friendly geo API; returns { country_name?, country_code? }. Short timeout. */
const GEO_API = 'https://ipapi.co/json/';

let analyticsReady = false;

interface BufferedEvent {
  path: string;
  date: string;
  country?: string | null;
}

let eventBuffer: BufferedEvent[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;

function getDateString() {
  return new Date().toISOString().slice(0, 10);
}

/** Resolve country name for location metrics (best-effort, non-blocking). */
function getCountry(): Promise<string | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);
  return fetch(GEO_API, { signal: controller.signal })
    .then((r) => (r.ok ? r.json() : null))
    .then((j) => (j && typeof j.country_name === 'string' ? j.country_name : null))
    .catch(() => null)
    .finally(() => clearTimeout(timeout));
}

/** Flush buffer to Firestore as one batch document. */
function flushBuffer() {
  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }
  if (eventBuffer.length === 0) return;
  const toWrite = eventBuffer;
  eventBuffer = [];

  const dates = toWrite.map((e) => e.date);
  const minDate = dates.reduce((a, b) => (a < b ? a : b));
  const maxDate = dates.reduce((a, b) => (a > b ? a : b));
  const events = toWrite.map((e) => {
    const ev: { path: string; date: string; country?: string } = { path: e.path, date: e.date };
    if (e.country && e.country.length <= 100) ev.country = e.country;
    return ev;
  });

  const coll = collection(db, ANALYTICS_BATCHES_COLLECTION);
  addDoc(coll, { minDate, maxDate, events })
    .catch(() => {});
}

/** Schedule a flush after FLUSH_MS (debounce). */
function scheduleFlush() {
  if (flushTimer) return;
  flushTimer = setTimeout(flushBuffer, FLUSH_MS);
}

/** Enqueue one page view and flush when buffer is full or after delay. */
async function enqueuePageView(pagePath: string) {
  const date = getDateString();
  const country = await getCountry();
  eventBuffer.push({ path: pagePath, date, country });
  if (eventBuffer.length >= BATCH_SIZE) flushBuffer();
  else scheduleFlush();
}

/** Flush on page unload so we don't lose the last few events. */
function onBeforeUnload() {
  flushBuffer();
}
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', onBeforeUnload);
  window.addEventListener('pagehide', onBeforeUnload);
}

/** Ensure analytics is initialized and log a page_view event (FA + Firestore batch). */
export async function logPageView(pagePath: string, pageTitle?: string) {
  if (!analyticsReady) {
    await initAnalytics();
    analyticsReady = true;
  }
  const analytics = getAnalyticsInstance();
  if (analytics) {
    logEvent(analytics, 'page_view', {
      page_path: pagePath,
      page_title: pageTitle || document.title,
    });
  }
  enqueuePageView(pagePath);
}

/** Log a custom event */
export async function logAnalyticsEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
) {
  if (!analyticsReady) {
    await initAnalytics();
    analyticsReady = true;
  }
  const analytics = getAnalyticsInstance();
  if (analytics) {
    logEvent(analytics, eventName, params);
  }
}
