/**
 * Firebase Storage helpers for blog media (images, videos, files)
 * Used by Admin BlogManager - uploads to blog_media/ path
 */

import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { storage } from '@/lib/firebase';

const BLOG_MEDIA_PATH = 'blog_media';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg'];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB for other files

function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop()! : 'bin';
}

function generateStoragePath(originalName: string, subfolder: string): string {
  const ext = getFileExtension(originalName);
  const safeName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_').slice(0, 50);
  const unique = `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  return `${BLOG_MEDIA_PATH}/${subfolder}/${unique}_${safeName}`;
}

export interface UploadProgress {
  bytesTransferred: number;
  totalBytes: number;
  percent: number;
}

/**
 * Upload a file to Firebase Storage (blog media)
 * @param file - The file to upload
 * @param subfolder - e.g. 'covers', 'images', 'videos', 'files'
 * @param onProgress - Optional progress callback
 * @returns Download URL
 */
export async function uploadBlogMedia(
  file: File,
  subfolder: string,
  onProgress?: (p: UploadProgress) => void
): Promise<string> {
  const path = generateStoragePath(file.name, subfolder);
  const storageRef = ref(storage, path);

  return new Promise((resolve, reject) => {
    const task = uploadBytesResumable(storageRef, file, {
      contentType: file.type,
      customMetadata: { originalName: file.name },
    });

    task.on(
      'state_changed',
      (snapshot) => {
        if (onProgress) {
          onProgress({
            bytesTransferred: snapshot.bytesTransferred,
            totalBytes: snapshot.totalBytes,
            percent: snapshot.totalBytes > 0
              ? Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
              : 0,
          });
        }
      },
      reject,
      () => getDownloadURL(task.snapshot.ref).then(resolve)
    );
  });
}

/**
 * Upload image with validation (for cover or inline)
 */
export async function uploadBlogImage(
  file: File,
  subfolder: 'covers' | 'images' = 'images',
  onProgress?: (p: UploadProgress) => void
): Promise<string> {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error('Invalid image type. Use JPEG, PNG, GIF, or WebP.');
  }
  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error('Image too large. Max 5MB.');
  }
  return uploadBlogMedia(file, subfolder, onProgress);
}

/**
 * Upload video with validation
 */
export async function uploadBlogVideo(
  file: File,
  onProgress?: (p: UploadProgress) => void
): Promise<string> {
  if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
    throw new Error('Invalid video type. Use MP4, WebM, or OGG.');
  }
  if (file.size > MAX_VIDEO_SIZE) {
    throw new Error('Video too large. Max 50MB.');
  }
  return uploadBlogMedia(file, 'videos', onProgress);
}

/**
 * Upload any file (PDF, etc.) for blog content
 */
export async function uploadBlogFile(
  file: File,
  onProgress?: (p: UploadProgress) => void
): Promise<string> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File too large. Max 10MB.');
  }
  return uploadBlogMedia(file, 'files', onProgress);
}

