/**
 * Student notes - Firestore (replaces Supabase student_notes)
 */

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

const COLLECTION = 'student_notes';

function noteId(userId: string, courseId: string, moduleNumber: number, lessonIndex: number): string {
  return `${userId}_${courseId}_${moduleNumber}_${lessonIndex}`;
}

export async function getStudentNote(
  userId: string,
  courseId: string,
  moduleNumber: number,
  lessonIndex: number
): Promise<{ content: string; updated_at: string } | null> {
  const id = noteId(userId, courseId, moduleNumber, lessonIndex);
  const ref = doc(db, COLLECTION, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    content: data?.content || '',
    updated_at: data?.updated_at?.toDate?.()?.toISOString?.() || '',
  };
}

export async function upsertStudentNote(
  userId: string,
  courseId: string,
  moduleNumber: number,
  lessonIndex: number,
  content: string
): Promise<void> {
  const id = noteId(userId, courseId, moduleNumber, lessonIndex);
  const ref = doc(db, COLLECTION, id);
  await setDoc(ref, {
    user_id: userId,
    course_id: courseId,
    module_number: moduleNumber,
    lesson_index: lessonIndex,
    content,
    updated_at: serverTimestamp(),
  }, { merge: true });
}
