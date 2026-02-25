/**
 * Email subscription utilities
 * - subscribeEmailFirestore: Frontend-only, writes directly to Firestore (no backend)
 * - subscribeEmail: Uses backend API (for when Admin SDK / duplicate handling is needed)
 */

import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface EmailSubscription {
  email: string;
  source: string;
  referrer?: string;
  firstName?: string;
  phone?: string;
  subscribed_at: any;
  status: 'subscribed' | 'unsubscribed';
  confirmed: boolean;
}

/**
 * Subscribe an email to Firestore directly (frontend-only, no backend)
 * Use when Firestore security rules allow create (email + source required)
 */
export const subscribeEmailFirestore = async (
  email: string,
  source: string,
  options?: {
    referrer?: string;
    firstName?: string;
    phone?: string;
  }
): Promise<{ success: boolean; message?: string; error?: string }> => {
  try {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      return { success: false, error: 'Invalid email address' };
    }

    if (!source || typeof source !== 'string') {
      return { success: false, error: 'Source is required' };
    }

    const subscriptionsRef = collection(db, 'email_subscriptions');
    await addDoc(subscriptionsRef, {
      email: normalizedEmail,
      source: source,
      referrer: options?.referrer || window.location.href,
      subscribed_at: serverTimestamp(),
      status: 'subscribed',
      confirmed: false,
      ...(options?.firstName && { firstName: options.firstName.trim() }),
      ...(options?.phone && { phone: options.phone.trim() }),
    });

    return {
      success: true,
      message: 'Successfully subscribed!',
    };
  } catch (error: any) {
    console.error('Error subscribing email to Firestore:', error);
    return {
      success: false,
      error: error.message || 'Failed to subscribe. Please try again.',
    };
  }
};

/**
 * Subscribe an email address to the newsletter (backend API)
 * Uses backend endpoint which bypasses Firestore security rules via Admin SDK
 */
export const subscribeEmail = async (
  email: string,
  source: string,
  options?: {
    referrer?: string;
    firstName?: string;
    phone?: string;
  }
): Promise<{ success: boolean; message?: string; error?: string }> => {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    
    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      return { success: false, error: 'Invalid email address' };
    }

    if (!source || typeof source !== 'string') {
      return { success: false, error: 'Source is required' };
    }

    // Call backend API endpoint
    const response = await fetch(`${API_URL}/api/subscribe-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: normalizedEmail,
        source: source,
        referrer: options?.referrer || window.location.href,
        firstName: options?.firstName,
        phone: options?.phone,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to subscribe. Please try again.'
      };
    }

    return {
      success: data.success,
      message: data.message,
      error: data.error
    };
  } catch (error: any) {
    console.error('Error subscribing email:', error);
    return {
      success: false,
      error: error.message || 'Failed to subscribe. Please try again.'
    };
  }
};

