/**
 * Starter Pack resources - Firestore + Firebase Storage
 * Admin CRUD via StarterPackManager; users view via StarterResources
 */

import {
  collection,
  query,
  orderBy,
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

const COLLECTION = 'starter_resources';
const STORAGE_PATH = 'starter_pack';
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export type ResourceType = 'video' | 'audio' | 'pdf' | 'document' | 'spreadsheet' | 'other';

export interface StarterResource {
  id: string;
  title: string;
  description: string;
  transcript?: string;
  file_url: string;
  file_name: string;
  file_type: ResourceType;
  file_size?: number;
  order: number;
  created_at: string;
  updated_at: string;
}

function docToResource(d: QueryDocumentSnapshot<DocumentData>): StarterResource {
  const data = d.data();
  const toStr = (v: unknown) => (v ? String(v) : '');
  return {
    id: d.id,
    title: data.title || '',
    description: data.description || '',
    transcript: data.transcript || undefined,
    file_url: data.file_url || '',
    file_name: data.file_name || '',
    file_type: (data.file_type || 'other') as ResourceType,
    file_size: data.file_size,
    order: typeof data.order === 'number' ? data.order : 0,
    created_at: toStr(data.created_at?.toDate?.()?.toISOString?.() ?? data.created_at),
    updated_at: toStr(data.updated_at?.toDate?.()?.toISOString?.() ?? data.updated_at),
  };
}

/** List all starter resources (for users - public read) */
export async function listStarterResources(): Promise<StarterResource[]> {
  const col = collection(db, COLLECTION);
  const q = query(col, orderBy('order', 'asc'), limit(100));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docToResource);
}

/** Create starter resource (admin only) */
export async function createStarterResource(
  data: Omit<StarterResource, 'id' | 'created_at' | 'updated_at'>
): Promise<StarterResource> {
  const col = collection(db, COLLECTION);
  const payload = {
    title: data.title || '',
    description: data.description || '',
    transcript: data.transcript || null,
    file_url: data.file_url || '',
    file_name: data.file_name || '',
    file_type: data.file_type || 'other',
    file_size: data.file_size ?? null,
    order: typeof data.order === 'number' ? data.order : 0,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  };
  const ref_ = await addDoc(col, payload);
  const now = new Date().toISOString();
  return { ...data, id: ref_.id, created_at: now, updated_at: now } as StarterResource;
}

/** Update starter resource (admin only) */
export async function updateStarterResource(
  id: string,
  data: Partial<Omit<StarterResource, 'id' | 'created_at'>> & { updated_at?: string }
): Promise<void> {
  const docRef = doc(db, COLLECTION, id);
  const payload: Record<string, unknown> = {
    ...(data.title !== undefined && { title: data.title }),
    ...(data.description !== undefined && { description: data.description }),
    ...(data.transcript !== undefined && { transcript: data.transcript || null }),
    ...(data.file_url !== undefined && { file_url: data.file_url }),
    ...(data.file_name !== undefined && { file_name: data.file_name }),
    ...(data.file_type !== undefined && { file_type: data.file_type }),
    ...(data.file_size !== undefined && { file_size: data.file_size }),
    ...(data.order !== undefined && { order: data.order }),
    updated_at: serverTimestamp(),
  };
  await updateDoc(docRef, payload);
}

/** Delete starter resource (admin only) */
export async function deleteStarterResource(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}

/** Upload file to Firebase Storage for starter pack */
export async function uploadStarterFile(
  file: File,
  onProgress?: (percent: number) => void
): Promise<string> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File too large. Max ${MAX_FILE_SIZE / 1024 / 1024}MB.`);
  }
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').slice(0, 80);
  const path = `${STORAGE_PATH}/${Date.now()}_${safeName}`;
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

export function inferResourceType(file: File): ResourceType {
  const t = file.type.toLowerCase();
  if (t.startsWith('video/')) return 'video';
  if (t.startsWith('audio/')) return 'audio';
  if (t === 'application/pdf') return 'pdf';
  if (t.includes('spreadsheet') || t.includes('excel') || t.includes('csv')) return 'spreadsheet';
  if (t.includes('document') || t.includes('word') || t.includes('text')) return 'document';
  return 'other';
}
