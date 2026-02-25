import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  MapPin,
  Calendar,
  Clock,
  Users,
  Loader2,
  Ticket,
  User,
  Mail,
  Phone,
  Shield,
  Lock,
} from 'lucide-react';
import { createSeminarCheckoutSession, SEMINAR_PRICE } from '@/lib/stripe';
import { db } from '@/lib/firebase';
import type { User as FirebaseUser } from 'firebase/auth';
import { getCurrentUser, onAuthStateChange, getUserProfile } from '@/lib/firebaseAuth';
import { collection, addDoc } from 'firebase/firestore';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const SeminarPurchase: React.FC = () => {
  const [quantity, setQuantity] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const total = quantity * SEMINAR_PRICE;

  // Auto-fill name and email when user is logged in
  useEffect(() => {
    const fillFromUser = (email: string | null, name: string | null) => {
      setFormData((prev) => ({
        ...prev,
        ...(email && !prev.email && { email }),
        ...(name && !prev.name && { name }),
      }));
    };

    const handleAuth = async (user: FirebaseUser | null) => {
      if (!user?.email) return;
      let name = user.displayName || null;
      try {
        const profile = await getUserProfile(user.uid);
        if (profile?.full_name) name = profile.full_name;
      } catch {
        // ignore
      }
      fillFromUser(user.email, name);
    };

    const unsubscribe = onAuthStateChange(handleAuth);
    const currentUser = getCurrentUser();
    if (currentUser) handleAuth(currentUser);

    return () => unsubscribe();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('Please enter your full name');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Please enter your email address');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      let orderData: { id: string } | null = null;
      try {
        const orderRef = await addDoc(collection(db, 'seminar_orders'), {
          customer_name: formData.name.trim(),
          customer_email: formData.email.trim().toLowerCase(),
          customer_phone: formData.phone.trim() || null,
          quantity,
          unit_price: SEMINAR_PRICE,
          total_amount: total,
          status: 'pending',
          created_at: new Date(),
          updated_at: new Date(),
        });
        orderData = { id: orderRef.id };
      } catch (orderError: unknown) {
        console.error('Error saving order:', orderError);
        const msg = orderError instanceof Error ? orderError.message : 'Unknown error';
        setError(`Could not save your details: ${msg}. Payment may still proceed.`);
      }

      const result = await createSeminarCheckoutSession({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        quantity,
        orderId: orderData?.id,
      });

      if (result.error) {
        throw new Error(result.error);
      }

      if (result.url) {
        try {
          sessionStorage.setItem('bwtp_checkout_email', formData.email.trim());
          sessionStorage.setItem('bwtp_checkout_name', formData.name.trim());
          sessionStorage.setItem('bwtp_checkout_product', 'seminar');
        } catch {
          // ignore
        }
        window.location.href = result.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(message);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />

      <main className="pt-16 pb-12">
        <div className="max-w-6xl mt-10 mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/seminar"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-amber-400 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Seminar</span>
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Event Info (Booking-style, dark) */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700/50 shadow-2xl shadow-black/20">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-14 h-14 bg-amber-500 rounded-xl flex items-center justify-center">
                      <Ticket className="w-7 h-7 text-slate-900" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Book Your Seat</h2>
                      <p className="text-slate-300 text-sm">Property Investment Seminar</p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs">Date</p>
                        <p className="font-semibold text-white">Saturday, 14 March 2026</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs">Time</p>
                        <p className="font-semibold text-white">2:00 PM – 5:00 PM</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs">Venue</p>
                        <p className="font-semibold text-white text-sm">Europa Hotel, Great Victoria Street, Belfast BT2 7AP</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Users className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs">Price</p>
                        <p className="font-semibold text-white">£{SEMINAR_PRICE} per ticket</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-700">
                    <div className="flex items-start gap-3 text-slate-300 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <p>Full 3-hour property wealth seminar</p>
                    </div>
                    <div className="flex items-start gap-3 text-slate-300 text-sm mt-3">
                      <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <p>Expert panel discussion</p>
                    </div>
                    <div className="flex items-start gap-3 text-slate-300 text-sm mt-3">
                      <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <p>Live Q&A with Christopher Ifonlaja</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Booking Form */}
            <div className="lg:col-span-2">
              <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl p-8 sm:p-10 shadow-xl">
                <div className="mb-8">
                  <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                    Complete Your Booking
                  </h1>
                  <p className="text-slate-400">
                    Fill in your details below to secure your seat{quantity > 1 ? 's' : ''} at the seminar
                  </p>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <form onSubmit={handlePurchase} className="space-y-6">
                  {/* Ticket Quantity */}
                  <div className="bg-amber-500/10 rounded-xl p-6 border border-amber-500/20">
                    <label className="block text-sm font-semibold text-white mb-4">
                      Number of Tickets
                    </label>
                    <div className="flex items-center gap-6">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={isProcessing}
                        className="w-12 h-12 rounded-xl bg-slate-700/80 text-white font-bold hover:bg-amber-500/20 border border-amber-500/30 transition-colors disabled:opacity-50"
                      >
                        −
                      </button>
                      <div className="flex-1 text-center">
                        <div className="text-4xl font-bold text-white mb-1">{quantity}</div>
                        <div className="text-sm text-slate-400">@ £{SEMINAR_PRICE} each</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.min(10, quantity + 1))}
                        disabled={isProcessing}
                        className="w-12 h-12 rounded-xl bg-slate-700/80 text-white font-bold hover:bg-amber-500/20 border border-amber-500/30 transition-colors disabled:opacity-50"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Contact Details */}
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          disabled={isProcessing}
                          className="w-full pl-12 pr-4 py-3.5 border-2 border-slate-700 bg-slate-900/50 text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder-slate-500 disabled:opacity-60"
                          placeholder="John Smith"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">
                        Email Address <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={isProcessing}
                          className="w-full pl-12 pr-4 py-3.5 border-2 border-slate-700 bg-slate-900/50 text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder-slate-500 disabled:opacity-60"
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1.5">Confirmation will be sent to this email</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">
                        Phone Number <span className="text-slate-500 text-xs font-normal">(optional)</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          disabled={isProcessing}
                          className="w-full pl-12 pr-4 py-3.5 border-2 border-slate-700 bg-slate-900/50 text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder-slate-500 disabled:opacity-60"
                          placeholder="+44 7700 900000"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-slate-900/50 rounded-xl p-6 border-2 border-slate-700">
                    <h3 className="font-semibold text-white mb-4">Order Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Seminar Tickets ({quantity}x)</span>
                        <span className="font-semibold text-white">£{total}.00</span>
                      </div>
                      <div className="pt-3 border-t-2 border-slate-700 flex justify-between items-center">
                        <span className="text-lg font-bold text-white">Total</span>
                        <span className="text-2xl font-bold text-amber-400">£{total}.00</span>
                      </div>
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="flex items-start gap-3 bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
                    <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-200">
                      <p className="font-semibold text-blue-100 mb-1">Secure Payment</p>
                      <p>Your payment is processed securely through Stripe. We never store your card details.</p>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 rounded-xl font-semibold text-lg hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/25 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Redirecting to checkout...
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5" />
                        <CreditCard className="w-5 h-5" />
                        Proceed to Secure Payment — £{total}.00
                      </>
                    )}
                  </button>

                  <p className="text-xs text-slate-500 text-center">
                    By proceeding, you agree to our terms of service. Tickets are non-refundable but transferable.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SeminarPurchase;
