import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { 
  signInWithEmail, 
  signUpWithEmail, 
  signInWithGoogle, 
  resetPassword,
  resendEmailVerification,
  getCurrentUser,
  onAuthStateChange
} from '@/lib/firebaseAuth';
import { User } from 'firebase/auth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

type AuthMode = 'signin' | 'signup' | 'forgot' | 'verify';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [verificationEmailSent, setVerificationEmailSent] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Check URL params for mode
  useEffect(() => {
    const urlMode = searchParams.get('mode') as AuthMode;
    if (urlMode && ['signin', 'signup', 'forgot', 'verify'].includes(urlMode)) {
      setMode(urlMode);
    }
  }, [searchParams]);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChange((currentUser) => {
      setUser(currentUser);
      if (currentUser && currentUser.emailVerified) {
        // Redirect to dashboard if verified
        const redirectTo = searchParams.get('redirect') || '/dashboard';
        navigate(redirectTo);
      } else if (currentUser && !currentUser.emailVerified && mode === 'signin') {
        setMode('verify');
      }
    });
    return () => unsubscribe();
  }, [navigate, searchParams, mode]);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setError(null);
    setMessage(null);
    setVerificationEmailSent(false);
  };

  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode);
    resetForm();
    // Update URL without navigation
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('mode', newMode);
    window.history.replaceState({}, '', newUrl);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const user = await signInWithEmail(email, password);
      
      if (!user.emailVerified) {
        setMode('verify');
        setVerificationEmailSent(false);
        setMessage('Please verify your email address to continue.');
      } else {
        const redirectTo = searchParams.get('redirect') || '/dashboard';
        navigate(redirectTo);
      }
    } catch (err: any) {
      const errorMessage = err.code === 'auth/user-not-found' 
        ? 'No account found with this email address.'
        : err.code === 'auth/wrong-password'
        ? 'Incorrect password. Please try again.'
        : err.code === 'auth/invalid-email'
        ? 'Invalid email address.'
        : err.code === 'auth/too-many-requests'
        ? 'Too many failed attempts. Please try again later.'
        : err.message || 'An error occurred during sign in';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const user = await signUpWithEmail(email, password, fullName);
      setMode('verify');
      setVerificationEmailSent(true);
      setMessage('Account created! Please check your email to verify your account.');
    } catch (err: any) {
      const errorMessage = err.code === 'auth/email-already-in-use'
        ? 'An account with this email already exists.'
        : err.code === 'auth/invalid-email'
        ? 'Invalid email address.'
        : err.code === 'auth/weak-password'
        ? 'Password should be at least 6 characters.'
        : err.message || 'An error occurred during sign up';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      await signInWithGoogle();
      const redirectTo = searchParams.get('redirect') || '/dashboard';
      navigate(redirectTo);
    } catch (err: any) {
      const errorMessage = err.code === 'auth/popup-closed-by-user'
        ? 'Sign in was cancelled.'
        : err.code === 'auth/popup-blocked'
        ? 'Popup was blocked. Please allow popups for this site.'
        : err.message || 'An error occurred during Google sign in';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      await resetPassword(email);
      setMessage('Password reset email sent! Check your inbox and follow the instructions.');
    } catch (err: any) {
      const errorMessage = err.code === 'auth/user-not-found'
        ? 'No account found with this email address.'
        : err.code === 'auth/invalid-email'
        ? 'Invalid email address.'
        : err.message || 'An error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const currentUser = getCurrentUser();
      if (currentUser) {
        await resendEmailVerification(currentUser);
        setVerificationEmailSent(true);
        setMessage('Verification email sent! Please check your inbox.');
      } else {
        setError('Please sign in first to resend verification email.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send verification email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      
      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:py-16 pt-24">
        <div className="w-full max-w-md">
          {/* Auth Card */}
          <div className="relative overflow-hidden bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-2xl">
            {/* Decorative background */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-amber-500/5 pointer-events-none" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10 p-8 sm:p-10">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 mb-6">
                  <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                  <span className="text-amber-400 text-sm font-medium">Build Wealth Through Property</span>
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent mb-2">
                  {mode === 'signin' && 'Welcome Back'}
                  {mode === 'signup' && 'Create Account'}
                  {mode === 'forgot' && 'Reset Password'}
                  {mode === 'verify' && 'Verify Your Email'}
                </h1>
                {mode !== 'verify' && (
                  <p className="text-slate-400 text-sm mt-2">
                    {mode === 'signin' && 'Sign in to access your dashboard and courses'}
                    {mode === 'signup' && 'Join Build Wealth Through Property today'}
                    {mode === 'forgot' && 'We\'ll send you a password reset link'}
                  </p>
                )}
              </div>

              {/* Success Message */}
              {message && (
                <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm flex items-start gap-3">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{message}</span>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-start gap-3">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* Email Verification Screen */}
              {mode === 'verify' && (
                <div className="space-y-6">
                  <div className="p-8 bg-amber-500/10 border border-amber-500/30 rounded-xl text-center">
                    <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">Check Your Email</h3>
                    <p className="text-slate-300 text-sm mb-2">
                      We've sent a verification link to
                    </p>
                    <p className="text-amber-400 font-medium mb-4">{user?.email || email}</p>
                    <p className="text-slate-400 text-xs">
                      Click the link in the email to verify your account. After verifying, you'll be automatically redirected.
                    </p>
                  </div>
                  
                  {!verificationEmailSent && (
                    <button
                      onClick={handleResendVerification}
                      disabled={loading}
                      className="w-full text-amber-400 hover:text-amber-300 text-sm font-medium disabled:opacity-50 transition-colors py-2"
                    >
                      {loading ? 'Sending...' : 'Resend verification email'}
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleModeChange('signin')}
                    className="w-full text-slate-400 hover:text-white text-sm transition-colors py-2"
                  >
                    Back to Sign In
                  </button>
                </div>
              )}

              {/* Sign In Form */}
              {mode === 'signin' && (
                <>
                  {/* Google Sign In Button */}
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full mb-6 flex items-center justify-center gap-3 bg-white hover:bg-slate-50 disabled:bg-slate-200 text-slate-900 font-semibold py-3.5 rounded-xl transition-all border-2 border-transparent hover:border-amber-500/20 shadow-lg"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-slate-800/50 text-slate-400">Or continue with email</span>
                    </div>
                  </div>

                  <form onSubmit={handleSignIn} className="space-y-5">
                    <div>
                      <label className="block text-slate-300 text-sm font-medium mb-2">Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3.5 rounded-xl bg-slate-900/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                        placeholder="you@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 text-sm font-medium mb-2">Password</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        className="w-full px-4 py-3.5 rounded-xl bg-slate-900/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                        placeholder="Enter your password"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleModeChange('forgot')}
                        className="text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:from-amber-500/50 disabled:to-amber-600/50 text-slate-900 font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Signing in...
                        </span>
                      ) : (
                        'Sign In'
                      )}
                    </button>
                  </form>
                </>
              )}

              {/* Sign Up Form */}
              {mode === 'signup' && (
                <>
                  {/* Google Sign In Button */}
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full mb-6 flex items-center justify-center gap-3 bg-white hover:bg-slate-50 disabled:bg-slate-200 text-slate-900 font-semibold py-3.5 rounded-xl transition-all border-2 border-transparent hover:border-amber-500/20 shadow-lg"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-slate-800/50 text-slate-400">Or sign up with email</span>
                    </div>
                  </div>

                  <form onSubmit={handleSignUp} className="space-y-5">
                    <div>
                      <label className="block text-slate-300 text-sm font-medium mb-2">Full Name</label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="w-full px-4 py-3.5 rounded-xl bg-slate-900/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                        placeholder="John Smith"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 text-sm font-medium mb-2">Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3.5 rounded-xl bg-slate-900/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                        placeholder="you@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 text-sm font-medium mb-2">Password</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        className="w-full px-4 py-3.5 rounded-xl bg-slate-900/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                        placeholder="At least 6 characters"
                      />
                      <p className="text-slate-500 text-xs mt-1.5">Must be at least 6 characters</p>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:from-amber-500/50 disabled:to-amber-600/50 text-slate-900 font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Creating account...
                        </span>
                      ) : (
                        'Create Account'
                      )}
                    </button>
                  </form>
                </>
              )}

              {/* Forgot Password Form */}
              {mode === 'forgot' && (
                <form onSubmit={handleForgotPassword} className="space-y-5">
                  <div className="p-5 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                    <p className="text-slate-300 text-sm">
                      Enter your email address and we'll send you a link to reset your password.
                    </p>
                  </div>
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-2">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3.5 rounded-xl bg-slate-900/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                      placeholder="you@example.com"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:from-amber-500/50 disabled:to-amber-600/50 text-slate-900 font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      'Send Reset Link'
                    )}
                  </button>
                </form>
              )}

              {/* Mode Toggle */}
              {mode !== 'verify' && (
                <div className="mt-8 pt-6 border-t border-slate-700 text-center">
                  {mode === 'signin' && (
                    <p className="text-slate-400">
                      Don't have an account?{' '}
                      <button
                        onClick={() => handleModeChange('signup')}
                        className="text-amber-400 font-medium hover:text-amber-300 hover:underline transition-colors"
                      >
                        Sign up
                      </button>
                    </p>
                  )}
                  {mode === 'signup' && (
                    <p className="text-slate-400">
                      Already have an account?{' '}
                      <button
                        onClick={() => handleModeChange('signin')}
                        className="text-amber-400 font-medium hover:text-amber-300 hover:underline transition-colors"
                      >
                        Sign in
                      </button>
                    </p>
                  )}
                  {mode === 'forgot' && (
                    <p className="text-slate-400">
                      Remember your password?{' '}
                      <button
                        onClick={() => handleModeChange('signin')}
                        className="text-amber-400 font-medium hover:text-amber-300 hover:underline transition-colors"
                      >
                        Sign in
                      </button>
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center text-slate-400 text-sm">
            <p>By continuing, you agree to our{' '}
              <Link to="/terms" className="text-amber-400 hover:text-amber-300 hover:underline transition-colors">Terms of Service</Link>
              {' '}and{' '}
              <Link to="/privacy" className="text-amber-400 hover:text-amber-300 hover:underline transition-colors">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Auth;
