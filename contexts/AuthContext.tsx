'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { User, UserType, JobHunter, Agency, Admin } from '@/types';
import { COLLECTIONS } from '@/lib/collections';

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: JobHunter | Agency | Admin | null;
  userType: UserType | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    userType: UserType,
    profileData: any
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<JobHunter | Agency | Admin | null>(null);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        await loadUserProfile(firebaseUser.uid);
      } else {
        setUserProfile(null);
        setUserType(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      // Check if user is admin first
      const adminDoc = await getDoc(doc(db, COLLECTIONS.ADMINS, userId));

      if (adminDoc.exists()) {
        setUserProfile({ id: adminDoc.id, ...adminDoc.data() } as Admin);
        setUserType('admin');
        return;
      }

      // Check if user is job hunter
      const jobHunterDoc = await getDoc(
        doc(db, COLLECTIONS.JOB_HUNTERS, userId)
      );

      if (jobHunterDoc.exists()) {
        setUserProfile({ id: jobHunterDoc.id, ...jobHunterDoc.data() } as JobHunter);
        setUserType('jobhunter');
        return;
      }

      // Check if user is agency
      const agencyDoc = await getDoc(doc(db, COLLECTIONS.AGENCIES, userId));

      if (agencyDoc.exists()) {
        setUserProfile({ id: agencyDoc.id, ...agencyDoc.data() } as Agency);
        setUserType('agency');
        return;
      }

      // Profile not found - sign out the user to prevent issues
      console.error('User profile not found in database. User ID:', userId);
      console.error('No profile document found in jobHunters, agencies, or admins collections.');
      console.error('Please create a profile document in Firestore with this user ID.');
      await firebaseSignOut(auth);
      setUserProfile(null);
      setUserType(null);
    } catch (error) {
      console.error('Error loading user profile:', error);
      // Sign out on error to prevent stuck auth state
      await firebaseSignOut(auth);
      setUserProfile(null);
      setUserType(null);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    userType: UserType,
    profileData: any
  ) => {
    try {
      // Create auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userId = userCredential.user.uid;

      // Create user profile in Firestore
      const userDoc = {
        email,
        userType,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(doc(db, COLLECTIONS.USERS, userId), userDoc);

      // Create profile based on user type
      if (userType === 'jobhunter') {
        const jobHunterProfile = {
          ...profileData,
          email,
          userType,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        await setDoc(doc(db, COLLECTIONS.JOB_HUNTERS, userId), jobHunterProfile);

        // Update display name
        await updateProfile(userCredential.user, {
          displayName: `${profileData.firstName} ${profileData.lastName}`,
        });
      } else if (userType === 'agency') {
        const agencyProfile = {
          ...profileData,
          email,
          userType,
          verified: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        await setDoc(doc(db, COLLECTIONS.AGENCIES, userId), agencyProfile);

        // Update display name
        await updateProfile(userCredential.user, {
          displayName: profileData.companyName,
        });
      } else if (userType === 'admin') {
        const adminProfile = {
          ...profileData,
          email,
          userType,
          role: profileData.role || 'moderator',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        await setDoc(doc(db, COLLECTIONS.ADMINS, userId), adminProfile);

        // Update display name
        await updateProfile(userCredential.user, {
          displayName: `${profileData.firstName} ${profileData.lastName}`,
        });
      }

      await loadUserProfile(userId);
    } catch (error: any) {
      console.error('Signup error:', error);

      // Provide user-friendly error messages
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('This email is already registered. Please login instead.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address format.');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Password is too weak. Use at least 6 characters.');
      } else if (error.code === 'auth/network-request-failed') {
        throw new Error('Network error. Please check your internet connection.');
      } else {
        throw new Error(error.message || 'Failed to sign up. Please try again.');
      }
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error('Login error:', error);

      // Provide user-friendly error messages
      if (error.code === 'auth/user-not-found') {
        throw new Error('No account found with this email. Please sign up first.');
      } else if (error.code === 'auth/wrong-password') {
        throw new Error('Incorrect password. Please try again.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address format.');
      } else if (error.code === 'auth/user-disabled') {
        throw new Error('This account has been disabled. Contact support.');
      } else if (error.code === 'auth/network-request-failed') {
        throw new Error('Network error. Please check your internet connection.');
      } else {
        throw new Error(error.message || 'Failed to sign in. Please try again.');
      }
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUserProfile(null);
      setUserType(null);
    } catch (error: any) {
      console.error('Signout error:', error);
      throw new Error(error.message || 'Failed to sign out');
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await loadUserProfile(user.uid);
    }
  };

  const value = {
    user,
    userProfile,
    userType,
    loading,
    signUp,
    signIn,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
