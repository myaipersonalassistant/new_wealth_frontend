/**
 * Admin Firestore - frontend-only access to all email-bearing collections.
 * Deduplicates by email across: email_subscriptions, user_profiles, foundation_orders,
 * seminar_orders, book_orders, course_enrollments.
 */

import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from './firebase';

export interface UnifiedSubscriber {
  id: string;
  email: string;
  firstName?: string;
  source: string;
  status: string;
  subscribed_at: string;
  collections: string[];
  /** When set, this subscriber has an email_subscriptions doc and can be updated/deleted */
  subscriptionDocId?: string;
}

export interface StatsData {
  total: number;
  active: number;
  unsubscribed: number;
  bounced: number;
  recentCount: number;
  monthlyCount: number;
  dailyBreakdown: { date: string; count: number }[];
  sourceBreakdown: Record<string, number>;
}

/** Aggregated analytics from Firestore analytics_events (page views) for Admin dashboard */
export interface FirestoreAnalytics {
  /** Daily totals for area chart: { date, pageViews } */
  daily: { date: string; pageViews: number }[];
  /** Per-path counts for bar chart (most visited pages) */
  byPath: { path: string; count: number }[];
  /** Section breakdown for donut (e.g. Home, Blog, Course) */
  bySection: { section: string; count: number }[];
  /** Country breakdown for location metrics (country name -> count) */
  byCountry: { country: string; count: number }[];
  totalViews: number;
  uniquePaths: number;
  startDate: string;
  endDate: string;
}

type EmailRecord = { email: string; firstName?: string; source: string; status: string; subscribed_at: Date; collection: string; id?: string };

function normalizeEmail(email: string): string {
  return (email || '').trim().toLowerCase();
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Fetch all records with emails from every collection, deduplicated */
async function fetchAllEmailRecords(): Promise<EmailRecord[]> {
  const records: EmailRecord[] = [];
  const now = new Date();

  // 1. email_subscriptions
  const subsSnap = await getDocs(collection(db, 'email_subscriptions'));
  subsSnap.docs.forEach((d) => {
    const data = d.data();
    const email = normalizeEmail(data.email || '');
    if (!email || !isValidEmail(email)) return;
    const subAt = data.subscribed_at?.toDate?.() || now;
    records.push({
      email,
      firstName: data.firstName || data.first_name,
      source: (data.source || 'direct').toLowerCase(),
      status: (data.status || 'active').toLowerCase(),
      subscribed_at: subAt,
      collection: 'email_subscriptions',
      id: d.id,
    });
  });

  // 2. user_profiles
  const profilesSnap = await getDocs(collection(db, 'user_profiles'));
  profilesSnap.docs.forEach((d) => {
    const data = d.data();
    const email = normalizeEmail(data.email || '');
    if (!email || !isValidEmail(email)) return;
    records.push({
      email,
      firstName: data.full_name?.split(' ')[0],
      source: 'user_profile',
      status: 'active',
      subscribed_at: data.updated_at?.toDate?.() || data.created_at?.toDate?.() || now,
      collection: 'user_profiles',
      id: d.id,
    });
  });

  // 3. foundation_orders
  const foundationSnap = await getDocs(collection(db, 'foundation_orders'));
  foundationSnap.docs.forEach((d) => {
    const data = d.data();
    const email = normalizeEmail(data.customer_email || data.email || '');
    if (!email || !isValidEmail(email)) return;
    records.push({
      email,
      firstName: data.customer_name || data.name,
      source: 'foundation_order',
      status: 'active',
      subscribed_at: data.created_at?.toDate?.() || now,
      collection: 'foundation_orders',
      id: d.id,
    });
  });

  // 4. seminar_orders
  try {
    const seminarSnap = await getDocs(collection(db, 'seminar_orders'));
    seminarSnap.docs.forEach((d) => {
      const data = d.data();
      const email = normalizeEmail(data.customer_email || data.email || '');
      if (!email || !isValidEmail(email)) return;
      records.push({
        email,
        firstName: data.customer_name || data.name,
        source: 'seminar_order',
        status: 'active',
        subscribed_at: data.created_at?.toDate?.() || now,
        collection: 'seminar_orders',
        id: d.id,
      });
    });
  } catch {
    // Collection may not exist
  }

  // 5. book_orders
  try {
    const bookSnap = await getDocs(collection(db, 'book_orders'));
    bookSnap.docs.forEach((d) => {
      const data = d.data();
      const email = normalizeEmail(data.customer_email || data.email || '');
      if (!email || !isValidEmail(email)) return;
      records.push({
        email,
        firstName: data.customer_name || data.name,
        source: 'book_order',
        status: 'active',
        subscribed_at: data.created_at?.toDate?.() || now,
        collection: 'book_orders',
        id: d.id,
      });
    });
  } catch {
    // Collection may not exist
  }

  // 6. course_enrollments
  try {
    const enrollSnap = await getDocs(collection(db, 'course_enrollments'));
    enrollSnap.docs.forEach((d) => {
      const data = d.data();
      const email = normalizeEmail(data.email || '');
      if (!email || !isValidEmail(email)) return;
      records.push({
        email,
        firstName: undefined,
        source: `course:${data.course_id || 'unknown'}`,
        status: (data.status || 'active').toLowerCase(),
        subscribed_at: data.created_at?.toDate?.() || now,
        collection: 'course_enrollments',
        id: d.id,
      });
    });
  } catch {
    // Collection may not exist
  }

  return records;
}

/** Deduplicate by email, keep earliest subscribed_at and merge collections */
function deduplicate(records: EmailRecord[]): Map<string, { record: EmailRecord; collections: string[] }> {
  const map = new Map<string, { record: EmailRecord; collections: string[] }>();
  for (const r of records) {
    const existing = map.get(r.email);
    if (!existing) {
      map.set(r.email, { record: r, collections: [r.collection] });
    } else {
      if (!existing.collections.includes(r.collection)) existing.collections.push(r.collection);
      // Prefer email_subscriptions record for status; else earliest date
      if (r.collection === 'email_subscriptions') {
        existing.record = r;
      } else if (r.subscribed_at < existing.record.subscribed_at && existing.record.collection !== 'email_subscriptions') {
        existing.record = { ...r, firstName: existing.record.firstName || r.firstName };
      }
    }
  }
  return map;
}

export async function getUnifiedSubscribers(opts: {
  page?: number;
  perPage?: number;
  status?: string;
  source?: string;
  search?: string;
}): Promise<{ subscribers: UnifiedSubscriber[]; total: number; totalPages: number; stats: StatsData }> {
  const { page = 1, perPage = 25, status = 'all', source = '', search = '' } = opts;
  const records = await fetchAllEmailRecords();
  const deduped = deduplicate(records);

  // Build unified list
  let list: UnifiedSubscriber[] = Array.from(deduped.entries()).map(([email, { record, collections }]) => ({
    id: email,
    email,
    firstName: record.firstName,
    source: record.source,
    status: record.status,
    subscribed_at: record.subscribed_at.toISOString(),
    collections,
    subscriptionDocId: record.collection === 'email_subscriptions' && record.id ? record.id : undefined,
  }));

  // Sort by subscribed_at desc
  list.sort((a, b) => (b.subscribed_at || '').localeCompare(a.subscribed_at || ''));

  // Apply filters
  if (status === 'active' || status === 'unsubscribed') {
    if (status === 'unsubscribed') list = list.filter((s) => s.status === 'unsubscribed');
    else list = list.filter((s) => s.status !== 'unsubscribed');
  }
  if (source) {
    const src = source.toLowerCase();
    list = list.filter((s) => {
      const srcLower = s.source.toLowerCase();
      if (src === 'free-chapter') return srcLower.includes('free') || srcLower.includes('chapter') || srcLower.includes('starter');
      if (src === 'starter-pack') return srcLower.includes('starter');
      if (src === 'calculator') return srcLower.includes('calc');
      if (src === 'homepage') return srcLower.includes('home');
      return srcLower.includes(src);
    });
  }
  if (search) {
    const s = search.toLowerCase();
    list = list.filter((u) => u.email.includes(s) || (u.firstName || '').toLowerCase().includes(s));
  }

  const total = list.length;
  const start = (page - 1) * perPage;
  const paginated = list.slice(start, start + perPage);
  const totalPages = Math.ceil(total / perPage) || 1;

  // Compute stats from deduped list (before status/source/search filters for global stats)
  const allList: UnifiedSubscriber[] = Array.from(deduped.entries()).map(([email, { record, collections }]) => ({
    id: email,
    email,
    firstName: record.firstName,
    source: record.source,
    status: record.status,
    subscribed_at: record.subscribed_at.toISOString(),
    collections,
  }));

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const dailyCounts: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dailyCounts[d.toISOString().slice(0, 10)] = 0;
  }
  let active = 0, unsubscribed = 0, bounced = 0, recentCount = 0, monthlyCount = 0;
  const sourceBreakdown: Record<string, number> = {};
  const normSource = (src: string) => {
    const s = (src || 'direct').toLowerCase();
    if (s.includes('free') || s.includes('chapter')) return 'free-chapter';
    if (s.includes('starter')) return 'starter-pack';
    if (s.includes('calc')) return 'calculator';
    if (s.includes('home')) return 'homepage';
    if (s.startsWith('course:')) return s;
    return s || 'direct';
  };
  allList.forEach((u) => {
    if (u.status === 'unsubscribed') unsubscribed++;
    else if (u.status === 'bounced') bounced++;
    else active++;
    const subAt = new Date(u.subscribed_at);
    if (subAt >= sevenDaysAgo) recentCount++;
    if (subAt >= thirtyDaysAgo) monthlyCount++;
    const dateKey = u.subscribed_at?.slice(0, 10);
    if (dateKey && dailyCounts[dateKey] !== undefined) dailyCounts[dateKey]++;
    const key = normSource(u.source);
    sourceBreakdown[key] = (sourceBreakdown[key] || 0) + 1;
  });
  const dailyBreakdown = Object.entries(dailyCounts)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const stats: StatsData = {
    total: allList.length,
    active,
    unsubscribed,
    bounced,
    recentCount,
    monthlyCount,
    dailyBreakdown,
    sourceBreakdown,
  };

  return { subscribers: paginated, total, totalPages, stats };
}

/** Get campaign recipients (deduped emails) for preview/send. Used by Marketing Hub. */
export async function getCampaignRecipients(opts: {
  recipientFilter?: string;
  courseId?: string;
  selectedEmails?: string[];
  singleEmail?: string;
}): Promise<{ emails: string[]; withNames: { email: string; firstName: string }[] }> {
  const { recipientFilter = 'all_active', courseId, selectedEmails, singleEmail } = opts;

  if (singleEmail && singleEmail.trim()) {
    const e = singleEmail.trim().toLowerCase();
    return { emails: [e], withNames: [{ email: e, firstName: e.split('@')[0] }] };
  }
  if (Array.isArray(selectedEmails) && selectedEmails.length > 0) {
    const seen = new Set<string>();
    const list = selectedEmails
      .map((x) => (typeof x === 'string' ? x.trim().toLowerCase() : ''))
      .filter((e) => e && isValidEmail(e) && !seen.has(e) && seen.add(e));
    return {
      emails: list,
      withNames: list.map((e) => ({ email: e, firstName: e.split('@')[0] })),
    };
  }

  const records = await fetchAllEmailRecords();
  const deduped = deduplicate(records);
  let list = Array.from(deduped.entries()).map(([email, { record }]) => ({ email, record }));

  // Course filter
  if (courseId || (recipientFilter && recipientFilter.startsWith('course_enrolled:'))) {
    const cid = courseId || recipientFilter!.replace('course_enrolled:', '').trim();
    const enrollSnap = await getDocs(
      query(collection(db, 'course_enrollments'), where('course_id', '==', cid), where('status', '==', 'active'))
    );
    const enrolled = new Set<string>();
    enrollSnap.docs.forEach((d) => {
      const e = normalizeEmail(d.data().email || '');
      if (e && isValidEmail(e)) enrolled.add(e);
    });
    list = list.filter(({ email }) => enrolled.has(email));
  } else {
    // Apply recipient filters
    list = list.filter(({ record }) => {
      if (record.status === 'unsubscribed' || record.status === 'bounced') return false;
      if (recipientFilter === 'confirmed_only') return record.status === 'subscribed' || record.status === 'active';
      if (recipientFilter === 'recent_7d' || recipientFilter === 'recent_30d') {
        const days = recipientFilter === 'recent_7d' ? 7 : 30;
        const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        return record.subscribed_at >= cutoff;
      }
      if (recipientFilter.startsWith('source:')) {
        const want = recipientFilter.replace('source:', '').trim().toLowerCase();
        const src = (record.source || '').toLowerCase();
        if (want === 'free-chapter') return src.includes('free') || src.includes('chapter') || src.includes('starter');
        if (want === 'starter-pack') return src.includes('starter');
        if (want === 'calculator') return src.includes('calc');
        if (want === 'homepage') return src.includes('home');
        return src.includes(want);
      }
      return true;
    });
  }

  const emails = list.map(({ email }) => email);
  const withNames = list.map(({ email, record }) => ({
    email,
    firstName: record.firstName || email.split('@')[0],
  }));
  return { emails, withNames };
}

/** Export CSV client-side - fetches all matching filter and generates CSV */
export async function exportUnifiedSubscribersCSV(opts: { status?: string; source?: string }): Promise<{ csv: string; count: number }> {
  const { subscribers } = await getUnifiedSubscribers({
    page: 1,
    perPage: 999999,
    status: opts.status || 'all',
    source: opts.source || '',
  });
  const rows = [['email', 'firstName', 'source', 'status', 'subscribed_at', 'collections']];
  subscribers.forEach((s) => {
    rows.push([s.email, s.firstName || '', s.source, s.status, s.subscribed_at || '', s.collections.join('; ')]);
  });
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
  return { csv, count: subscribers.length };
}

/** Update email_subscriptions status (only for docs in that collection) */
export async function updateSubscriberStatus(subscriptionId: string, newStatus: string): Promise<void> {
  const ref = doc(db, 'email_subscriptions', subscriptionId);
  await updateDoc(ref, { status: newStatus, updated_at: serverTimestamp() });
}

/** Delete from email_subscriptions (only for docs in that collection) */
export async function deleteSubscriber(subscriptionId: string): Promise<void> {
  await deleteDoc(doc(db, 'email_subscriptions', subscriptionId));
}

/** Admin: fetch all book reviews (approved + pending) for moderation */
export interface AdminReview {
  id: string;
  display_name: string;
  rating: number;
  review_text: string;
  created_at: string;
  user_id: string;
  status: string;
}

export async function fetchAdminReviews(): Promise<AdminReview[]> {
  const snap = await getDocs(
    query(
      collection(db, 'book_reviews'),
      orderBy('created_at', 'desc'),
      limit(500)
    )
  );
  return snap.docs.map((d) => {
    const data = d.data();
    const created = data.created_at?.toDate?.() ?? new Date(data.created_at ?? 0);
    return {
      id: d.id,
      display_name: data.display_name || 'Anonymous',
      rating: Number(data.rating) || 0,
      review_text: data.review_text || '',
      created_at: created.toISOString(),
      user_id: data.user_id || '',
      status: data.status || 'pending',
    };
  });
}

/** Admin: approve a review */
export async function approveReview(reviewId: string): Promise<void> {
  await updateDoc(doc(db, 'book_reviews', reviewId), {
    status: 'approved',
    updated_at: serverTimestamp(),
  });
}

/** Admin: delete a review */
export async function deleteReview(reviewId: string): Promise<void> {
  await deleteDoc(doc(db, 'book_reviews', reviewId));
}

/** Sales overview - frontend-only, aggregated from Firestore order collections */
export interface SalesOverviewData {
  sales: {
    booksSold: number;
    ticketsSold: number;
    foundationSold: number;
    coursesSold: number;
    totalRevenue: number;
    bookRevenue: number;
    seminarRevenue: number;
    foundationRevenue: number;
    coursesRevenue: number;
    recentOrders: Array<{
      id: string;
      productType: string;
      productName: string;
      quantity: number;
      amount: number;
      customerEmail: string;
      customerName: string;
      createdAt: string | null;
    }>;
    totalOrders: number;
  };
  siteMetrics: {
    subscribers: { total: number; active: number; recentWeek: number };
    blog: { total: number; published: number };
    reviews: { total: number; approved: number; pending: number; averageRating: number };
    courses: { conversions: number };
    funnels: { totalEnrollments: number; activeEnrollments: number };
    campaigns: { total: number; sent: number };
    emailEvents: { total: number };
  };
}

const ANALYTICS_EVENTS = 'analytics_events';
const ANALYTICS_BATCHES = 'analytics_batches';

function toYYYYMMDD(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Normalize path to a section for donut (e.g. /blog/foo -> Blog, / -> Home) */
function pathToSection(path: string): string {
  if (!path || path === '/') return 'Home';
  const seg = path.split('/').filter(Boolean)[0] || '';
  const map: Record<string, string> = {
    blog: 'Blog',
    start: 'Start',
    calculator: 'Calculator',
    course: 'Course',
    masterclass: 'Masterclass',
    dashboard: 'Dashboard',
    foundation: 'Foundation',
    seminar: 'Seminar',
    'book-purchase': 'Book',
    'seminar-purchase': 'Seminar',
    reviews: 'Reviews',
    auth: 'Auth',
    thanks: 'Thanks',
    privacy: 'Privacy',
    terms: 'Terms',
    refund: 'Refund',
    admin: 'Admin',
    'payment-success': 'Payment',
    'payment-cancel': 'Payment',
  };
  return map[seg] || seg.charAt(0).toUpperCase() + seg.slice(1);
}

type EventLike = { path?: string; date?: string; country?: string };

/** Merge a single event into aggregate maps (mutates maps). */
function aggregateEvent(
  data: EventLike,
  byDate: Record<string, number>,
  byPath: Record<string, number>,
  bySection: Record<string, number>,
  byCountry: Record<string, number>
) {
  const date = (data.date as string) || '';
  const path = (data.path as string) || '/';
  const country = (data.country as string) || 'Unknown';
  if (date) byDate[date] = (byDate[date] ?? 0) + 1;
  byPath[path] = (byPath[path] ?? 0) + 1;
  bySection[pathToSection(path)] = (bySection[pathToSection(path)] ?? 0) + 1;
  byCountry[country] = (byCountry[country] ?? 0) + 1;
}

/** Build result from aggregate maps and date range. */
function buildAnalyticsResult(
  byDate: Record<string, number>,
  byPath: Record<string, number>,
  bySection: Record<string, number>,
  byCountry: Record<string, number>,
  startDate: string,
  endDate: string,
  days: number,
  start: Date
) {
  for (let d = 0; d < days; d++) {
    const dte = new Date(start.getTime() + d * 24 * 60 * 60 * 1000);
    const key = toYYYYMMDD(dte);
    if (byDate[key] === undefined) byDate[key] = 0;
  }
  const daily = Object.entries(byDate)
    .filter(([date]) => date >= startDate && date <= endDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, pageViews]) => ({ date, pageViews }));
  const byPathList = Object.entries(byPath)
    .map(([path, count]) => ({ path: path || '/', count }))
    .sort((a, b) => b.count - a.count);
  const bySectionList = Object.entries(bySection)
    .sort((a, b) => b[1] - a[1])
    .map(([section, count]) => ({ section, count }));
  const byCountryList = Object.entries(byCountry)
    .sort((a, b) => b[1] - a[1])
    .map(([country, count]) => ({ country, count }));
  const totalViews = Object.values(byDate).reduce((s, n) => s + n, 0);
  return {
    daily,
    byPath: byPathList,
    bySection: bySectionList,
    byCountry: byCountryList,
    totalViews,
    uniquePaths: byPathList.length,
    startDate,
    endDate,
  };
}

const ANALYTICS_CACHE_TTL_MS = 5 * 60 * 1000; // 5 min
let analyticsCache: { key: string; data: FirestoreAnalytics; ts: number } | null = null;

/**
 * Fetch and aggregate analytics for the last N days. Optimized:
 * - Reads from analytics_batches first (few docs per time range).
 * - Optionally reads from analytics_events for legacy data (one-time cost as you migrate).
 * - Result is cached in memory for 5 min to avoid repeated reads when switching range or re-opening.
 * Admin-only (rules enforce).
 */
export async function getAnalyticsFromFirestore(
  days: number = 30,
  options?: { forceRefresh?: boolean }
): Promise<FirestoreAnalytics> {
  const cacheKey = `analytics:${days}`;
  if (!options?.forceRefresh && analyticsCache?.key === cacheKey && Date.now() - analyticsCache.ts < ANALYTICS_CACHE_TTL_MS) {
    return analyticsCache.data;
  }

  const end = new Date();
  const start = new Date(end.getTime() - (days - 1) * 24 * 60 * 60 * 1000);
  const startDate = toYYYYMMDD(start);
  const endDate = toYYYYMMDD(end);

  const byDate: Record<string, number> = {};
  const byPath: Record<string, number> = {};
  const bySection: Record<string, number> = {};
  const byCountry: Record<string, number> = {};

  // 1. Query batch docs (few reads: one doc per ~25 events)
  const batchQ = query(
    collection(db, ANALYTICS_BATCHES),
    where('maxDate', '>=', startDate),
    where('minDate', '<=', endDate)
  );
  const batchSnap = await getDocs(batchQ);
  batchSnap.docs.forEach((docSnap) => {
    const data = docSnap.data();
    const events = (data.events as EventLike[]) || [];
    events.forEach((ev) => {
      const date = (ev.date as string) || '';
      if (date >= startDate && date <= endDate) aggregateEvent(ev, byDate, byPath, bySection, byCountry);
    });
  });

  // 2. Legacy: query per-event docs (more reads; omit to save cost once migration is done)
  const eventsQ = query(
    collection(db, ANALYTICS_EVENTS),
    where('date', '>=', startDate),
    where('date', '<=', endDate)
  );
  const eventsSnap = await getDocs(eventsQ);
  eventsSnap.docs.forEach((docSnap) => {
    aggregateEvent(docSnap.data(), byDate, byPath, bySection, byCountry);
  });

  const result = buildAnalyticsResult(byDate, byPath, bySection, byCountry, startDate, endDate, days, start);
  analyticsCache = { key: cacheKey, data: result, ts: Date.now() };
  return result;
}

export async function getSalesOverview(): Promise<SalesOverviewData> {
  const dbRef = db;
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Order collections in parallel
  const [bookSnap, seminarSnap, foundationSnap, courseSnap, campaignsSnap, funnelEnrollSnap, subsSnap, blogSnap, reviewsSnap] = await Promise.all([
    getDocs(collection(dbRef, 'book_orders')),
    getDocs(collection(dbRef, 'seminar_orders')),
    getDocs(collection(dbRef, 'foundation_orders')),
    getDocs(collection(dbRef, 'course_enrollments')),
    getDocs(collection(dbRef, 'campaigns')),
    getDocs(collection(dbRef, 'email_funnel_enrollments')),
    getDocs(collection(dbRef, 'email_subscriptions')),
    getDocs(collection(dbRef, 'blog_posts')),
    getDocs(collection(dbRef, 'book_reviews')),
  ]);

  let booksSold = 0, bookRevenue = 0;
  bookSnap.docs.forEach((d) => {
    const o = d.data();
    if (o.status === 'paid') {
      const qty = o.quantity || 1;
      const amt = o.total_amount ?? o.amount ?? 0;
      booksSold += qty;
      bookRevenue += amt;
    }
  });

  let ticketsSold = 0, seminarRevenue = 0;
  seminarSnap.docs.forEach((d) => {
    const o = d.data();
    if (o.status === 'paid') {
      const qty = o.quantity || 1;
      const amt = o.total_amount ?? o.amount ?? 0;
      ticketsSold += qty;
      seminarRevenue += amt;
    }
  });

  let foundationSold = 0, foundationRevenue = 0;
  foundationSnap.docs.forEach((d) => {
    const o = d.data();
    if (o.status === 'paid') {
      const qty = o.quantity || 1;
      const amt = o.total_amount ?? o.amount ?? 0;
      foundationSold += qty;
      foundationRevenue += amt;
    }
  });

  let coursesSold = 0;
  courseSnap.docs.forEach((d) => {
    const o = d.data();
    if ((o.source || '').toLowerCase() === 'stripe') coursesSold++;
  });

  const totalRevenue = bookRevenue + seminarRevenue + foundationRevenue;
  const totalOrders = bookSnap.size + seminarSnap.size + foundationSnap.size;

  // Build recent orders (merge all, sort by created_at desc)
  const recentOrders: SalesOverviewData['sales']['recentOrders'] = [];
  const addOrder = (
    id: string,
    productType: string,
    productName: string,
    quantity: number,
    amount: number,
    customerEmail: string,
    customerName: string,
    createdAt: Date | null
  ) => {
    recentOrders.push({
      id,
      productType,
      productName,
      quantity,
      amount,
      customerEmail: customerEmail || '',
      customerName: customerName || 'Customer',
      createdAt: createdAt ? createdAt.toISOString() : null,
    });
  };

  bookSnap.docs.forEach((d) => {
    const o = d.data();
    if (o.status === 'paid') {
      const created = o.created_at?.toDate?.() ?? new Date(o.created_at) ?? null;
      addOrder(d.id, 'book', 'Book', o.quantity || 1, o.total_amount ?? o.amount ?? 0, o.customer_email, o.customer_name, created);
    }
  });
  seminarSnap.docs.forEach((d) => {
    const o = d.data();
    if (o.status === 'paid') {
      const created = o.created_at?.toDate?.() ?? new Date(o.created_at) ?? null;
      addOrder(d.id, 'seminar', 'Seminar', o.quantity || 1, o.total_amount ?? o.amount ?? 0, o.customer_email, o.customer_name, created);
    }
  });
  foundationSnap.docs.forEach((d) => {
    const o = d.data();
    if (o.status === 'paid') {
      const created = o.created_at?.toDate?.() ?? new Date(o.created_at) ?? null;
      addOrder(d.id, 'foundation', 'Foundation Edition', o.quantity || 1, o.total_amount ?? o.amount ?? 0, o.customer_email, o.customer_name, created);
    }
  });

  recentOrders.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  const topRecent = recentOrders.slice(0, 10);

  // Site metrics
  let activeSubs = 0, recentWeek = 0;
  subsSnap.docs.forEach((d) => {
    if (d.data().status !== 'unsubscribed') activeSubs++;
    const subAt = d.data().subscribed_at?.toDate?.() ?? new Date(d.data().subscribed_at);
    if (subAt >= sevenDaysAgo) recentWeek++;
  });

  let blogTotal = 0, blogPublished = 0;
  blogSnap.docs.forEach((d) => {
    const s = d.data().status;
    blogTotal++;
    if (s === 'published') blogPublished++;
  });

  let reviewsApproved = 0, reviewsPending = 0, reviewsTotal = 0;
  let ratingSum = 0;
  reviewsSnap.docs.forEach((d) => {
    const r = d.data();
    reviewsTotal++;
    if (r.status === 'approved') {
      reviewsApproved++;
      if (r.rating) ratingSum += r.rating;
    } else reviewsPending++;
  });
  const averageRating = reviewsApproved > 0 ? Math.round((ratingSum / reviewsApproved) * 10) / 10 : 0;

  let funnelTotal = 0, funnelActive = 0;
  funnelEnrollSnap.docs.forEach((d) => {
    funnelTotal++;
    if (d.data().status === 'active') funnelActive++;
  });

  let campaignsTotal = campaignsSnap.size;
  let campaignsSent = 0;
  campaignsSnap.docs.forEach((d) => {
    const s = (d.data().status || '').toLowerCase();
    if (s === 'sent' || s === 'partial') campaignsSent++;
  });

  return {
    sales: {
      booksSold,
      ticketsSold,
      foundationSold,
      coursesSold,
      totalRevenue,
      bookRevenue,
      seminarRevenue,
      foundationRevenue,
      coursesRevenue: 0, // course_enrollments don't store amount; add if backend persists it
      recentOrders: topRecent,
      totalOrders,
    },
    siteMetrics: {
      subscribers: { total: subsSnap.size, active: activeSubs, recentWeek },
      blog: { total: blogTotal, published: blogPublished },
      reviews: { total: reviewsTotal, approved: reviewsApproved, pending: reviewsPending, averageRating },
      courses: { conversions: coursesSold },
      funnels: { totalEnrollments: funnelTotal, activeEnrollments: funnelActive },
      campaigns: { total: campaignsTotal, sent: campaignsSent },
      emailEvents: { total: 0 },
    },
  };
}
