import React, { useEffect, useState, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  XCircle, 
  AlertTriangle, 
  RefreshCw, 
  Mail,
  ArrowLeft,
  CreditCard,
  CheckCircle2
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const PaymentCancel: React.FC = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const reason = searchParams.get('reason') || 'Payment was cancelled';
  const productType = searchParams.get('product') || 'book';
  const courseId = searchParams.get('course') || '';
  const isCourse = productType === 'course';
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const emailSentRef = useRef(false);

  // Send failure email via backend (avoids Firestore client access - orders require auth, updates are denied)
  useEffect(() => {
    if (emailSentRef.current || !sessionId) return;
    emailSentRef.current = true;

    const sendFailureEmail = async () => {
      try {
        setEmailStatus('sending');
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const response = await fetch(`${API_URL}/api/send-payment-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            type: 'failure',
            productType: productType === 'foundation' ? 'foundation' : productType === 'seminar' ? 'seminar' : productType === 'course' ? 'course' : 'book',
          }),
        });

        const result = await response.json();
        if (result.success) {
          setEmailStatus('sent');
        } else {
          setEmailStatus('error');
        }
      } catch (err) {
        console.error('Error sending failure email:', err);
        setEmailStatus('error');
      }
    };

    const timer = setTimeout(sendFailureEmail, 2000);
    return () => clearTimeout(timer);
  }, [sessionId, productType]);

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />

      <section className="relative pt-16 min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 via-slate-900 to-amber-900/10" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto text-center py-16">
          {/* Cancel Icon */}
          <div className="mb-8 inline-flex items-center justify-center">
            <div className="relative">
              <div className="w-24 h-24 bg-red-500/20 border-2 border-red-500/50 rounded-full flex items-center justify-center">
                <XCircle className="w-12 h-12 text-red-400" />
              </div>
              <div className="absolute -inset-4 bg-red-500/10 rounded-full animate-ping opacity-75" />
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Payment Not Completed
          </h1>

          <p className="text-slate-300 text-lg mb-8 leading-relaxed max-w-lg mx-auto">
            {isCourse
              ? <>Your course payment was not completed. No charges were made.</>
              : productType === 'seminar'
                ? <>Your seminar ticket payment was not completed. No charges were made.</>
                : productType === 'foundation'
                  ? <>Your Foundation Edition payment was not completed. No charges were made.</>
                  : <>Your payment for <span className="text-amber-400 font-semibold">"Build Wealth Through Property"</span> was not completed.</>
            }
          </p>

          {/* Reason Box */}
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 mb-8 max-w-md mx-auto">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="text-red-300 font-medium text-sm mb-2">What happened?</p>
                <p className="text-slate-400 text-sm">{reason}</p>
              </div>
            </div>
          </div>

          {/* Common Issues */}
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 sm:p-8 mb-8 text-left">
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Common Payment Issues
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-red-400 text-xs font-bold">1</span>
                </div>
                <div>
                  <p className="text-slate-300 text-sm font-medium">Insufficient Funds</p>
                  <p className="text-slate-500 text-xs mt-1">Your card may not have enough funds to complete the transaction.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-red-400 text-xs font-bold">2</span>
                </div>
                <div>
                  <p className="text-slate-300 text-sm font-medium">Card Declined</p>
                  <p className="text-slate-500 text-xs mt-1">Your bank may have declined the transaction for security reasons.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-red-400 text-xs font-bold">3</span>
                </div>
                <div>
                  <p className="text-slate-300 text-sm font-medium">Incorrect Details</p>
                  <p className="text-slate-500 text-xs mt-1">Double-check your card number, expiry date, and CVV.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-red-400 text-xs font-bold">4</span>
                </div>
                <div>
                  <p className="text-slate-300 text-sm font-medium">Expired Card</p>
                  <p className="text-slate-500 text-xs mt-1">Make sure your card hasn't expired.</p>
                </div>
              </div>
            </div>
          </div>

          {/* What You Can Do */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 sm:p-8 mb-8 text-left">
            <h3 className="text-amber-400 font-bold text-lg mb-4 flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              What You Can Do
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3.5 h-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-slate-300 text-sm">Try again with the same or a different payment method</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3.5 h-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-slate-300 text-sm">Contact your bank to ensure your card is active and has sufficient funds</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3.5 h-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-slate-300 text-sm">Reach out to us if you need assistance or have questions</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 flex-wrap">
            {isCourse && courseId && (
              <Link
                to={`/dashboard?tab=${encodeURIComponent(courseId)}`}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold px-8 py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-indigo-500/25 inline-flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Dashboard
              </Link>
            )}
            {isCourse && courseId && (
              <Link
                to={courseId === 'masterclass' ? '/masterclass' : '/course'}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-bold px-8 py-3.5 rounded-xl transition-all inline-flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
              </Link>
            )}
            {!isCourse && productType === 'seminar' && (
              <Link
                to="/seminar-purchase"
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-bold px-8 py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/25 inline-flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
              </Link>
            )}
            {!isCourse && productType !== 'seminar' && (
              <Link
                to={productType === 'foundation' ? '/foundation' : '/book-purchase'}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-bold px-8 py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/25 inline-flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
              </Link>
            )}
            <Link
              to="/"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3.5 rounded-xl border border-white/20 transition-all inline-flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </Link>
          </div>

          {/* Email Status */}
          {emailStatus !== 'idle' && (
            <div className="mb-6">
              {emailStatus === 'sending' && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-center gap-3">
                  <svg className="animate-spin w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span className="text-amber-300 text-sm">Sending you helpful information via email...</span>
                </div>
              )}
              {emailStatus === 'sent' && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-emerald-300 text-sm">We've sent you an email with troubleshooting tips and next steps.</span>
                </div>
              )}
              {emailStatus === 'error' && (
                <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4">
                  <p className="text-slate-400 text-sm">
                    We'll send you an email shortly with helpful information. If you don't receive it, please contact us.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Help Section */}
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Mail className="w-5 h-5 text-amber-400" />
              <h3 className="text-white font-semibold">Need Help?</h3>
            </div>
            <p className="text-slate-400 text-sm mb-4">
              If you continue to experience issues or have questions about your payment, we're here to help.
            </p>
            <a
              href="mailto:support@buildwealththroughproperty.com"
              className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-medium text-sm transition-colors"
            >
              <Mail className="w-4 h-4" />
              Contact us at support@buildwealththroughproperty.com
            </a>
          </div>

          {/* Security Note */}
          <p className="text-slate-500 text-xs mt-8 flex items-center justify-center gap-2">
            <CreditCard className="w-4 h-4" />
            Your payment information is secure and encrypted. No charges were made.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PaymentCancel;

