/**
 * Course checkout - Stripe and coupon enrollment
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface CourseCheckoutParams {
  courseId: string;
  userId?: string;
  customerEmail?: string;
  successUrl?: string;
  cancelUrl?: string;
}

export interface ValidateCouponResult {
  valid: boolean;
  error?: string;
  discount_type?: string;
  discount_value?: number;
}

export interface CourseCheckoutResult {
  success: boolean;
  url?: string;
  error?: string;
  message?: string;
}

/** Validate a coupon code for a course */
export async function validateCoupon(courseId: string, code: string): Promise<ValidateCouponResult> {
  try {
    const res = await fetch(`${API_URL}/api/validate-coupon`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId, code }),
    });
    const data = await res.json();
    return { valid: data.valid === true, error: data.error, discount_type: data.discount_type, discount_value: data.discount_value };
  } catch (e) {
    return { valid: false, error: 'Failed to validate coupon' };
  }
}

/** Enroll user via coupon (requires auth) */
export async function enrollWithCoupon(
  courseId: string,
  code: string,
  idToken: string
): Promise<CourseCheckoutResult> {
  try {
    const res = await fetch(`${API_URL}/api/course-enroll-coupon`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ courseId, code }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || 'Enrollment failed' };
    }
    return { success: true, message: data.message || 'Enrolled successfully' };
  } catch (e) {
    return { success: false, error: 'Failed to enroll' };
  }
}

/** Create Stripe checkout session for course purchase */
export async function createCourseCheckoutSession(params: CourseCheckoutParams): Promise<CourseCheckoutResult> {
  const { courseId, userId, customerEmail, successUrl, cancelUrl } = params;
  const base = window.location.origin;
  // Use dedicated success/cancel pages so user gets proper UX and enrollment is verified
  const finalSuccessUrl = successUrl ?? `${base}/payment-success?session_id={CHECKOUT_SESSION_ID}&product=course&course=${encodeURIComponent(courseId)}`;
  const finalCancelUrl = cancelUrl ?? `${base}/payment-cancel?session_id={CHECKOUT_SESSION_ID}&product=course&course=${encodeURIComponent(courseId)}`;

  try {
    const res = await fetch(`${API_URL}/api/course-checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        courseId,
        userId: userId || '',
        customerEmail: customerEmail || undefined,
        successUrl: finalSuccessUrl,
        cancelUrl: finalCancelUrl,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || 'Checkout failed' };
    }
    if (data.url) {
      return { success: true, url: data.url };
    }
    return { success: false, error: 'No checkout URL received' };
  } catch (e) {
    return { success: false, error: 'Failed to start checkout' };
  }
}
