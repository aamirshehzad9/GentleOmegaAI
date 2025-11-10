// Firebase Authentication Helper Functions - Updated 2025-11-11 01:34
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  OAuthProvider,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  User,
  UserCredential,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp, collection, addDoc } from 'firebase/firestore';
import { auth, db } from './config';

import { logUserSession } from '../utils/session-logger';

// Initialize Auth Providers
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
const microsoftProvider = new OAuthProvider('microsoft.com');

// User profile interface
export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: any;
  lastLoginAt: any;
  emailVerified: boolean;
}

// ==================== Email/Password Authentication ====================

/**
 * Register new user with email and password
 */
export const registerWithEmail = async (
  email: string,
  password: string,
  displayName: string
): Promise<UserCredential> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update user profile with display name
    if (userCredential.user) {
      await updateProfile(userCredential.user, { displayName });
      
      // Send email verification
      await sendEmailVerification(userCredential.user);
      
      // Create user profile in Firestore
      await createUserProfile(userCredential.user);
      
      // Log session with IP tracking
      await logUserSession(userCredential.user.uid, email, 'signup');
    }
    
    return userCredential;
  } catch (error: any) {
    console.error('Error registering user:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

/**
 * Sign in with email and password
 */
export const loginWithEmail = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Update last login time
    if (userCredential.user) {
      await updateUserLastLogin(userCredential.user.uid);
      
      // Log session with IP tracking
      await logUserSession(userCredential.user.uid, email, 'login');
    }
    
    return userCredential;
  } catch (error: any) {
    console.error('Error logging in:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

// ==================== Social Authentication ====================

/**
 * Sign in with Google
 */
export const loginWithGoogle = async (): Promise<UserCredential> => {
  try {
    const userCredential = await signInWithPopup(auth, googleProvider);
    
    // Create or update user profile
    await createOrUpdateUserProfile(userCredential.user);
    
    return userCredential;
  } catch (error: any) {
    console.error('Error with Google login:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

/**
 * Sign in with GitHub
 */
export const loginWithGithub = async (): Promise<UserCredential> => {
  try {
    const userCredential = await signInWithPopup(auth, githubProvider);
    
    // Create or update user profile
    await createOrUpdateUserProfile(userCredential.user);
    
    return userCredential;
  } catch (error: any) {
    console.error('Error with GitHub login:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

/**
 * Sign in with Microsoft
 */
export const loginWithMicrosoft = async (): Promise<UserCredential> => {
  try {
    const userCredential = await signInWithPopup(auth, microsoftProvider);
    
    // Create or update user profile
    await createOrUpdateUserProfile(userCredential.user);
    
    return userCredential;
  } catch (error: any) {
    console.error('Error with Microsoft login:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

// ==================== User Management ====================

/**
 * Sign out current user
 */
export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error('Error signing out:', error);
    throw new Error('Failed to sign out. Please try again.');
  }
};

/**
 * Send password reset email
 */
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.error('Error sending password reset email:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

/**
 * Resend email verification
 */
export const resendVerificationEmail = async (): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (user && !user.emailVerified) {
      await sendEmailVerification(user);
    } else {
      throw new Error('No user signed in or email already verified');
    }
  } catch (error: any) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email. Please try again.');
  }
};

// ==================== Firestore User Profile Management ====================

/**
 * Create user profile in Firestore
 */
const createUserProfile = async (user: User): Promise<void> => {
  try {
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
      emailVerified: user.emailVerified,
    };
    
    await setDoc(doc(db, 'users', user.uid), userProfile);
  } catch (error) {
    console.error('Error creating user profile:', error);
  }
};

/**
 * Create or update user profile (for social logins)
 */
const createOrUpdateUserProfile = async (user: User): Promise<void> => {
  try {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    const action = !userSnap.exists() ? 'signup' : 'login';
    
    if (!userSnap.exists()) {
      // Create new profile
      await createUserProfile(user);
    } else {
      // Update last login
      await updateUserLastLogin(user.uid);
    }
    
    // Log session with IP tracking
    await logUserSession(user.uid, user.email || '', action);
  } catch (error) {
    console.error('Error creating/updating user profile:', error);
  }
};

/**
 * Update user's last login timestamp
 */
const updateUserLastLogin = async (uid: string): Promise<void> => {
  try {
    await updateDoc(doc(db, 'users', uid), {
      lastLoginAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating last login:', error);
  }
};

/**
 * Get user profile from Firestore
 */
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userSnap = await getDoc(doc(db, 'users', uid));
    
    if (userSnap.exists()) {
      return userSnap.data() as UserProfile;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

// ==================== Error Handling ====================

/**
 * Convert Firebase auth error codes to user-friendly messages
 */
const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please login instead.';
    case 'auth/invalid-email':
      return 'Invalid email address format.';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled. Please contact support.';
    case 'auth/weak-password':
      return 'Password is too weak. Please use at least 6 characters.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'auth/user-not-found':
      return 'No account found with this email. Please sign up.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in popup was closed. Please try again.';
    case 'auth/cancelled-popup-request':
      return 'Only one popup request is allowed at a time.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    default:
      return 'An error occurred during authentication. Please try again.';
  }
};

// Export auth instance for direct use
export { auth };

