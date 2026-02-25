/**
 * Course enrollments - Firestore
 * Tracks which users have purchased/unlocked which courses
 */

import { collection, query, where, getDocs, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

const COLLECTION = 'course_enrollments';

export interface CourseEnrollment {
  id: string;
  user_id: string;
  course_id: string;
  email: string;
  status: 'active' | 'cancelled';
  source: 'stripe' | 'coupon' | 'admin';
  stripe_session_id?: string;
  created_at: string;
  updated_at: string;
}

/** Check if user is enrolled in a course */
export async function isUserEnrolled(userId: string, courseId: string): Promise<boolean> {
  const col = collection(db, COLLECTION);
  const q = query(
    col,
    where('user_id', '==', userId),
    where('course_id', '==', courseId),
    where('status', '==', 'active')
  );
  const snapshot = await getDocs(q);
  return !snapshot.empty;
}

/** Get all enrollments for a user */
export async function getUserEnrollments(userId: string): Promise<string[]> {
  const col = collection(db, COLLECTION);
  const q = query(col, where('user_id', '==', userId), where('status', '==', 'active'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data().course_id as string);
}
