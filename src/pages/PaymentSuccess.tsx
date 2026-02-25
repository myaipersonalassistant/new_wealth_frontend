import React, { useEffect, useState, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AddToCalendarButton from '@/components/AddToCalendarButton';
import { getCourseById } from '@/data/courseData';

type ReceiptStatus = 'sending' | 'sent' | 'error' | 'skipped';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const product = searchParams.get('product') || 'book';
  const courseId = searchParams.get('course') || '';
  const paymentIntent = searchParams.get('payment_intent') || '';
  const redirectStatus = searchParams.get('redirect_status') || '';
  const sessionId = searchParams.get('session_id') || '';
  const [showConfetti, setShowConfetti] = useState(true);
  const [receiptStatus, setReceiptStatus] = useState<ReceiptStatus>('sending');
  const [receiptEmail, setReceiptEmail] = useState<string>('');
  const [orderNumber, setOrderNumber] = useState<string>('');
  const receiptSentRef = useRef(false);
  const isCourse = product === 'course';

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Send receipt email on mount (only once)
  useEffect(() => {
    if (receiptSentRef.current) return;
    receiptSentRef.current = true;

    const sendReceipt = async () => {
      try {
        // Retrieve customer details from sessionStorage or fetch from order
        let email = '';
        let name = '';
        let productType = product;
        let orderId = null;

        try {
          email = sessionStorage.getItem('bwtp_checkout_email') || '';
          name = sessionStorage.getItem('bwtp_checkout_name') || '';
          const storedProduct = sessionStorage.getItem('bwtp_checkout_product');
          if (storedProduct) productType = storedProduct;
        } catch {
          // sessionStorage unavailable
        }

        // For course: verify payment and ensure enrollment exists (fallback if webhook hasn't run)
        if (productType === 'course' && sessionId) {
          try {
            const verifyResponse = await fetch(`${API_BASE}/api/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ sessionId }),
            });
            if (verifyResponse.ok) {
              const verifyResult = await verifyResponse.json();
              if (verifyResult.success) {
                setReceiptEmail(verifyResult.email || '');
                setReceiptStatus('sent'); // Webhook sends confirmation email
                return;
              }
            }
          } catch (err) {
            console.error('Course verify-payment error:', err);
            setReceiptStatus('error');
            return;
          }
        }

        // For book, foundation, and seminar purchases, get order details from backend API
        if ((productType === 'book' || productType === 'foundation' || productType === 'seminar') && sessionId) {
          console.log('Fetching order details from backend API...');
          try {
            const verifyResponse = await fetch(`${API_BASE}/api/verify-payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                sessionId: sessionId,
              }),
            });

            if (verifyResponse.ok) {
              const verifyResult = await verifyResponse.json();
              if (verifyResult.success) {
                email = verifyResult.email || email;
                name = verifyResult.name || name;
                orderId = verifyResult.orderId;
                if (orderId) {
                  setOrderNumber(orderId);
                }
                if (verifyResult.alreadyProcessed) {
                  console.log('Order already processed - webhook worked successfully');
                } else {
                  console.log('Payment verified and order processed via fallback');
                }
              } else {
                console.error('Payment verification failed:', verifyResult.message);
              }
            } else {
              const errorText = await verifyResponse.text();
              console.error('Error verifying payment:', errorText);
            }
          } catch (verifyError) {
            console.error('Error verifying payment:', verifyError);
          }
        }

        // If still no email, try to get it from Stripe session via verify endpoint
        if (!email && sessionId && (productType === 'book' || productType === 'foundation' || productType === 'seminar')) {
          console.log('No email found, attempting to get from Stripe session...');
          try {
            const verifyResponse = await fetch(`${API_BASE}/api/verify-payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                sessionId: sessionId,
              }),
            });

            if (verifyResponse.ok) {
              const verifyResult = await verifyResponse.json();
              if (verifyResult.success && verifyResult.email) {
                email = verifyResult.email;
                name = verifyResult.name || name;
                orderId = verifyResult.orderId;
                if (orderId) {
                  setOrderNumber(orderId);
                }
              }
            }
          } catch (err) {
            console.error('Error getting email from Stripe:', err);
          }
        }

        if (!email) {
          console.log('No customer email found — cannot send receipt');
          setReceiptStatus('error');
          return;
        }

        setReceiptEmail(email);

        // Only send receipt if payment was successful
        if (redirectStatus && redirectStatus !== 'succeeded') {
          console.log('Payment redirect status is not succeeded:', redirectStatus);
          setReceiptStatus('skipped');
          return;
        }

        // For book, foundation, and seminar purchases, use the backend email API
        if (productType === 'book' || productType === 'foundation' || productType === 'seminar') {
          try {
            const response = await fetch(`${API_BASE}/api/send-payment-email`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                sessionId: sessionId || null,
                email,
                type: 'success',
                productType,
              }),
            });

            const result = await response.json();

            if (result.success) {
              setOrderNumber(result.orderId || orderId || '');
              setReceiptStatus('sent');

              try {
                sessionStorage.removeItem('bwtp_checkout_email');
                sessionStorage.removeItem('bwtp_checkout_name');
                sessionStorage.removeItem('bwtp_checkout_product');
                sessionStorage.removeItem('pending_order_id');
              } catch {
                // ignore
              }
            } else {
              console.error('Backup email send failed:', result.error);
              setReceiptStatus('error');
            }
          } catch (fetchError) {
            console.error('Error calling backup email API:', fetchError);
            setReceiptStatus('error');
          }
        } else {
          // For seminar and other products, use backend
          try {
            const response = await fetch(`${API_BASE}/api/send-payment-email`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'success',
                email,
                name,
                productType,
                transactionId: paymentIntent,
                amount: productType === 'seminar' ? '25.00' : undefined,
              }),
            });
            const result = await response.json();
            if (result.success || result.skipped) {
              setReceiptStatus('sent');
              try {
                sessionStorage.removeItem('bwtp_checkout_email');
                sessionStorage.removeItem('bwtp_checkout_name');
                sessionStorage.removeItem('bwtp_checkout_product');
              } catch { /* ignore */ }
            } else {
              setReceiptStatus('error');
            }
          } catch {
            setReceiptStatus('error');
          }
        }
      } catch (err) {
        console.error('Receipt send exception:', err);
        setReceiptStatus('error');
      }
    };

    sendReceipt();
  }, [product, sessionId, paymentIntent, redirectStatus]);

  const isBook = product === 'book';
  const isSeminar = product === 'seminar';
  const isFoundation = product === 'foundation';
  const courseTitle = (courseId && getCourseById(courseId))?.title || 'Your Course';

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />

      <section className="relative pt-16 min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-900/10 via-slate-900 to-emerald-900/10" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto text-center py-16">
          {/* Success Icon */}
          <div className="mb-8 inline-flex items-center justify-center">
            <div className="relative">
              <div className="w-24 h-24 bg-emerald-500/20 border-2 border-emerald-500/50 rounded-full flex items-center justify-center animate-pulse">
                <svg className="w-12 h-12 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              {showConfetti && (
                <div className="absolute -inset-8 pointer-events-none">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 rounded-full animate-ping"
                      style={{
                        backgroundColor: ['#f59e0b', '#10b981', '#6366f1', '#f43f5e'][i % 4],
                        top: `${20 + Math.sin(i * 30 * Math.PI / 180) * 40}%`,
                        left: `${50 + Math.cos(i * 30 * Math.PI / 180) * 40}%`,
                        animationDelay: `${i * 0.1}s`,
                        animationDuration: '1.5s',
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Payment Successful!
          </h1>

          <p className="text-slate-300 text-lg mb-8 leading-relaxed max-w-lg mx-auto">
            {isBook && (
              <>Thank you for purchasing <span className="text-amber-400 font-semibold">"Build Wealth Through Property: 7 Reasons Why"</span>.</>
            )}
            {isSeminar && (
              <>Thank you for booking the <span className="text-amber-400 font-semibold">Property Investment Seminar</span>.</>
            )}
            {isFoundation && (
              <>Thank you for purchasing the <span className="text-amber-400 font-semibold">Foundation Edition</span>. Your support means the world to us.</>
            )}
            {isCourse && (
              <>You&apos;re enrolled! <span className="text-amber-400 font-semibold">{courseTitle}</span> is now unlocked in your dashboard.</>
            )}
          </p>

          {/* Receipt / Confirmation Status */}
          <div className="mb-8">
            {isCourse && receiptStatus === 'sending' && (
              <div className="inline-flex items-center gap-3 bg-slate-800/60 border border-slate-700/50 rounded-xl px-5 py-3">
                <svg className="animate-spin w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span className="text-slate-300 text-sm">Confirming your enrollment...</span>
              </div>
            )}
            {isCourse && receiptStatus === 'sent' && (
              <div className="inline-flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-5 py-3">
                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-left">
                  <span className="text-emerald-300 text-sm font-medium block">Confirmation sent to {receiptEmail || 'your email'}</span>
                  <span className="text-emerald-400/70 text-xs">Your course is ready in the dashboard</span>
                </div>
              </div>
            )}
            {receiptStatus === 'sending' && !isCourse && (
              <div className="inline-flex items-center gap-3 bg-slate-800/60 border border-slate-700/50 rounded-xl px-5 py-3">
                <svg className="animate-spin w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span className="text-slate-300 text-sm">Sending your receipt email...</span>
              </div>
            )}
            {receiptStatus === 'sent' && (
              <div className="inline-flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-5 py-3">
                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div className="text-left">
                  <span className="text-emerald-300 text-sm font-medium block">Receipt sent to {receiptEmail}</span>
                  {orderNumber && (
                    <span className="text-emerald-400/70 text-xs">Order: {orderNumber}</span>
                  )}
                </div>
              </div>
            )}
            {receiptStatus === 'error' && (
              <div className="inline-flex items-center gap-3 bg-amber-500/10 border border-amber-500/30 rounded-xl px-5 py-3">
                <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-left">
                  <span className="text-amber-300 text-sm font-medium block">Receipt email couldn't be sent</span>
                  <span className="text-slate-400 text-xs">Your payment was still successful. Contact us if you need a receipt.</span>
                </div>
              </div>
            )}
            {receiptStatus === 'skipped' && (
              <div className="inline-flex items-center gap-3 bg-amber-500/10 border border-amber-500/30 rounded-xl px-5 py-3">
                <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-amber-300 text-sm">
                  Receipt email will be sent automatically. If you don't receive it, contact us at <a href="mailto:support@buildwealththroughproperty.com" className="text-amber-400 hover:text-amber-300 underline">support@buildwealththroughproperty.com</a>
                </span>
              </div>
            )}
          </div>

          {/* Seminar: Add to Calendar */}
          {isSeminar && (
            <div className="mb-8">
              <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 max-w-md mx-auto">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h3 className="text-white font-bold">Save the Date</h3>
                </div>
                <div className="space-y-2 mb-4 text-sm">
                  <p className="text-slate-300">
                    <span className="text-amber-400 font-medium">Date:</span> Saturday, 14 March 2026
                  </p>
                  <p className="text-slate-300">
                    <span className="text-emerald-400 font-medium">Time:</span> 2:00 PM – 5:00 PM GMT
                  </p>
                  <p className="text-slate-300">
                    <span className="text-indigo-400 font-medium">Venue:</span> Europa Hotel, Great Victoria St, Belfast BT2 7AP
                  </p>
                </div>
                <AddToCalendarButton variant="primary" className="w-full" />
              </div>
            </div>
          )}

          {/* Foundation: Thank You Message */}
          {isFoundation && (
            <div className="mb-8">
              <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-2xl p-6 max-w-md mx-auto text-left">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <h3 className="text-amber-400 font-bold">Thank You for Supporting the Vision</h3>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Your Foundation Edition purchase directly contributes to our building fund. Every copy sold helps us expand our mission to make property investment education accessible to everyone. Your signed special-print copy will be carefully prepared and dispatched.
                </p>
              </div>
            </div>
          )}

          {/* What's Next */}
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 sm:p-8 mb-8 text-left">
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              What's Next?
            </h3>
            <div className="space-y-3">
              {isBook && (
                <>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-emerald-400 text-xs font-bold">1</span>
                    </div>
                    <p className="text-slate-300 text-sm">Check your email for the order confirmation and receipt. {receiptStatus === 'sent' && receiptEmail && `Sent to ${receiptEmail}`}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-emerald-400 text-xs font-bold">2</span>
                    </div>
                    <p className="text-slate-300 text-sm">Your book will be dispatched within 1–3 business days to your shipping address.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-emerald-400 text-xs font-bold">3</span>
                    </div>
                    <p className="text-slate-300 text-sm">You'll receive a shipping notification with tracking details via email.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-emerald-400 text-xs font-bold">4</span>
                    </div>
                    <p className="text-slate-300 text-sm">While you wait, explore the free starter pack and investment calculator.</p>
                  </div>
                  {orderNumber && (
                    <div className="mt-4 pt-4 border-t border-slate-700">
                      <p className="text-slate-400 text-xs">
                        Order Number: <span className="text-amber-400 font-mono">{orderNumber}</span>
                      </p>
                    </div>
                  )}
                </>
              )}
              {isSeminar && (
                <>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-emerald-400 text-xs font-bold">1</span>
                    </div>
                    <p className="text-slate-300 text-sm">Check your email for the seminar ticket and confirmation receipt.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-emerald-400 text-xs font-bold">2</span>
                    </div>
                    <p className="text-slate-300 text-sm">Add the event to your calendar using the button above so you don't miss it.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-emerald-400 text-xs font-bold">3</span>
                    </div>
                    <p className="text-slate-300 text-sm">You'll receive joining instructions and the full schedule closer to the event date.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-emerald-400 text-xs font-bold">4</span>
                    </div>
                    <p className="text-slate-300 text-sm">Prepare any questions you'd like to ask during the interactive Q&A sessions.</p>
                  </div>
                </>
              )}
              {isFoundation && (
                <>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-emerald-400 text-xs font-bold">1</span>
                    </div>
                    <p className="text-slate-300 text-sm">Check your email for your order confirmation and Foundation Edition receipt.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-emerald-400 text-xs font-bold">2</span>
                    </div>
                    <p className="text-slate-300 text-sm">Your signed special-print copy will be carefully prepared and dispatched.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-emerald-400 text-xs font-bold">3</span>
                    </div>
                    <p className="text-slate-300 text-sm">You'll receive a shipping notification with tracking details via email.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-emerald-400 text-xs font-bold">4</span>
                    </div>
                    <p className="text-slate-300 text-sm">While you wait, explore the free starter pack and investment calculator.</p>
                  </div>
                </>
              )}
              {isCourse && (
                <>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-emerald-400 text-xs font-bold">1</span>
                    </div>
                    <p className="text-slate-300 text-sm">Check your email for the enrollment confirmation and receipt.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-emerald-400 text-xs font-bold">2</span>
                    </div>
                    <p className="text-slate-300 text-sm">Head to your dashboard — your course is unlocked and ready to start.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-emerald-400 text-xs font-bold">3</span>
                    </div>
                    <p className="text-slate-300 text-sm">Work through the modules at your own pace and track your progress.</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
            {isCourse && courseId && (
              <Link
                to={`/dashboard?tab=${encodeURIComponent(courseId)}`}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold px-8 py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-indigo-500/25 inline-flex items-center justify-center gap-2 order-first"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Go to Dashboard — Start Learning
              </Link>
            )}
            <Link
              to="/"
              className={`bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-8 py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/25 inline-flex items-center justify-center gap-2 ${isCourse ? '' : 'order-first'}`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Back to Home
            </Link>
            <Link
              to="/start"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3.5 rounded-xl border border-white/20 transition-all inline-flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Free Starter Pack
            </Link>
            {isSeminar && (
              <Link
                to="/seminar"
                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3.5 rounded-xl border border-white/20 transition-all inline-flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
                Seminar Details
              </Link>
            )}
            {isFoundation && (
              <Link
                to="/foundation"
                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3.5 rounded-xl border border-white/20 transition-all inline-flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Foundation Edition
              </Link>
            )}
          </div>

          {/* Contact info */}
          <p className="text-slate-500 text-sm mt-8">
            Questions? Email{' '}
            <a href="mailto:support@buildwealththroughproperty.com" className="text-amber-400 hover:text-amber-300 underline">
              support@buildwealththroughproperty.com
            </a>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PaymentSuccess;
