import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  fetchAllReviews,
  fetchUserReview,
  submitReview,
  computeAggregate,
  formatTimestamp,
  type Review,
} from '@/lib/bookReviews';
import { onAuthStateChange, getUserProfile, ensureUserProfile, type UserProfile } from '@/lib/firebaseAuth';
import type { User } from 'firebase/auth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StarRating from '@/components/Reviews/StarRating';
import ReviewModal from '@/components/Reviews/ReviewModal';

const PER_PAGE = 10;

const Reviews: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [aggregate, setAggregate] = useState({
    total_reviews: 0,
    average_rating: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<number, number>,
  });
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  const loadReviews = useCallback(async () => {
    setIsLoading(true);
    setFetchError(false);
    try {
      const reviews = await fetchAllReviews();
      setAllReviews(reviews);
      setAggregate(computeAggregate(reviews));
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
      setFetchError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadUserReview = useCallback(async () => {
    if (!user) {
      setUserReview(null);
      return;
    }
    try {
      const review = await fetchUserReview(user.uid);
      setUserReview(review);
    } catch {
      setUserReview(null);
    }
  }, [user]);

  useEffect(() => {
    const unsub = onAuthStateChange(async (u) => {
      setUser(u);
      if (u) {
        try {
          let p = await getUserProfile(u.uid);
          if (!p) {
            await ensureUserProfile(u);
            p = await getUserProfile(u.uid);
          }
          setUserProfile(p);
        } catch {
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
    });
    return () => unsub();
  }, []);

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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignInClick = () => navigate('/auth?redirect=/reviews');

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  const getInitial = (name: string) => (name || 'A')[0].toUpperCase();

  const totalPages = Math.max(1, Math.ceil(allReviews.length / PER_PAGE));
  const pageStart = (page - 1) * PER_PAGE;
  const paginatedReviews = allReviews.slice(pageStart, pageStart + PER_PAGE);

  return (
    <div className="min-h-screen bg-slate-900">
      <Header manageAuth={true} />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-12">
            <Link
              to="/#reviews"
              className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 text-sm font-medium mb-6 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to book
            </Link>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Reader <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Reviews</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Honest feedback from readers who&apos;ve used the book to start or grow their property investment journey.
            </p>
          </div>

          <ReviewModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleSubmitReview}
            existingReview={userReview}
            isSubmitting={isSubmitting}
            defaultDisplayName={userProfile?.full_name || user?.displayName || ''}
          />

          {/* Summary card */}
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-8 mb-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="text-5xl font-bold text-white">
                    {aggregate.total_reviews > 0 ? aggregate.average_rating.toFixed(1) : '—'}
                  </div>
                  <StarRating rating={aggregate.average_rating} size="md" />
                  <p className="text-slate-400 text-sm mt-1">
                    {aggregate.total_reviews} review{aggregate.total_reviews !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex-1 space-y-2 min-w-[200px]">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = aggregate.distribution[star] || 0;
                    const pct = aggregate.total_reviews > 0 ? (count / aggregate.total_reviews) * 100 : 0;
                    return (
                      <div key={star} className="flex items-center gap-3">
                        <span className="text-slate-400 text-sm w-6">{star}</span>
                        <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <div className="flex-1 h-2 bg-slate-700/50 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-slate-500 text-sm w-8">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <button
                onClick={() => (user ? setIsModalOpen(true) : handleSignInClick())}
                className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-6 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/25 flex items-center gap-2 shrink-0"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                {userReview ? 'Edit Your Review' : 'Write a Review'}
              </button>
            </div>
          </div>

          {successMessage && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {successMessage}
            </div>
          )}

          {/* Reviews list */}
          <div className="space-y-6">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <div key={i} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 animate-pulse">
                  <div className="flex gap-3 mb-4">
                    <div className="w-10 h-10 bg-slate-700 rounded-full" />
                    <div className="flex-1">
                      <div className="w-24 h-4 bg-slate-700 rounded mb-2" />
                      <div className="w-16 h-3 bg-slate-700 rounded" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="w-full h-3 bg-slate-700 rounded" />
                    <div className="w-3/4 h-3 bg-slate-700 rounded" />
                  </div>
                </div>
              ))
            ) : fetchError ? (
              <div className="text-center py-16">
                <p className="text-slate-400 mb-4">Unable to load reviews. Please try again.</p>
                <button onClick={loadReviews} className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-6 py-3 rounded-xl">
                  Retry
                </button>
              </div>
            ) : paginatedReviews.length === 0 ? (
              <div className="text-center py-16 bg-slate-800/30 border border-slate-700/50 rounded-2xl">
                <p className="text-slate-400 mb-6">No reviews yet. Be the first to share your thoughts.</p>
                <button
                  onClick={() => (user ? setIsModalOpen(true) : handleSignInClick())}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-6 py-3 rounded-xl"
                >
                  Write the First Review
                </button>
              </div>
            ) : (
              paginatedReviews.map((review) => (
                <div
                  key={review.id}
                  className={`bg-slate-800/50 border rounded-2xl p-6 transition-colors ${
                    user && review.user_id === user.uid ? 'border-amber-500/30 bg-amber-500/5' : 'border-slate-700/50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                          user && review.user_id === user.uid
                            ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-slate-900'
                            : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        {getInitial(review.display_name)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-semibold">{review.display_name}</span>
                          {user && review.user_id === user.uid && (
                            <span className="text-xs bg-amber-500/15 text-amber-400 px-2 py-0.5 rounded-full">Your Review</span>
                          )}
                        </div>
                        <span className="text-slate-500 text-sm">{formatDate(review.created_at)}</span>
                      </div>
                    </div>
                    <StarRating rating={review.rating} size="sm" />
                  </div>
                  <p className="text-slate-300 leading-relaxed whitespace-pre-line">{review.review_text}</p>
                  {user && review.user_id === user.uid && (
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="mt-4 text-amber-400 hover:text-amber-300 text-sm font-medium"
                    >
                      Edit your review
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-10 h-10 rounded-xl font-medium text-sm ${
                    p === page ? 'bg-amber-500 text-slate-900' : 'border border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}

          {!user && paginatedReviews.length > 0 && (
            <div className="text-center mt-12 pt-8 border-t border-slate-700/50">
              <p className="text-slate-400 mb-4">Have you read the book? Share your experience.</p>
              <Link
                to={`/auth?redirect=${encodeURIComponent('/reviews')}`}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl border border-white/20 transition-all"
              >
                Sign In to Write a Review
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Reviews;
