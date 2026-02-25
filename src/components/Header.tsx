import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { onAuthStateChange, signOutUser, getUserProfile, ensureUserProfile, type UserProfile } from '@/lib/firebaseAuth';
import type { User } from 'firebase/auth';

interface HeaderProps {
  onSignInClick?: () => void;
  user?: User | null;
  /** If true, header manages its own auth state internally */
  manageAuth?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onSignInClick, user: externalUser, manageAuth = true }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [internalUser, setInternalUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null);

  const user = manageAuth ? internalUser : externalUser ?? null;

  // Manage auth internally if needed
  useEffect(() => {
    if (!manageAuth) return;
    
    const unsubscribe = onAuthStateChange((user) => {
      setInternalUser(user);
      if (user) {
        fetchUserProfile(user);
      } else {
        setUserProfile(null);
      }
    });
    
    return () => unsubscribe();
  }, [manageAuth]);

  // If external user provided, fetch profile
  useEffect(() => {
    if (!manageAuth && externalUser) {
      fetchUserProfile(externalUser);
    }
  }, [manageAuth, externalUser]);

  const fetchUserProfile = async (authUser: User) => {
    try {
      let profile = await getUserProfile(authUser.uid);
      if (!profile) {
        await ensureUserProfile(authUser);
        profile = await getUserProfile(authUser.uid);
      }
      if (profile) {
        setUserProfile(profile);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleSignOut = async () => {
    await signOutUser();
    setShowUserMenu(false);
  };

  const handleSignInClick = () => {
    if (onSignInClick) {
      onSignInClick();
    } else {
      // Navigate to auth page instead of modal for better UX
      const currentPath = location.pathname;
      navigate(`/auth?redirect=${encodeURIComponent(currentPath)}`);
    }
  };

  const getDisplayName = () => {
    if (userProfile?.full_name) return userProfile.full_name.split(' ')[0];
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  const getInitials = () => {
    if (userProfile?.full_name) {
      const names = userProfile.full_name.split(' ');
      return names.map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (user?.email) return user.email[0].toUpperCase();
    return 'U';
  };

  const isAdmin = userProfile?.role === 'admin';

  const scrollToSection = (id: string) => {
    if (location.pathname !== '/') {
      window.location.href = `/#${id}`;
      return;
    }
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileSubmenu(null);
    setOpenDropdown(null);
  }, [location.pathname]);

  return (
    <header role="banner">
      <a href="#main-content" className="absolute left-[-9999px] top-4 z-[100] px-4 py-2 bg-amber-500 text-slate-900 rounded-lg font-medium focus:left-4 focus:outline-none focus:ring-2 focus:ring-amber-400">
        Skip to main content
      </a>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 sm:w-6 sm:h-6 text-slate-900">
                  <path d="M3 21V9L12 3L21 9V21H15V14H9V21H3Z" fill="currentColor" />
                </svg>
              </div>
              <span className="text-lg sm:text-xl font-bold text-white">Build Wealth Through Property</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {/* The Book Dropdown */}
              <div className="relative" onMouseEnter={() => setOpenDropdown('book')} onMouseLeave={() => setOpenDropdown(null)}>
                <button className="flex items-center gap-1.5 text-slate-300 hover:text-amber-400 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-slate-800/50">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  The Book
                  <svg className={`w-3.5 h-3.5 transition-transform ${openDropdown === 'book' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openDropdown === 'book' && (
                  <>
                    {/* Invisible bridge to prevent gap */}
                    <div className="absolute top-full left-0 w-56 h-1" />
                    <div className="absolute top-full left-0 mt-1 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden py-1">
                      <button onClick={() => { scrollToSection('benefits'); setOpenDropdown(null); }} className="w-full px-4 py-2.5 text-left text-slate-300 hover:bg-slate-700 hover:text-amber-400 transition-colors flex items-center gap-3">
                      <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      Benefits
                    </button>
                    <button onClick={() => { scrollToSection('about-book'); setOpenDropdown(null); }} className="w-full px-4 py-2.5 text-left text-slate-300 hover:bg-slate-700 hover:text-amber-400 transition-colors flex items-center gap-3">
                      <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      About the Book
                    </button>
                    <button onClick={() => { scrollToSection('author'); setOpenDropdown(null); }} className="w-full px-4 py-2.5 text-left text-slate-300 hover:bg-slate-700 hover:text-amber-400 transition-colors flex items-center gap-3">
                      <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      About the Author
                    </button>
                    <div className="h-px bg-slate-700 my-1" />
                    <button onClick={() => { scrollToSection('get-book'); setOpenDropdown(null); }} className="w-full px-4 py-2.5 text-left text-amber-400 hover:bg-slate-700 font-medium transition-colors flex items-center gap-3">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
                      Buy the Book
                    </button>
                    </div>
                  </>
                )}
              </div>

              {/* Courses Dropdown */}
              <div className="relative" onMouseEnter={() => setOpenDropdown('courses')} onMouseLeave={() => setOpenDropdown(null)}>
                <button className="flex items-center gap-1.5 text-slate-300 hover:text-amber-400 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-slate-800/50">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Courses
                  <svg className={`w-3.5 h-3.5 transition-transform ${openDropdown === 'courses' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openDropdown === 'courses' && (
                  <>
                    {/* Invisible bridge to prevent gap */}
                    <div className="absolute top-full left-0 w-72 h-1" />
                    <div className="absolute top-full left-0 mt-1 w-72 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden py-1">
                      <Link to="/course" onClick={() => setOpenDropdown(null)} className="w-full px-4 py-3 text-left text-slate-300 hover:bg-slate-700 hover:text-indigo-400 transition-colors flex items-start gap-3">
                      <svg className="w-5 h-5 mt-0.5 text-indigo-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                      <div><span className="font-medium block">Beginners</span><span className="text-slate-500 text-sm">From Book to Buy-to-Let course</span></div>
                    </Link>
                    <Link to="/masterclass" onClick={() => setOpenDropdown(null)} className="w-full px-4 py-3 text-left text-slate-300 hover:bg-slate-700 hover:text-amber-400 transition-colors flex items-start gap-3">
                      <svg className="w-5 h-5 mt-0.5 text-amber-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                      <div><span className="font-medium block">Masterclass</span><span className="text-slate-500 text-sm">Property Investor Masterclass</span></div>
                    </Link>
                    <Link to="/seminar" onClick={() => setOpenDropdown(null)} className="w-full px-4 py-3 text-left text-slate-300 hover:bg-slate-700 hover:text-emerald-400 transition-colors flex items-start gap-3">
                      <svg className="w-5 h-5 mt-0.5 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      <div><span className="font-medium block">Seminar</span><span className="text-slate-500 text-sm">Live Property Seminar</span></div>
                    </Link>
                    </div>
                  </>
                )}
              </div>

              {/* Resources Dropdown */}
              <div className="relative" onMouseEnter={() => setOpenDropdown('resources')} onMouseLeave={() => setOpenDropdown(null)}>
                <button className="flex items-center gap-1.5 text-slate-300 hover:text-amber-400 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-slate-800/50">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Resources
                  <svg className={`w-3.5 h-3.5 transition-transform ${openDropdown === 'resources' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openDropdown === 'resources' && (
                  <>
                    {/* Invisible bridge to prevent gap */}
                    <div className="absolute top-full left-0 w-64 h-1" />
                    <div className="absolute top-full left-0 mt-1 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden py-1">
                      <Link to="/start" onClick={() => setOpenDropdown(null)} className="w-full px-4 py-2.5 text-left text-slate-300 hover:bg-slate-700 hover:text-amber-400 transition-colors flex items-center gap-3">
                      <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                      Free Starter Pack
                    </Link>
                    <Link to="/calculator" onClick={() => setOpenDropdown(null)} className="w-full px-4 py-2.5 text-left text-slate-300 hover:bg-slate-700 hover:text-amber-400 transition-colors flex items-center gap-3">
                      <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                      Investment Calculator
                    </Link>
                    <Link to="/blog" onClick={() => setOpenDropdown(null)} className="w-full px-4 py-2.5 text-left text-slate-300 hover:bg-slate-700 hover:text-amber-400 transition-colors flex items-center gap-3">
                      <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                      Blog
                    </Link>
                    <Link to="/foundation" onClick={() => setOpenDropdown(null)} className="w-full px-4 py-2.5 text-left text-slate-300 hover:bg-slate-700 hover:text-amber-400 transition-colors flex items-center gap-3">
                      <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                      Foundation Edition
                    </Link>
                    </div>
                  </>
                )}
              </div>

              {/* Admin Portal — visible only to admins */}
              {user && isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 text-amber-400/90 hover:text-amber-400 hover:bg-amber-500/10 transition-colors font-medium px-4 py-2 rounded-lg"
                  title="Admin Portal"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-sm">Admin</span>
                </Link>
              )}
            </div>

            {/* Right side: Auth + Mobile hamburger */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                {mobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                )}
              </button>

              {/* User menu / Sign In */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl px-2.5 sm:px-3 py-1.5 transition-all"
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-slate-900 font-bold text-xs sm:text-sm">
                      {getInitials()}
                    </div>
                    <span className="text-white font-medium hidden sm:block text-sm">{getDisplayName()}</span>
                    <svg className={`w-4 h-4 text-slate-400 transition-transform hidden sm:block ${showUserMenu ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-slate-700">
                        <p className="text-white font-medium text-sm">{userProfile?.full_name || user.displayName || 'User'}</p>
                        <p className="text-slate-400 text-xs truncate">{user.email}</p>
                        {user.email && !user.emailVerified && (
                          <p className="text-amber-400 text-xs mt-1 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            Email not verified
                          </p>
                        )}
                      </div>
                      <div className="py-1">
                        <Link to="/dashboard" onClick={() => setShowUserMenu(false)} className="w-full px-4 py-2.5 text-left text-slate-300 hover:bg-slate-700 hover:text-white transition-colors flex items-center gap-3 text-sm">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                          My Learning Dashboard
                        </Link>
                        {isAdmin && (
                          <Link to="/admin" onClick={() => setShowUserMenu(false)} className="w-full px-4 py-2.5 text-left text-amber-400/90 hover:bg-amber-500/10 hover:text-amber-400 transition-colors flex items-center gap-3 text-sm border-t border-slate-700/50 mt-1 pt-1">
                            <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                            <span className="flex items-center gap-2">
                              Admin
                              <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-500/70 bg-amber-500/10 px-1.5 py-0.5 rounded">Portal</span>
                            </span>
                          </Link>
                        )}
                      </div>
                      <div className="border-t border-slate-700 py-1">
                        <button onClick={handleSignOut} className="w-full px-4 py-2.5 text-left text-red-400 hover:bg-slate-700 hover:text-red-300 transition-colors flex items-center gap-3 text-sm">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleSignInClick}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold px-4 sm:px-5 py-2 rounded-lg transition-all hover:shadow-lg hover:shadow-amber-500/25 text-sm"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-slate-900/98 backdrop-blur-sm max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="px-4 py-4 space-y-1">
              {/* Home */}
              <Link to="/" className="flex items-center gap-3 px-3 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors font-medium">
                <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                Home
              </Link>

              {/* The Book Section */}
              <div>
                <button onClick={() => setMobileSubmenu(mobileSubmenu === 'book' ? null : 'book')} className="w-full flex items-center justify-between px-3 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors font-medium">
                  <span className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                    The Book
                  </span>
                  <svg className={`w-4 h-4 transition-transform ${mobileSubmenu === 'book' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {mobileSubmenu === 'book' && (
                  <div className="ml-8 mt-1 space-y-1">
                    <button onClick={() => { scrollToSection('benefits'); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 text-slate-400 hover:text-amber-400 rounded-lg hover:bg-slate-800/50 transition-colors text-sm">Benefits</button>
                    <button onClick={() => { scrollToSection('about-book'); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 text-slate-400 hover:text-amber-400 rounded-lg hover:bg-slate-800/50 transition-colors text-sm">About the Book</button>
                    <button onClick={() => { scrollToSection('author'); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 text-slate-400 hover:text-amber-400 rounded-lg hover:bg-slate-800/50 transition-colors text-sm">About the Author</button>
                    <button onClick={() => { scrollToSection('get-book'); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 text-amber-400 font-medium rounded-lg hover:bg-slate-800/50 transition-colors text-sm">Buy the Book</button>
                  </div>
                )}
              </div>

              {/* Courses Section */}
              <div>
                <button onClick={() => setMobileSubmenu(mobileSubmenu === 'courses' ? null : 'courses')} className="w-full flex items-center justify-between px-3 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors font-medium">
                  <span className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    Courses
                  </span>
                  <svg className={`w-4 h-4 transition-transform ${mobileSubmenu === 'courses' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {mobileSubmenu === 'courses' && (
                  <div className="ml-8 mt-1 space-y-1">
                    <Link to="/course" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-slate-400 hover:text-indigo-400 rounded-lg hover:bg-slate-800/50 transition-colors text-sm">Beginner Course</Link>
                    <Link to="/masterclass" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-slate-400 hover:text-amber-400 rounded-lg hover:bg-slate-800/50 transition-colors text-sm">Masterclass</Link>
                    <Link to="/seminar" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-slate-400 hover:text-emerald-400 rounded-lg hover:bg-slate-800/50 transition-colors text-sm">Seminar</Link>
                  </div>
                )}
              </div>

              {/* Resources Section */}
              <div>
                <button onClick={() => setMobileSubmenu(mobileSubmenu === 'resources' ? null : 'resources')} className="w-full flex items-center justify-between px-3 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors font-medium">
                  <span className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                    Resources
                  </span>
                  <svg className={`w-4 h-4 transition-transform ${mobileSubmenu === 'resources' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {mobileSubmenu === 'resources' && (
                  <div className="ml-8 mt-1 space-y-1">
                    <Link to="/start" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-slate-400 hover:text-amber-400 rounded-lg hover:bg-slate-800/50 transition-colors text-sm">Free Starter Pack</Link>
                    <Link to="/calculator" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-slate-400 hover:text-amber-400 rounded-lg hover:bg-slate-800/50 transition-colors text-sm">Investment Calculator</Link>
                    <Link to="/blog" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-slate-400 hover:text-amber-400 rounded-lg hover:bg-slate-800/50 transition-colors text-sm">Blog</Link>
                    <Link to="/foundation" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-slate-400 hover:text-amber-400 rounded-lg hover:bg-slate-800/50 transition-colors text-sm">Foundation Edition</Link>
                  </div>
                )}
              </div>

              {/* Dashboard link for logged in users */}
              {user && (
                <>
                  <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors font-medium">
                    <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                    My Dashboard
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className="flex items-center gap-3 px-3 py-2.5 text-amber-400/90 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors font-medium border border-amber-500/20">
                      <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                      Admin Portal
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Click outside to close user menu */}
      {showUserMenu && <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />}
      {/* Click outside to close dropdowns */}
      {openDropdown && <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />}
    </header>
  );
};

export default Header;
