import React, { useState, useEffect } from 'react';
import StarRating from './StarRating';

interface ExistingReview {
  id: string;
  rating: number;
  review_text: string;
  display_name: string;
}

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { rating: number; review_text: string; display_name: string }) => Promise<void>;
  existingReview?: ExistingReview | null;
  isSubmitting: boolean;
  /** Pre-fill display name for new reviews (user's full_name or displayName) */
  defaultDisplayName?: string;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  existingReview,
  isSubmitting,
  defaultDisplayName = '',
}) => {
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating);
      setReviewText(existingReview.review_text);
      setDisplayName(existingReview.display_name);
    } else {
      setRating(5);
      setReviewText('');
      setDisplayName(defaultDisplayName);
    }
    setError('');
  }, [existingReview, defaultDisplayName, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (rating === 0) {
      setError('Please select a star rating.');
      return;
    }

    if (reviewText.trim().length < 10) {
      setError('Your review must be at least 10 characters.');
      return;
    }

    if (reviewText.trim().length > 2000) {
      setError('Your review must be under 2,000 characters.');
      return;
    }

    try {
      await onSubmit({
        rating,
        review_text: reviewText.trim(),
        display_name: displayName.trim() || 'Anonymous',
      });
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-700">
          <h3 className="text-xl font-bold text-white">
            {existingReview ? 'Edit Your Review' : 'Write a Review'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
          {/* Star Rating */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Your Rating <span className="text-red-400">*</span>
            </label>
            <div className="flex items-center gap-3">
              <StarRating
                rating={rating}
                size="lg"
                interactive
                onRate={setRating}
              />
              {rating > 0 && (
                <span className="text-amber-400 font-semibold text-lg">
                  {rating}/5
                </span>
              )}
            </div>
          </div>

          {/* Display Name */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name (or leave blank for Anonymous)"
              maxLength={50}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
            />
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Your Review <span className="text-red-400">*</span>
            </label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your experience with the book. What did you find most valuable? How has it impacted your property journey?"
              rows={5}
              maxLength={2000}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all resize-none"
            />
            <div className="flex justify-between mt-1.5">
              <span className="text-slate-500 text-xs">Minimum 10 characters</span>
              <span className={`text-xs ${reviewText.length > 1800 ? 'text-amber-400' : 'text-slate-500'}`}>
                {reviewText.length}/2,000
              </span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white font-medium transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-6 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/25 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Submitting...
                </>
              ) : existingReview ? (
                'Update Review'
              ) : (
                'Submit Review'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
