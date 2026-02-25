/**
 * Blog posts - Firestore frontend queries
 */

import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  QueryDocumentSnapshot,
  DocumentData,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

const BLOG_COLLECTION = 'blog_posts';
const PER_PAGE = 9;

export interface BlogPostData {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  cover_image: string | null;
  category: string;
  tags: string[];
  author_name: string;
  author_avatar?: string | null;
  author_bio?: string;
  read_time_minutes: number;
  published_at: string | null;
  featured: boolean;
  status: 'draft' | 'published' | 'archived';
  created_at?: string;
  updated_at?: string;
}

function docToPost(d: QueryDocumentSnapshot<DocumentData>): BlogPostData {
  const data = d.data();
  const toDate = (v: unknown): string | null => {
    if (!v) return null;
    if (v instanceof Date) return v.toISOString();
    if (typeof v === 'object' && v !== null && 'toDate' in v && typeof (v as { toDate: () => Date }).toDate === 'function') {
      return (v as { toDate: () => Date }).toDate().toISOString();
    }
    return String(v);
  };
  return {
    id: d.id,
    title: data.title || '',
    slug: data.slug || '',
    excerpt: data.excerpt || '',
    content: data.content,
    cover_image: data.cover_image || null,
    category: data.category || 'General',
    tags: Array.isArray(data.tags) ? data.tags : [],
    author_name: data.author_name || '',
    author_avatar: data.author_avatar ?? null,
    author_bio: data.author_bio || '',
    read_time_minutes: typeof data.read_time_minutes === 'number' ? data.read_time_minutes : 5,
    published_at: toDate(data.published_at),
    featured: !!data.featured,
    status: data.status || 'draft',
    created_at: toDate(data.created_at) ?? undefined,
    updated_at: toDate(data.updated_at) ?? undefined,
  };
}

/** List published blog posts with category filter, search, and pagination */
export async function listBlogPosts(opts: {
  category?: string;
  search?: string;
  page?: number;
  perPage?: number;
}): Promise<{
  posts: BlogPostData[];
  totalPages: number;
  total: number;
}> {
  const { category = 'all', search = '', page = 1, perPage = PER_PAGE } = opts;
  const col = collection(db, BLOG_COLLECTION);

  let q = query(
    col,
    where('status', '==', 'published'),
    orderBy('published_at', 'desc'),
    limit(200) // Cap for client-side search
  );

  if (category !== 'all') {
    q = query(col, where('status', '==', 'published'), where('category', '==', category), orderBy('published_at', 'desc'), limit(200));
  }

  const snapshot = await getDocs(q);
  let posts = snapshot.docs.map(docToPost);

  if (search.trim()) {
    const term = search.trim().toLowerCase();
    posts = posts.filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        p.excerpt.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        p.tags.some((t) => t.toLowerCase().includes(term))
    );
  }

  const total = posts.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  const paginated = posts.slice(start, start + perPage);

  return { posts: paginated, totalPages, total };
}

/** Get distinct categories from published posts */
export async function getBlogCategories(): Promise<string[]> {
  const col = collection(db, BLOG_COLLECTION);
  const q = query(col, where('status', '==', 'published'), limit(500));
  const snapshot = await getDocs(q);
  const categories = new Set<string>();
  snapshot.docs.forEach((d) => {
    const cat = d.data().category;
    if (cat) categories.add(cat);
  });
  return Array.from(categories).sort();
}

/** Get single published post by slug */
export async function getBlogPostBySlug(slug: string): Promise<BlogPostData | null> {
  const col = collection(db, BLOG_COLLECTION);
  const q = query(col, where('status', '==', 'published'), where('slug', '==', slug), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return docToPost(snapshot.docs[0]);
}

/** Get related posts (same category, exclude current) */
export async function getRelatedPosts(postId: string, category: string, limitCount = 3): Promise<BlogPostData[]> {
  const col = collection(db, BLOG_COLLECTION);
  const q = query(
    col,
    where('status', '==', 'published'),
    where('category', '==', category),
    orderBy('published_at', 'desc'),
    limit(limitCount + 5)
  );
  const snapshot = await getDocs(q);
  const posts = snapshot.docs
    .map(docToPost)
    .filter((p) => p.id !== postId)
    .slice(0, limitCount);
  return posts;
}

// --- Admin functions (requires user with role: admin in user_profiles) ---

/** List all blog posts for admin (includes drafts, archived) */
export async function listBlogPostsAdmin(opts?: { search?: string }): Promise<BlogPostData[]> {
  const col = collection(db, BLOG_COLLECTION);
  const q = query(col, orderBy('updated_at', 'desc'), limit(200));
  const snapshot = await getDocs(q);
  let posts = snapshot.docs.map(docToPost);
  if (opts?.search?.trim()) {
    const term = opts.search.trim().toLowerCase();
    posts = posts.filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        p.excerpt?.toLowerCase().includes(term) ||
        p.category?.toLowerCase().includes(term)
    );
  }
  return posts;
}

/** Get blog stats for admin */
export async function getBlogStatsAdmin(): Promise<{
  total: number;
  published: number;
  drafts: number;
  archived: number;
  featured: number;
  categories: Record<string, number>;
}> {
  const posts = await listBlogPostsAdmin();
  const stats = {
    total: posts.length,
    published: posts.filter((p) => p.status === 'published').length,
    drafts: posts.filter((p) => p.status === 'draft').length,
    archived: posts.filter((p) => p.status === 'archived').length,
    featured: posts.filter((p) => p.featured).length,
    categories: {} as Record<string, number>,
  };
  posts.forEach((p) => {
    const c = p.category || 'Uncategorized';
    stats.categories[c] = (stats.categories[c] || 0) + 1;
  });
  return stats;
}

function toFirestorePost(data: Partial<BlogPostData> & { status?: string }): Record<string, unknown> {
  const out: Record<string, unknown> = {
    title: data.title || '',
    slug: data.slug || '',
    excerpt: data.excerpt || '',
    content: data.content || '',
    cover_image: data.cover_image || null,
    category: data.category || 'General',
    tags: Array.isArray(data.tags) ? data.tags : [],
    author_name: data.author_name || '',
    author_avatar: data.author_avatar ?? null,
    author_bio: data.author_bio || '',
    read_time_minutes: typeof data.read_time_minutes === 'number' ? data.read_time_minutes : 5,
    featured: !!data.featured,
    status: data.status || 'draft',
  };
  if (data.published_at) {
    out.published_at = new Date(data.published_at);
  } else if (data.status === 'published') {
    out.published_at = serverTimestamp();
  } else {
    out.published_at = null;
  }
  return out;
}

/** Create blog post (admin only) */
export async function createBlogPostAdmin(data: Omit<BlogPostData, 'id' | 'created_at' | 'updated_at'>): Promise<BlogPostData> {
  const col = collection(db, BLOG_COLLECTION);
  const payload = {
    ...toFirestorePost(data),
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  };
  const ref = await addDoc(col, payload);
  const now = new Date().toISOString();
  return {
    ...data,
    id: ref.id,
    created_at: now,
    updated_at: now,
  } as BlogPostData;
}

/** Update blog post (admin only) */
export async function updateBlogPostAdmin(id: string, data: Partial<BlogPostData>): Promise<void> {
  const ref = doc(db, BLOG_COLLECTION, id);
  const payload = {
    ...toFirestorePost(data),
    updated_at: serverTimestamp(),
  };
  delete (payload as Record<string, unknown>).created_at;
  await updateDoc(ref, payload as Record<string, unknown>);
}

/** Delete blog post (admin only) */
export async function deleteBlogPostAdmin(id: string): Promise<void> {
  await deleteDoc(doc(db, BLOG_COLLECTION, id));
}
