import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  Package,
  Heart,
  Loader2
} from 'lucide-react';
import { createBookCheckoutSession } from '@/lib/stripe';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const BookPurchase: React.FC = () => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postcode: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const bookPrice = 19.99;
  const bookSubtotal = bookPrice * quantity;
  const total = bookSubtotal;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    if (!formData.address.trim()) {
      setError('Please enter your address');
      return false;
    }
    if (!formData.city.trim()) {
      setError('Please enter your city');
      return false;
    }
    if (!formData.postcode.trim()) {
      setError('Please enter your postcode');
      return false;
    }
    return true;
  };

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Store order data in Firestore before checkout
      let orderData = null;
      try {
        const orderRef = await addDoc(collection(db, 'book_orders'), {
          customer_name: formData.name.trim(),
          customer_email: formData.email.trim().toLowerCase(),
          customer_phone: formData.phone.trim() || null,
          shipping_address: formData.address.trim(),
          shipping_city: formData.city.trim(),
          shipping_postcode: formData.postcode.trim(),
          quantity: quantity,
          unit_price: bookPrice,
          total_amount: total,
          status: 'pending',
          created_at: new Date(),
          updated_at: new Date(),
        });
        orderData = { id: orderRef.id };
        console.log('Order created in Firestore:', orderRef.id);
      } catch (orderError: any) {
        console.error('Error saving order:', orderError);
        console.error('Order error details:', JSON.stringify(orderError, null, 2));
        // Show error to user but continue - order will be created by webhook/verification
        setError(`Warning: Could not save order details. Error: ${orderError.message}. Payment will still be processed.`);
        // Don't return - continue with checkout
      }

      // Create Stripe checkout session (pass order ID if available)
      const result = await createBookCheckoutSession({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        address: formData.address.trim(),
        city: formData.city.trim(),
        postcode: formData.postcode.trim(),
        quantity: quantity,
        bookPrice: bookPrice,
        orderId: orderData?.id, // Pass order ID to link with session
      });

      if (result.error) {
        throw new Error(result.error);
      }

      if (result.url) {
        // Store order ID in sessionStorage for webhook to update
        if (orderData?.id) {
          sessionStorage.setItem('pending_order_id', orderData.id.toString());
        }
        window.location.href = result.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      
      <main className="pt-16 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-amber-400 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Book Info */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-8">
                  <div className="text-center mb-6">
                    <div className="w-32 h-48 mx-auto mb-4 rounded-xl shadow-2xl overflow-hidden">
                      <img 
                        src="https://d64gsuwffb70l.cloudfront.net/6973e5e8bbb2ae01621a037e_1770743948016_23a5e51b.png"
                        alt="Build Wealth Through Property Book"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">
                      Build Wealth Through Property
                    </h2>
                    <p className="text-amber-400 font-semibold text-sm">7 Reasons Why</p>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-3 text-slate-300 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <p>Comprehensive guide to property investment</p>
                    </div>
                    <div className="flex items-start gap-3 text-slate-300 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <p>Real-life experience and practical insights</p>
                    </div>
                    <div className="flex items-start gap-3 text-slate-300 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <p>7 core principles explained in detail</p>
                    </div>
                  </div>

                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <Heart className="w-5 h-5 text-rose-400" />
                      <div>
                        <p className="font-semibold text-white text-sm">100% Charity</p>
                        <p className="text-xs text-slate-400">All proceeds support Place of Victory Charity</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Purchase Form */}
            <div className="lg:col-span-2">
              <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-8 sm:p-10">
                <div className="mb-8">
                  <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                    Purchase the Book
                  </h1>
                  <p className="text-slate-400">
                    Order a physical copy with UK shipping. All proceeds go to Place of Victory Charity.
                  </p>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <form onSubmit={handleOrder} className="space-y-6">
                  {/* Quantity */}
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                    <label className="block text-sm font-semibold text-white mb-3">
                      Quantity <span className="text-red-400">*</span>
                    </label>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 bg-slate-700 border-2 border-amber-500/30 rounded-lg font-semibold text-amber-400 hover:bg-slate-600 transition-all"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min="1"
                        max="99"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-16 px-3 py-2 text-center border-2 border-amber-500/30 rounded-lg font-semibold text-lg bg-slate-700 text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.min(99, quantity + 1))}
                        className="w-10 h-10 bg-slate-700 border-2 border-amber-500/30 rounded-lg font-semibold text-amber-400 hover:bg-slate-600 transition-all"
                      >
                        +
                      </button>
                      <span className="text-slate-300">Books @ £{bookPrice.toFixed(2)} each</span>
                    </div>
                  </div>

                  {/* Customer Details */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-slate-700 bg-slate-900/50 text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder-slate-500"
                        placeholder="John Smith"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">
                        Email <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-slate-700 bg-slate-900/50 text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder-slate-500"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-slate-700 bg-slate-900/50 text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder-slate-500"
                      placeholder="+44 7700 900000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Address <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-slate-700 bg-slate-900/50 text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder-slate-500"
                      placeholder="123 Main Street"
                      required
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">
                        City <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-slate-700 bg-slate-900/50 text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder-slate-500"
                        placeholder="London"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">
                        Postcode <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="postcode"
                        value={formData.postcode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-slate-700 bg-slate-900/50 text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder-slate-500"
                        placeholder="SW1A 1AA"
                        required
                      />
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-400">{quantity}x Book @ £{bookPrice.toFixed(2)}</span>
                      <span className="font-semibold text-white">£{bookSubtotal.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-slate-500 mb-2">100% of book proceeds go to charity</p>
                    <div className="pt-2 border-t border-slate-700 flex justify-between items-center">
                      <span className="font-bold text-white">Total</span>
                      <span className="text-xl font-bold text-amber-400">£{total.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 rounded-xl font-semibold text-lg transition-all shadow-lg shadow-amber-500/25 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Redirecting to checkout...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        Proceed to Payment — £{total.toFixed(2)}
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-8 bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
                  <p className="text-sm text-blue-300">
                    <strong>Note:</strong> You can also purchase the book at the event on Saturday, 14 March 2026. 
                    All proceeds from event sales go directly to Place of Victory Charity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookPurchase;
