/**
 * Course coupons - Firestore
 * Admin creates/deletes coupon codes for particular courses
 */

import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  QueryDocumentSnapshot,
  DocumentData,
} from 'firebase/firestore';
import { db } from './firebase';

const COLLECTION = 'course_coupons';

export interface CourseCoupon {
  id: string;
  course_id: string;
  code: string;
  discount_type: 'percent' | 'fixed';
  discount_value: number;
  max_uses: number;
  used_count: number;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

function docToCoupon(d: QueryDocumentSnapshot<DocumentData>): CourseCoupon {
  const data = d.data();
  const toStr = (v: unknown) => (v ? String(v) : '');
  const toDate = (v: unknown): string | null => {
    if (!v) return null;
    if (v instanceof Date) return v.toISOString();
    if (typeof v === 'object' && v !== null && 'toDate' in v) {
      const fn = (v as { toDate: () => Date }).toDate;
      if (typeof fn === 'function') return fn.call(v)().toISOString();
    }
    return String(v);
  };
  return {
    id: d.id,
    course_id: data.course_id || '',
    code: (data.code || '').toUpperCase().trim(),
    discount_type: data.discount_type || 'percent',
    discount_value: typeof data.discount_value === 'number' ? data.discount_value : 0,
    max_uses: typeof data.max_uses === 'number' ? data.max_uses : 0,
    used_count: typeof data.used_count === 'number' ? data.used_count : 0,
    expires_at: toDate(data.expires_at),
    created_at: toStr(data.created_at?.toDate?.()?.toISOString?.() ?? data.created_at),
    updated_at: toStr(data.updated_at?.toDate?.()?.toISOString?.() ?? data.updated_at),
  };
}

/** List all coupons for a course (admin) */
export async function listCourseCoupons(courseId: string): Promise<CourseCoupon[]> {
  const col = collection(db, COLLECTION);
  const q = query(col, where('course_id', '==', courseId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docToCoupon);
}

/** Create coupon (admin) */
export async function createCourseCoupon(data: {
  course_id: string;
  code: string;
  discount_type: 'percent' | 'fixed';
  discount_value: number;
  max_uses?: number;
  expires_at?: string | null;
}): Promise<CourseCoupon> {
  const col = collection(db, COLLECTION);
  const code = (data.code || '').toUpperCase().trim();
  if (!code) throw new Error('Coupon code is required');

  const payload = {
    course_id: data.course_id,
    code,
    discount_type: data.discount_type || 'percent',
    discount_value: typeof data.discount_value === 'number' ? data.discount_value : 0,
    max_uses: typeof data.max_uses === 'number' ? data.max_uses : 0,
    used_count: 0,
    expires_at: data.expires_at ? new Date(data.expires_at) : null,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  };
  const ref = await addDoc(col, payload);
  const now = new Date().toISOString();
  return { ...payload, id: ref.id, created_at: now, updated_at: now, expires_at: data.expires_at || null } as CourseCoupon;
}

/** Delete coupon (admin) */
export async function deleteCourseCoupon(couponId: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, couponId));
}
