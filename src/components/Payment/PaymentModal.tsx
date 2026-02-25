import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Remove stripeAccount so payments go through the platform account
// (the connected account doesn't have card payments enabled for GBP)
// Use environment variable with fallback to hardcoded value for backward compatibility
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(stripePublishableKey);


export type ProductType = 'book' | 'seminar' | 'foundation';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  productType: ProductType;
  onSuccess?: () => void;
}

const PRODUCT_INFO: Record<ProductType, { name: string; price: string; description: string; image?: string }> = {
  book: {
    name: 'Build Wealth Through Property: 7 Reasons Why',
    price: '£19.99',
    description: 'Paperback book by Christopher Ifonlaja',
    image: 'https://d64gsuwffb70l.cloudfront.net/6973e5e8bbb2ae01621a037e_1770743948016_23a5e51b.png',
  },
  seminar: {
    name: 'Property Investment Seminar',
    price: '£25.00',
    description: 'Live seminar (2pm – 5pm) with Christopher Ifonlaja',
  },
  foundation: {
    name: 'Build Wealth Through Property — Foundation Edition',
    price: '£50.00',
    description: 'Limited special-print signed copy supporting our building vision',
    image: 'https://d64gsuwffb70l.cloudfront.net/6973e5e8bbb2ae01621a037e_1771332919433_67a319f6.png',
  },
};

// Inner checkout form rendered inside Elements provider
function CheckoutForm({
  onSuccess,
  onCancel,
  productType,
}: {
  onSuccess: () => void;
  onCancel: () => void;
  productType: ProductType;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      const { error: paymentError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + '/payment-success?product=' + productType,
        },
      });

      if (paymentError) {
        setError(paymentError.message || 'Payment failed. Please try again.');
        setLoading(false);
      }
      // If no error, the user is redirected to return_url
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      setLoading(false);
    }
  };

  const info = PRODUCT_INFO[productType];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Order Summary */}
      <div className="bg-slate-700/30 border border-slate-600/30 rounded-xl p-4 flex items-center gap-4">
        {info.image && (
          <img src={info.image} alt={info.name} className="w-16 h-auto rounded-lg shadow-md" />
        )}
        {!info.image && (
          <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-semibold text-sm truncate">{info.name}</h4>
          <p className="text-slate-400 text-xs">{info.description}</p>
        </div>
        <div className="text-amber-400 font-bold text-lg flex-shrink-0">{info.price}</div>
      </div>

      {/* Stripe Payment Element */}
      <div className="bg-white rounded-xl p-4">
        <PaymentElement
          options={{
            layout: 'tabs',
          }}
        />
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-start gap-2">
          <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl border border-slate-600 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || loading}
          className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Processing...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Pay {info.price}
            </>
          )}
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 text-slate-500 text-xs">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Secured by Stripe. Your payment info is encrypted.
      </div>
    </form>
  );
}

// Main Payment Modal
export default function PaymentModal({ isOpen, onClose, productType, onSuccess }: PaymentModalProps) {
  const [step, setStep] = useState<'info' | 'payment' | 'success'>('info');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep('info');
      setClientSecret(null);
      setError(null);
    }
  }, [isOpen, productType]);

  const handleContinueToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError(null);

    try {
      // Store customer details in sessionStorage so the PaymentSuccess page
      // can retrieve them after Stripe redirect and send the receipt email
      try {
        sessionStorage.setItem('bwtp_checkout_email', email.trim().toLowerCase());
        sessionStorage.setItem('bwtp_checkout_name', name.trim());
        sessionStorage.setItem('bwtp_checkout_product', productType);
      } catch {
        // sessionStorage may be unavailable in some contexts; proceed anyway
      }

      const res = await fetch(`${API_URL}/api/create-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productType,
          email: email.trim().toLowerCase(),
          name: name.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to initialize payment');
      }

      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        setStep('payment');
      } else {
        throw new Error('No client secret received');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const info = PRODUCT_INFO[productType];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-slate-900">
                <path d="M3 21V9L12 3L21 9V21H15V14H9V21H3Z" fill="currentColor" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Secure Checkout</h3>
              <p className="text-slate-400 text-xs">
                {step === 'info' ? 'Step 1 of 2 — Your Details' : 'Step 2 of 2 — Payment'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {step === 'info' && (
            <form onSubmit={handleContinueToPayment} className="space-y-5">
              {/* Product Card */}
              <div className="bg-slate-700/30 border border-slate-600/30 rounded-xl p-5">
                <div className="flex items-center gap-4">
                  {info.image ? (
                    <img src={info.image} alt={info.name} className="w-20 h-auto rounded-lg shadow-md" />
                  ) : (
                    <div className="w-20 h-20 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-10 h-10 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                      </svg>
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="text-white font-bold">{info.name}</h4>
                    <p className="text-slate-400 text-sm mt-1">{info.description}</p>
                    <p className="text-amber-400 font-bold text-2xl mt-2">{info.price}</p>
                  </div>
                </div>
              </div>

              {/* Customer Details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Christopher Ifonlaja"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                  />
                  <p className="text-slate-500 text-xs mt-1.5">Your receipt will be sent to this email.</p>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-start gap-2">
                  <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full px-4 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Preparing checkout...
                  </>
                ) : (
                  <>
                    Continue to Payment
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          )}

          {step === 'payment' && clientSecret && (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: 'stripe',
                  variables: {
                    colorPrimary: '#f59e0b',
                    colorBackground: '#ffffff',
                    colorText: '#1e293b',
                    borderRadius: '12px',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                  },
                },
              }}
            >
              <CheckoutForm
                productType={productType}
                onSuccess={() => {
                  setStep('success');
                  onSuccess?.();
                }}
                onCancel={() => {
                  setStep('info');
                  setClientSecret(null);
                }}
              />
            </Elements>
          )}
        </div>
      </div>
    </div>
  );
}
