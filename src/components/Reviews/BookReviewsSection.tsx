import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  fetchAllReviews,
  fetchUserReview,
  submitReview,
  computeAggregate,
  type Review,
} from '@/lib/bookReviews';
import StarRating from './StarRating';
import ReviewModal from './ReviewModal';
import type { User } from 'firebase/auth';

interface Aggregate {
  total_reviews: number;
  average_rating: number;
  distribution: Record<number, number>;
}

interface BookReviewsSectionProps {
  user: User | null;
  userProfile?: { full_name?: string } | null;
  onSignInClick: () => void;
}

const PREVIEW_COUNT = 5;

const BookReviewsSection: React.FC<BookReviewsSectionProps> = ({ user, userProfile, onSignInClick }) => {
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [aggregate, setAggregate] = useState<Aggregate>({
    total_reviews: 0,
    average_rating: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const loadReviews = useCallback(async () => {
    setIsLoading(true);
    setFetchError(false);
    try {
      const reviews = await fetchAllReviews();
      if (!mountedRef.current) return;
      setAllReviews(reviews);
      setAggregate(computeAggregate(reviews));
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
      if (mountedRef.current) setFetchError(true);
    } finally {
      if (mountedRef.current) setIsLoading(false);
    }
  }, []);

  const loadUserReview = useCallback(async () => {
    if (!user) {
      setUserReview(null);
      return;
    }
    try {
      const review = await fetchUserReview(user.uid);
      if (mountedRef.current) setUserReview(review);
    } catch (err) {
      console.error('Failed to check user review:', err);
      if (mountedRef.current) setUserReview(null);
    }
  }, [user]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  useEffect(() => {
    loadUserReview();
  }, [loadUserReview]);

  const handleSubmitReview = async (data: { rating: number; review_text: string; display_name: string }) => {
    if (!user) throw new Error('Please sign in to submit a review.');

    setIsSubmitting(true);
    try {
      await submitReview(user.uid, data, userReview?.id);
      setSuccessMessage(userReview ? 'Your review has been updated.' : 'Thank you for your review!');
      setIsModalOpen(false);
      setTimeout(() => setSuccessMessage(''), 4000);
      await loadReviews();
      await loadUserReview();
    } catch (err: any) {
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWriteReviewClick = () => {
    if (!user) {
      onSignInClick();
      return;
    }
    setIsModalOpen(true);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getInitial = (name: string) => {
    return (name || 'A')[0].toUpperCase();
  };

  const previewReviews = allReviews.slice(0, PREVIEW_COUNT);
  const hasMoreReviews = allReviews.length > PREVIEW_COUNT;
  const showViewAllLink = allReviews.length > 0;

  return (
    <section id="reviews" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitReview}
        existingReview={userReview}
        isSubmitting={isSubmitting}
        defaultDisplayName={userProfile?.full_name || user?.displayName || ''}
      />

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-amber-400 font-semibold text-sm uppercase tracking-wider">Reader Reviews</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-4 mb-4">
            What Readers Think
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Honest reviews from readers who&apos;ve used this book to start or grow their property investment journey.
          </p>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 sm:p-8 mb-10">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="text-center flex-shrink-0">
              <div className="text-6xl sm:text-7xl font-bold text-white mb-2">
                {aggregate.total_reviews > 0 ? aggregate.average_rating.toFixed(1) : '—'}
              </div>
              <StarRating rating={aggregate.average_rating} size="md" />
              <p className="text-slate-400 text-sm mt-2">
                {aggregate.total_reviews > 0
                  ? `Based on ${aggregate.total_reviews} review${aggregate.total_reviews !== 1 ? 's' : ''}`
                  : 'No reviews yet'}
              </p>
            </div>

            <div className="flex-1 w-full space-y-2.5">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = aggregate.distribution[star] || 0;
                const percentage = aggregate.total_reviews > 0
                  ? (count / aggregate.total_reviews) * 100
                  : 0;

                return (
                  <div key={star} className="flex items-center gap-3">
                    <span className="text-slate-400 text-sm font-medium w-8 text-right">{star}</span>
                    <svg className="w-4 h-4 text-amber-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <div className="flex-1 h-3 bg-slate-700/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-slate-500 text-sm w-8">{count}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex-shrink-0">
              <button
                onClick={handleWriteReviewClick}
                className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-6 py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/25 hover:-translate-y-0.5 flex items-center gap-2 whitespace-nowrap"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                {userReview ? 'Edit Your Review' : 'Write a Review'}
              </button>
              {!user && (
                <Link
                  to={`/auth?redirect=${encodeURIComponent('/#reviews')}`}
                  className="block mt-2 text-center text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors"
                >
                  Sign in to leave a review
                </Link>
              )}
            </div>
          </div>
        </div>

        {successMessage && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-5 py-3 mb-6 flex items-center gap-3">
            <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-emerald-300 font-medium">{successMessage}</span>
          </div>
        )}

        <div className="space-y-5">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 sm:p-8 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-slate-700 rounded-full" />
                  <div>
                    <div className="w-24 h-4 bg-slate-700 rounded mb-2" />
                    <div className="w-16 h-3 bg-slate-700 rounded" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-3 bg-slate-700 rounded" />
                  <div className="w-3/4 h-3 bg-slate-700 rounded" />
                  <div className="w-1/2 h-3 bg-slate-700 rounded" />
                </div>
              </div>
            ))
          ) : fetchError ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h4 className="text-white font-semibold text-lg mb-2">Unable to Load Reviews</h4>
              <p className="text-slate-400 mb-6">There was a problem connecting to the server. Please try again.</p>
              <button
                onClick={() => loadReviews()}
                className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-6 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/25 inline-flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Try Again
              </button>
            </div>
          ) : previewReviews.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-slate-800/60 border border-slate-700/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h4 className="text-white font-semibold text-lg mb-2">No Reviews Yet</h4>
              <p className="text-slate-400 mb-6">Be the first to share your thoughts on the book.</p>
              <button
                onClick={handleWriteReviewClick}
                className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-6 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/25 inline-flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Write the First Review
              </button>
            </div>
          ) : (
            previewReviews.map((review) => (
              <div
                key={review.id}
                className={`bg-slate-800/50 border rounded-2xl p-6 sm:p-8 transition-colors ${
                  user && review.user_id === user.uid
                    ? 'border-amber-500/30 bg-amber-500/5'
                    : 'border-slate-700/50 hover:border-slate-600'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                      user && review.user_id === user.uid
                        ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-slate-900'
                        : 'bg-slate-700 text-slate-300'
                    }`}>
                      {getInitial(review.display_name)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold">{review.display_name}</span>
                        {user && review.user_id === user.uid && (
                          <span className="text-xs bg-amber-500/15 text-amber-400 px-2 py-0.5 rounded-full font-medium">
                            Your Review
                          </span>
                        )}
                      </div>
                      <span className="text-slate-500 text-sm">{formatDate(review.created_at)}</span>
                    </div>
                  </div>
                  <StarRating rating={review.rating} size="sm" />
                </div>

                <p className="text-slate-300 leading-relaxed whitespace-pre-line">{review.review_text}</p>

                {user && review.user_id === user.uid && (
                  <div className="mt-4 pt-4 border-t border-slate-700/50">
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="text-amber-400 hover:text-amber-300 text-sm font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit your review
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* View All Reviews - creative CTA */}
        {showViewAllLink && (
          <Link to="/reviews" className="mt-10 block group">
            <div className="relative overflow-hidden bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 rounded-2xl p-6 hover:border-amber-500/40 hover:from-amber-500/15 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-amber-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-lg">
                      {hasMoreReviews ? `Read all ${aggregate.total_reviews} reviews` : 'View reviews page'}
                    </p>
                    <p className="text-slate-400 text-sm">
                      {hasMoreReviews ? 'See what readers are saying about the book' : 'Dedicated page with all reader feedback'}
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-2 text-amber-400 font-medium group-hover:gap-3 transition-all">
                  View all reviews
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        )}

        {!user && previewReviews.length > 0 && (
          <div className="text-center mt-10 pt-8 border-t border-slate-700/50">
            <p className="text-slate-400 mb-4">Have you read the book? Share your experience with others.</p>
            <Link
              to={`/auth?redirect=${encodeURIComponent('/#reviews')}`}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl border border-white/20 transition-all hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Sign In to Write a Review
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default BookReviewsSection;
