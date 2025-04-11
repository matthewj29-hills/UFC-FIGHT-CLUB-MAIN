import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (displayName: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const clearError = () => setError(null);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
    } catch (err: any) {
      console.error('Sign in error:', err);
      switch (err.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          setError('Invalid email or password');
          break;
        case 'auth/too-many-requests':
          setError('Too many failed attempts. Please try again later');
          break;
        case 'auth/network-request-failed':
          setError('Network error. Please check your connection');
          break;
        default:
          setError(`Authentication error: ${err.message}`);
      }
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setError(null);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      
      // Set default user stats in Firestore
      const userStats = {
        totalPredictions: 0,
        correctPredictions: 0,
        totalPoints: 0,
        rank: 0,
        isAdmin: email === 'hillsmj23@wfu.edu' || email === 'hillmj23@wfu.edu',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };
      
      await setDoc(doc(db, 'users', userCredential.user.uid), userStats);
    } catch (err: any) {
      console.error('Sign up error:', err);
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError('Email is already registered');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address');
          break;
        case 'auth/weak-password':
          setError('Password is too weak');
          break;
        case 'auth/network-request-failed':
          setError('Network error. Please check your connection');
          break;
        case 'auth/invalid-credential':
          setError('Invalid credentials. Please try again');
          break;
        default:
          setError(`Registration error: ${err.message}`);
      }
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
    } catch (err: any) {
      console.error('Sign out error:', err);
      setError('An error occurred during sign out');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      console.error('Error resetting password:', err);
      setError('Failed to send password reset email');
    }
  };

  const updateUserProfile = async (displayName: string) => {
    try {
      setError(null);
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName });
        setUser(auth.currentUser);
      }
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    }
  };

  const validateEmail = (email: string) => {
    // Accept any valid email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const value = {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateUserProfile,
    clearError,
  };

  if (loading) {
    return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 