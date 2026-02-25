/**
 * Stripe integration for book purchases
 */

const API_URL = import.meta.env.VITE_API_URL || 'https://your-project.vercel.app';

export interface BookCheckoutData {
  name: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  postcode: string;
  quantity: number;
  bookPrice: number;
  orderId?: number | string; // Optional: Supabase order ID
}

export interface CheckoutSessionResult {
  url?: string;
  error?: string;
}

/**
 * Create a Stripe checkout session for book purchase
 */
export async function createBookCheckoutSession(
  data: BookCheckoutData
): Promise<CheckoutSessionResult> {
  try {
    const response = await fetch(`${API_URL}/api/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productType: 'book',
        quantity: data.quantity,
        amount: data.bookPrice * data.quantity,
        currency: 'gbp',
        orderId: data.orderId, // Include order ID to link with session
        customerData: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          shipping: {
            address: {
              line1: data.address,
              city: data.city,
              postal_code: data.postcode,
              country: 'GB',
            },
            name: data.name,
          },
        },
        metadata: {
          productType: 'book',
          quantity: data.quantity.toString(),
          bookPrice: data.bookPrice.toString(),
          customerName: data.name,
          customerEmail: data.email,
        },
        successUrl: `${window.location.origin}/payment-success?product=book&session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/payment-cancel?session_id={CHECKOUT_SESSION_ID}&reason=Payment was cancelled`,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.error) {
      return { error: result.error };
    }

    if (result.url) {
      return { url: result.url };
    }

    return { error: 'No checkout URL received' };
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return {
      error: error.message || 'Failed to create checkout session. Please try again.',
    };
  }
}

export interface FoundationCheckoutData {
  name: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  postcode: string;
  quantity?: number;
  orderId?: string;
}

const FOUNDATION_PRICE = 50;

/**
 * Create a Stripe checkout session for Foundation Edition purchase
 */
export async function createFoundationCheckoutSession(
  data: FoundationCheckoutData
): Promise<CheckoutSessionResult> {
  const quantity = data.quantity ?? 1;
  const totalAmount = FOUNDATION_PRICE * quantity;

  try {
    const response = await fetch(`${API_URL}/api/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productType: 'foundation',
        quantity,
        amount: totalAmount,
        currency: 'gbp',
        orderId: data.orderId,
        customerData: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          shipping: {
            address: {
              line1: data.address,
              city: data.city,
              postal_code: data.postcode,
              country: 'GB',
            },
            name: data.name,
          },
        },
        metadata: {
          productType: 'foundation',
          quantity: quantity.toString(),
          unitPrice: FOUNDATION_PRICE.toString(),
          customerName: data.name,
          customerEmail: data.email,
        },
        successUrl: `${window.location.origin}/payment-success?product=foundation&session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/foundation?cancelled=1`,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.error) {
      return { error: result.error };
    }

    if (result.url) {
      return { url: result.url };
    }

    return { error: 'No checkout URL received' };
  } catch (error: any) {
    console.error('Error creating Foundation checkout session:', error);
    return {
      error: error.message || 'Failed to create checkout session. Please try again.',
    };
  }
}

export { FOUNDATION_PRICE };

export interface SeminarCheckoutData {
  name: string;
  email: string;
  phone?: string;
  quantity?: number;
  orderId?: string;
}

const SEMINAR_PRICE = 25;

/**
 * Create a Stripe checkout session for seminar ticket purchase
 */
export async function createSeminarCheckoutSession(
  data: SeminarCheckoutData
): Promise<CheckoutSessionResult> {
  const quantity = Math.max(1, Math.min(10, data.quantity ?? 1));
  const totalAmount = SEMINAR_PRICE * quantity;
  try {
    const response = await fetch(`${API_URL}/api/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productType: 'seminar',
        quantity,
        amount: totalAmount,
        currency: 'gbp',
        orderId: data.orderId,
        customerData: {
          name: data.name,
          email: data.email,
          phone: data.phone,
        },
        metadata: {
          productType: 'seminar',
          quantity: quantity.toString(),
          customerName: data.name,
          customerEmail: data.email,
        },
        successUrl: `${window.location.origin}/payment-success?product=seminar&session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/payment-cancel?session_id={CHECKOUT_SESSION_ID}&product=seminar&reason=Payment was cancelled`,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.error) {
      return { error: result.error };
    }

    if (result.url) {
      return { url: result.url };
    }

    return { error: 'No checkout URL received' };
  } catch (error: any) {
    console.error('Error creating seminar checkout session:', error);
    return {
      error: error.message || 'Failed to create checkout session. Please try again.',
    };
  }
}

export { SEMINAR_PRICE };

