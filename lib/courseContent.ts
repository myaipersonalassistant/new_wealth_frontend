/**
 * Course content - Admin-uploaded materials (videos, audio, PDFs, etc.)
 * Per course (Beginners, Master Class), per module, per episode
 */

import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  limit,
  QueryDocumentSnapshot,
  DocumentData,
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';

const COLLECTION = 'course_content';
const STORAGE_PATH = 'course_content';
const MAX_FILE_SIZE = 150 * 1024 * 1024; // 150MB for videos

export type ContentFileType = 'video' | 'audio' | 'pdf' | 'document' | 'spreadsheet' | 'other';

export interface ContentFile {
  url: string;
  type: ContentFileType;
  name: string;
  size?: number;
  transcript?: string;
}

export interface CourseContentEntry {
  id: string;
  course_id: string;
  module_number: number;
  module_title: string;
  module_description?: string;
  episode_index: number;
  episode_title: string;
  episode_description?: string;
  duration?: string;
  files: ContentFile[];
  order: number;
  created_at: string;
  updated_at: string;
}

const COURSE_IDS = ['beginner-course', 'masterclass'] as const;
export type CourseId = typeof COURSE_IDS[number];

function docToEntry(d: QueryDocumentSnapshot<DocumentData>): CourseContentEntry {
  const data = d.data();
  const toStr = (v: unknown) => (v ? String(v) : '');
  const files = (data.files || []).map((f: any) => ({
    url: f.url || '',
    type: (f.type || 'other') as ContentFileType,
    name: f.name || '',
    size: f.size,
    transcript: f.transcript,
  }));
  return {
    id: d.id,
    course_id: data.course_id || '',
    module_number: typeof data.module_number === 'number' ? data.module_number : 0,
    module_title: data.module_title || '',
    module_description: data.module_description,
    episode_index: typeof data.episode_index === 'number' ? data.episode_index : 0,
    episode_title: data.episode_title || '',
    episode_description: data.episode_description,
    duration: data.duration,
    files,
    order: typeof data.order === 'number' ? data.order : 0,
    created_at: toStr(data.created_at?.toDate?.()?.toISOString?.() ?? data.created_at),
    updated_at: toStr(data.updated_at?.toDate?.()?.toISOString?.() ?? data.updated_at),
  };
}

/** List all content for a course */
export async function listCourseContent(courseId: string): Promise<CourseContentEntry[]> {
  const col = collection(db, COLLECTION);
  const q = query(col, where('course_id', '==', courseId), limit(200));
  const snapshot = await getDocs(q);
  const entries = snapshot.docs.map(docToEntry);
  entries.sort((a, b) => {
    if (a.module_number !== b.module_number) return a.module_number - b.module_number;
    return a.episode_index - b.episode_index;
  });
  return entries;
}

/** Get content for a specific lesson (module + episode) */
export async function getLessonContent(
  courseId: string,
  moduleNumber: number,
  episodeIndex: number
): Promise<CourseContentEntry | null> {
  const all = await listCourseContent(courseId);
  return all.find(c => c.module_number === moduleNumber && c.episode_index === episodeIndex) ?? null;
}

/** Structure derived from course_content for curriculum display */
export interface ModuleStructure {
  number: number;
  title: string;
  description?: string;
  episodes: EpisodeStructure[];
}

export interface EpisodeStructure {
  index: number;
  title: string;
  description?: string;
  duration?: string;
  hasContent: boolean;
  entryId?: string;
}

/** Get curriculum structure from Firestore (admin-defined modules + episodes) */
export async function getCourseStructure(courseId: string): Promise<ModuleStructure[]> {
  const entries = await listCourseContent(courseId);
  const byModule = new Map<number, { title: string; description?: string; episodes: CourseContentEntry[] }>();

  for (const e of entries) {
    if (!byModule.has(e.module_number)) {
      byModule.set(e.module_number, {
        title: e.module_title,
        description: e.module_description,
        episodes: [],
      });
    }
    byModule.get(e.module_number)!.episodes.push(e);
  }

  for (const [, data] of byModule) {
    data.episodes.sort((a, b) => a.episode_index - b.episode_index);
  }

  const sortedModules = [...byModule.entries()].sort((a, b) => a[0] - b[0]);
  return sortedModules.map(([num, data]) => ({
    number: num,
    title: data.title,
    description: data.description,
    episodes: data.episodes.map((ep) => ({
      index: ep.episode_index,
      title: ep.episode_title,
      description: ep.episode_description,
      duration: ep.duration,
      hasContent: ep.files.length > 0,
      entryId: ep.id,
    })),
  }));
}

/** Create course content entry */
export async function createCourseContent(
  data: Omit<CourseContentEntry, 'id' | 'created_at' | 'updated_at'>
): Promise<CourseContentEntry> {
  const col = collection(db, COLLECTION);
  const payload = {
    ...data,
    files: data.files || [],
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  };
  const ref_ = await addDoc(col, payload);
  const now = new Date().toISOString();
  return { ...data, id: ref_.id, created_at: now, updated_at: now } as CourseContentEntry;
}

/** Update course content entry */
export async function updateCourseContent(
  id: string,
  data: Partial<Omit<CourseContentEntry, 'id' | 'created_at'>>
): Promise<void> {
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, { ...data, updated_at: serverTimestamp() });
}

/** Delete course content entry */
export async function deleteCourseContent(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}

/** Upload file to Firebase Storage for course content */
export async function uploadCourseFile(
  file: File,
  courseId: string,
  moduleNumber: number,
  episodeIndex: number,
  onProgress?: (percent: number) => void
): Promise<string> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File too large. Max ${MAX_FILE_SIZE / 1024 / 1024}MB.`);
  }
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').slice(0, 80);
  const path = `${STORAGE_PATH}/${courseId}/${moduleNumber}_${episodeIndex}_${Date.now()}_${safeName}`;
  const storageRef = ref(storage, path);

  return new Promise((resolve, reject) => {
    const task = uploadBytesResumable(storageRef, file, {
      contentType: file.type,
      customMetadata: { originalName: file.name },
    });

    task.on(
      'state_changed',
      (snapshot) => {
        if (onProgress && snapshot.totalBytes > 0) {
          onProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100));
        }
      },
      reject,
      () => getDownloadURL(task.snapshot.ref).then(resolve)
    );
  });
}

export function inferContentFileType(file: File): ContentFileType {
  const t = file.type.toLowerCase();
  if (t.startsWith('video/')) return 'video';
  if (t.startsWith('audio/')) return 'audio';
  if (t === 'application/pdf') return 'pdf';
  if (t.includes('spreadsheet') || t.includes('excel') || t.includes('csv')) return 'spreadsheet';
  if (t.includes('document') || t.includes('word') || t.includes('text')) return 'document';
  return 'other';
}
