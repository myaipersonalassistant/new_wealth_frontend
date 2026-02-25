import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { User } from 'firebase/auth';
import { onAuthStateChange } from '@/lib/firebaseAuth';
import { isUserEnrolled } from '@/lib/courseEnrollments';
import {
  createCourseCheckoutSession,
  validateCoupon,
  enrollWithCoupon,
} from '@/lib/courseCheckout';

interface CoursePurchaseButtonProps {
  courseId: string;
  priceLabel: string;
  variant?: 'indigo' | 'amber';
  className?: string;
  fullWidth?: boolean;
}

export const CoursePurchaseButton: React.FC<CoursePurchaseButtonProps> = ({
  courseId,
  priceLabel,
  variant = 'indigo',
  className = '',
  fullWidth = true,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isEnrolled, setIsEnrolled] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const unsub = onAuthStateChange(setUser);
    return unsub;
  }, []);

  useEffect(() => {
    if (!user) {
      setIsEnrolled(null);
      return;
    }
    let cancelled = false;
    isUserEnrolled(user.uid, courseId).then((enrolled) => {
      if (!cancelled) setIsEnrolled(enrolled);
    });
    return () => { cancelled = true; };
  }, [user, courseId]);

  const redirectPath = location.pathname + location.search;
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState(false);
  const [loading, setLoading] = useState<'coupon' | 'checkout' | null>(null);

  const gradient = variant === 'amber'
    ? 'from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500'
    : 'from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500';

  const handleApplyCoupon = async () => {
    if (!couponCode.trim() || !user) return;
    setCouponError(null);
    setLoading('coupon');
    try {
      const result = await validateCoupon(courseId, couponCode.trim());
      if (!result.valid) {
        setCouponError(result.error || 'Invalid coupon');
        setLoading(null);
        return;
      }
      const token = await user.getIdToken();
      const enroll = await enrollWithCoupon(courseId, couponCode.trim(), token);
      if (enroll.success) {
        setCouponSuccess(true);
        setCouponError(null);
        window.location.href = `/dashboard?tab=${courseId}&enrolled=1`;
      } else {
        setCouponError(enroll.error || 'Could not enroll');
      }
    } catch {
      setCouponError('Something went wrong');
    } finally {
      setLoading(null);
    }
  };

  const handleCheckout = async () => {
    if (!user) return;
    setCouponError(null);
    setLoading('checkout');
    try {
      const result = await createCourseCheckoutSession({
        courseId,
        userId: user.uid,
        customerEmail: user.email || undefined,
        // success/cancel URLs use dedicated pages (payment-success, payment-cancel)
      });
      if (result.success && result.url) {
        window.location.href = result.url;
      } else {
        setCouponError(result.error || 'Checkout failed');
        setLoading(null);
      }
    } catch {
      setCouponError('Checkout failed');
      setLoading(null);
    }
  };

  if (!user) {
    return (
      <Link
        to={`/auth?redirect=${encodeURIComponent(redirectPath)}`}
        className={`${fullWidth ? 'w-full ' : ''}bg-gradient-to-r ${gradient} text-white font-bold px-8 py-5 rounded-xl text-lg transition-all hover:shadow-xl flex items-center justify-center gap-2 ${variant === 'amber' ? 'text-slate-900 hover:text-slate-900' : ''} ${className}`}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Sign in to enrol — {priceLabel}
      </Link>
    );
  }

  // Already enrolled — show Go to Dashboard
  if (isEnrolled === true) {
    return (
      <Link
        to={`/dashboard?tab=${courseId}`}
        className={`${fullWidth ? 'w-full ' : ''}bg-gradient-to-r ${gradient} text-white font-bold px-8 py-5 rounded-xl text-lg transition-all hover:shadow-xl flex items-center justify-center gap-2 ${variant === 'amber' ? 'text-slate-900 hover:text-slate-900' : ''} ${className}`}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        Go to Dashboard — Continue Learning
      </Link>
    );
  }

  return (
    <div className={`space-y-3 ${fullWidth ? 'w-full' : ''}`}>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Have a coupon?"
          value={couponCode}
          onChange={(e) => {
            setCouponCode(e.target.value.toUpperCase());
            setCouponError(null);
            setCouponSuccess(false);
          }}
          disabled={!!couponSuccess}
          className="flex-1 px-4 py-2.5 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        />
        <button
          onClick={handleApplyCoupon}
          disabled={!couponCode.trim() || loading !== null || couponSuccess}
          className="px-4 py-2.5 rounded-lg bg-slate-700 border border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white text-sm font-medium transition-colors disabled:opacity-50"
        >
          {loading === 'coupon' ? 'Applying…' : 'Apply'}
        </button>
      </div>
      {couponError && (
        <p className="text-red-400 text-sm">{couponError}</p>
      )}
      {couponSuccess && (
        <p className="text-emerald-400 text-sm">Coupon applied! Redirecting…</p>
      )}
      <button
        onClick={handleCheckout}
        disabled={loading !== null || couponSuccess}
        className={`${fullWidth ? 'w-full ' : ''}bg-gradient-to-r ${gradient} text-white font-bold px-8 py-5 rounded-xl text-lg transition-all hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-70 ${variant === 'amber' ? 'text-slate-900 hover:text-slate-900' : ''} ${className}`}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        {loading === 'checkout' ? 'Redirecting…' : `Enrol Now — ${priceLabel}`}
      </button>
    </div>
  );
};
