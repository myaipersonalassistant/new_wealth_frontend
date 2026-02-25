/**
 * Course settings - Firestore (replaces Supabase course_settings)
 */

import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
  serverTimestamp,
  query,
  where,
} from 'firebase/firestore';
import { db } from './firebase';

const COLLECTION = 'course_settings';

export interface CourseSetting {
  id: string;
  course_id: string;
  title: string;
  description: string;
  price: string;
  visible: boolean;
  purchasable: boolean;
  coming_soon_message: string;
  is_free?: boolean;
  updated_at: string;
}

function toSetting(id: string, data: any): CourseSetting {
  return {
    id,
    course_id: data.course_id || '',
    title: data.title || '',
    description: data.description || '',
    price: data.price || '',
    visible: data.visible === true,
    purchasable: data.purchasable === true,
    coming_soon_message: data.coming_soon_message || '',
    is_free: data.is_free === true,
    updated_at: data.updated_at?.toDate?.()?.toISOString?.() || data.updated_at || '',
  };
}

export async function listCourseSettings(): Promise<CourseSetting[]> {
  const col = collection(db, COLLECTION);
  const snapshot = await getDocs(col);
  const list = snapshot.docs.map((d) => toSetting(d.id, d.data()));
  list.sort((a, b) => a.course_id.localeCompare(b.course_id));
  return list;
}

export async function getCourseSettingByCourseId(courseId: string): Promise<CourseSetting | null> {
  const col = collection(db, COLLECTION);
  const q = query(col, where('course_id', '==', courseId));
  const snapshot = await getDocs(q);
  const found = snapshot.docs[0];
  return found ? toSetting(found.id, found.data()) : null;
}

export async function updateCourseSetting(
  courseId: string,
  updates: Partial<Pick<CourseSetting, 'visible' | 'purchasable' | 'coming_soon_message'>>
): Promise<void> {
  const list = await listCourseSettings();
  const existing = list.find((c) => c.course_id === courseId);
  if (!existing) {
    throw new Error(`Course setting not found for ${courseId}`);
  }
  const ref = doc(db, COLLECTION, existing.id);
  await updateDoc(ref, {
    ...updates,
    updated_at: serverTimestamp(),
  });
}

/** Seed default course settings (admin only) - creates missing defaults */
export async function seedDefaultCourseSettings(): Promise<void> {
  const list = await listCourseSettings();
  const existingIds = new Set(list.map((c) => c.course_id));
  const col = collection(db, COLLECTION);

  const defaults = [
    { course_id: 'beginner-course', title: 'Beginners', description: 'From Book to Buy-to-Let', price: '£97', visible: true, purchasable: true, coming_soon_message: '', is_free: false, updated_at: serverTimestamp() },
    { course_id: 'masterclass', title: 'Property Investor Masterclass', description: 'Advanced course', price: '£297', visible: true, purchasable: true, coming_soon_message: '', is_free: false, updated_at: serverTimestamp() },
    { course_id: 'starter-pack', title: 'Starter Pack', description: 'Free resources', price: 'Free', visible: true, purchasable: false, coming_soon_message: '', is_free: true, updated_at: serverTimestamp() },
  ];

  for (const d of defaults) {
    if (!existingIds.has(d.course_id)) {
      await addDoc(col, d);
      existingIds.add(d.course_id);
    }
  }
}

/** Create a new course (admin only) */
export async function createCourseSetting(data: {
  course_id: string;
  title: string;
  description?: string;
  price?: string;
  visible?: boolean;
  purchasable?: boolean;
  coming_soon_message?: string;
  is_free?: boolean;
}): Promise<CourseSetting> {
  const col = collection(db, COLLECTION);
  const payload = {
    course_id: data.course_id,
    title: data.title || '',
    description: data.description || '',
    price: data.price || '£0',
    visible: data.visible ?? true,
    purchasable: data.purchasable ?? false,
    coming_soon_message: data.coming_soon_message || '',
    is_free: data.is_free ?? false,
    updated_at: serverTimestamp(),
  };
  const ref = await addDoc(col, payload);
  const now = new Date().toISOString();
  return { id: ref.id, ...payload, updated_at: now } as CourseSetting;
}

/** Delete course setting (admin only) - use with caution */
export async function deleteCourseSetting(courseId: string): Promise<void> {
  const list = await listCourseSettings();
  const existing = list.find((c) => c.course_id === courseId);
  if (!existing) throw new Error(`Course setting not found for ${courseId}`);
  await deleteDoc(doc(db, COLLECTION, existing.id));
}
