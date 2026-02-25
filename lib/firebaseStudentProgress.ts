/**
 * Student progress - Firestore (replaces Supabase student_progress)
 */

import {
  collection,
  query,
  where,
  getDocs,
  writeBatch,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

const COLLECTION = 'student_progress';

export interface ProgressEntry {
  id?: string;
  user_id: string;
  course_id: string;
  module_number: number;
  lesson_index: number;
  completed: boolean;
  completed_at: string | null;
}

export async function getStudentProgress(
  userId: string,
  courseId: string
): Promise<ProgressEntry[]> {
  const col = collection(db, COLLECTION);
  const q = query(
    col,
    where('user_id', '==', userId),
    where('course_id', '==', courseId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      user_id: data.user_id,
      course_id: data.course_id,
      module_number: data.module_number,
      lesson_index: data.lesson_index,
      completed: data.completed === true,
      completed_at: data.completed_at?.toDate?.()?.toISOString?.() || data.completed_at || null,
    } as ProgressEntry;
  });
}

export async function upsertProgress(
  userId: string,
  courseId: string,
  moduleNumber: number,
  lessonIndex: number,
  completed: boolean
): Promise<void> {
  const col = collection(db, COLLECTION);
  const q = query(
    col,
    where('user_id', '==', userId),
    where('course_id', '==', courseId),
    where('module_number', '==', moduleNumber),
    where('lesson_index', '==', lessonIndex)
  );
  const snapshot = await getDocs(q);
  const batch = writeBatch(db);

  if (snapshot.empty) {
    const newRef = doc(col);
    batch.set(newRef, {
      user_id: userId,
      course_id: courseId,
      module_number: moduleNumber,
      lesson_index: lessonIndex,
      completed,
      completed_at: completed ? serverTimestamp() : null,
      updated_at: serverTimestamp(),
    });
  } else {
    const ref = snapshot.docs[0].ref;
    batch.update(ref, {
      completed,
      completed_at: completed ? serverTimestamp() : null,
      updated_at: serverTimestamp(),
    });
  }

  await batch.commit();
}
