/**
 * Firebase Authentication utilities
 * Handles email/password, Google sign-in, password reset, and email verification
 */

import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut,
  onAuthStateChanged,
  User,
  updateProfile,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  deleteUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

/**
 * User profile interface
 */
export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  email_verified: boolean;
  created_at: any;
  updated_at: any;
  photo_url?: string;
  role?: string;
}

/**
 * Sign in with email and password
 */
export const signInWithEmail = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  await ensureUserProfile(userCredential.user);
  return userCredential.user;
};

/**
 * Sign up with email and password
 */
export const signUpWithEmail = async (email: string, password: string, fullName: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
  // Update display name
  await updateProfile(userCredential.user, {
    displayName: fullName
  });
  
  // Send email verification
  if (userCredential.user.email) {
    await sendEmailVerification(userCredential.user);
  }
  
  // Create user profile in Firestore
  await createUserProfile(userCredential.user, fullName);
  
  return userCredential.user;
};

/**
 * Sign in with Google
 */
export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  await ensureUserProfile(result.user);
  return result.user;
};

/**
 * Send password reset email
 */
export const resetPassword = async (email: string) => {
  await sendPasswordResetEmail(auth, email, {
    url: `${window.location.origin}/auth/reset-password`,
    handleCodeInApp: false
  });
};

/**
 * Resend email verification
 */
export const resendEmailVerification = async (user: User) => {
  if (user.email) {
    await sendEmailVerification(user, {
      url: `${window.location.origin}/auth/verify-email`
    });
  }
};

/**
 * Sign out
 */
export const signOutUser = async () => {
  await signOut(auth);
};

/**
 * Change password (for authenticated user). Requires re-authentication with current password.
 */
export const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
  const user = auth.currentUser;
  if (!user?.email) throw new Error('Not authenticated');
  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);
  await updatePassword(user, newPassword);
};

const USER_PROFILES_COLLECTION = 'user_profiles';

/**
 * Create user profile in Firestore (on sign up)
 */
const createUserProfile = async (user: User, fullName: string) => {
  const profileRef = doc(db, USER_PROFILES_COLLECTION, user.uid);
  const profile = {
    id: user.uid,
    full_name: fullName.trim() || user.displayName || user.email?.split('@')[0] || 'User',
    email: user.email || '',
    email_verified: user.emailVerified,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
    photo_url: user.photoURL || undefined
  };
  await setDoc(profileRef, profile);
};

/**
 * Ensure user profile exists in Firestore (on sign in - creates if missing).
 * Exported so AppLayout can backfill profiles for returning users.
 */
export const ensureUserProfile = async (user: User) => {
  const profileRef = doc(db, USER_PROFILES_COLLECTION, user.uid);
  const profileSnap = await getDoc(profileRef);

  if (!profileSnap.exists()) {
    const profile = {
      id: user.uid,
      full_name: user.displayName || user.email?.split('@')[0] || 'User',
      email: user.email || '',
      email_verified: user.emailVerified,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
      photo_url: user.photoURL || undefined
    };
    await setDoc(profileRef, profile);
  } else {
    await updateDoc(profileRef, {
      email: user.email || '',
      email_verified: user.emailVerified,
      photo_url: user.photoURL || undefined,
      updated_at: serverTimestamp()
    });
  }
};

/**
 * Get user profile from Firestore
 */
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const profileRef = doc(db, 'user_profiles', userId);
  const profileSnap = await getDoc(profileRef);
  
  if (profileSnap.exists()) {
    return { id: profileSnap.id, ...profileSnap.data() } as UserProfile;
  }
  
  return null;
};

/**
 * Update user profile
 */
export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
  const profileRef = doc(db, 'user_profiles', userId);
  await updateDoc(profileRef, {
    ...updates,
    updated_at: serverTimestamp()
  });
  
  // Also update Firebase Auth display name if full_name changed
  if (updates.full_name && auth.currentUser) {
    await updateProfile(auth.currentUser, {
      displayName: updates.full_name
    });
  }
};

/**
 * Auth state observer
 */
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Get current user
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

