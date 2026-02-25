/**
 * Shared book reviews logic for BookReviewsSection and Reviews page
 */
import {
  collection,
  query,
  orderBy,
  limit,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';

export const REVIEWS_COLLECTION = 'book_reviews';
export const MAX_REVIEWS_FETCH = 200;

export interface Review {
  id: string;
  display_name: string;
  rating: number;
  review_text: string;
  created_at: string;
  user_id: string;
}

export interface Aggregate {
  total_reviews: number;
  average_rating: number;
  distribution: Record<number, number>;
}

export function formatTimestamp(ts: Timestamp | { toDate?: () => Date } | Date): string {
  if (ts instanceof Date) return ts.toISOString();
  if (ts && typeof (ts as Timestamp).toDate === 'function') return (ts as Timestamp).toDate().toISOString();
  return String(ts);
}

export function computeAggregate(reviews: Review[]): Aggregate {
  const total = reviews.length;
  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let sum = 0;
  for (const r of reviews) {
    distribution[r.rating] = (distribution[r.rating] || 0) + 1;
    sum += r.rating;
  }
  return {
    total_reviews: total,
    average_rating: total > 0 ? sum / total : 0,
    distribution,
  };
}

/** Fetch reviews for public display - only approved reviews are shown */
export async function fetchAllReviews(approvedOnly = true): Promise<Review[]> {
  const reviewsRef = collection(db, REVIEWS_COLLECTION);
  const constraints = [orderBy('created_at', 'desc'), limit(MAX_REVIEWS_FETCH)];
  if (approvedOnly) {
    (constraints as object[]).unshift(where('status', '==', 'approved'));
  }
  const q = query(reviewsRef, ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      display_name: data.display_name || 'Anonymous',
      rating: Number(data.rating) || 0,
      review_text: data.review_text || '',
      created_at: formatTimestamp(data.created_at),
      user_id: data.user_id || '',
    };
  });
}

export async function fetchUserReview(userId: string): Promise<Review | null> {
  const reviewsRef = collection(db, REVIEWS_COLLECTION);
  const q = query(reviewsRef, where('user_id', '==', userId), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const d = snapshot.docs[0];
  const data = d.data();
  return {
    id: d.id,
    display_name: data.display_name || 'Anonymous',
    rating: Number(data.rating) || 0,
    review_text: data.review_text || '',
    created_at: formatTimestamp(data.created_at),
    user_id: data.user_id || '',
  };
}

export async function submitReview(
  userId: string,
  data: { rating: number; review_text: string; display_name: string },
  existingId?: string
) {
  const payload = {
    user_id: userId,
    display_name: (data.display_name || 'Anonymous').trim(),
    rating: data.rating,
    review_text: data.review_text.trim(),
    updated_at: serverTimestamp(),
  };
  if (existingId) {
    await updateDoc(doc(db, REVIEWS_COLLECTION, existingId), { ...payload, status: 'pending' });
  } else {
    await addDoc(collection(db, REVIEWS_COLLECTION), {
      ...payload,
      created_at: serverTimestamp(),
      status: 'pending',
    });
  }
}
