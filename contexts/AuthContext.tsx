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

// Type-safe profile data for signup
type JobHunterProfileData = Omit<JobHunter, 'id' | 'email' | 'userType' | 'createdAt' | 'updatedAt'>;
type AgencyProfileData = Omit<Agency, 'id' | 'email' | 'userType' | 'createdAt' | 'updatedAt' | 'verified'>;
type AdminProfileData = Omit<Admin, 'id' | 'email' | 'userType' | 'createdAt' | 'updatedAt'>;

type ProfileData = JobHunterProfileData | AgencyProfileData | AdminProfileData;

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: JobHunter | Agency | Admin | null;
  userType: UserType | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    userType: UserType,
    profileData: ProfileData
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
      console.log('[AuthContext] Loading user profile for ID:', userId);

      // OPTIMIZATION: Check all user types in parallel instead of sequential
      console.log('[AuthContext] Querying Firestore collections...');
      const [adminDoc, jobHunterDoc, agencyDoc] = await Promise.all([
        getDoc(doc(db, COLLECTIONS.ADMINS, userId)),
        getDoc(doc(db, COLLECTIONS.JOB_HUNTERS, userId)),
        getDoc(doc(db, COLLECTIONS.AGENCIES, userId))
      ]);

      console.log('[AuthContext] Firestore queries completed successfully');
      console.log('[AuthContext] Admin exists:', adminDoc.exists());
      console.log('[AuthContext] JobHunter exists:', jobHunterDoc.exists());
      console.log('[AuthContext] Agency exists:', agencyDoc.exists());

      if (adminDoc.exists()) {
        console.log('[AuthContext] User is an ADMIN');
        setUserProfile({ id: adminDoc.id, ...adminDoc.data() } as Admin);
        setUserType('admin');
        return;
      }

      if (jobHunterDoc.exists()) {
        console.log('[AuthContext] User is a JOB HUNTER');
        setUserProfile({ id: jobHunterDoc.id, ...jobHunterDoc.data() } as JobHunter);
        setUserType('jobhunter');
        return;
      }

      if (agencyDoc.exists()) {
        console.log('[AuthContext] User is an AGENCY');
        setUserProfile({ id: agencyDoc.id, ...agencyDoc.data() } as Agency);
        setUserType('agency');
        return;
      }

      // Profile not found - sign out the user to prevent issues
      console.error('[AuthContext] ERROR: User profile not found in database. User ID:', userId);
      console.error('[AuthContext] No profile document found in jobHunters, agencies, or admins collections.');
      console.error('[AuthContext] Please create a profile document in Firestore with this user ID.');
      await firebaseSignOut(auth);
      setUserProfile(null);
      setUserType(null);
    } catch (error) {
      console.error('[AuthContext] CRITICAL ERROR loading user profile:', error);
      console.error('[AuthContext] Error details:', JSON.stringify(error, null, 2));
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
    profileData: ProfileData
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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Get the ID token and create a session cookie
      const idToken = await userCredential.user.getIdToken();

      // Call the session API to create a server-side session cookie
      const response = await fetch('/api/auth/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        console.error('Failed to create session cookie');
        // Don't throw error here - client-side auth still works
      } else {
        console.log('[AuthContext] Session cookie created successfully');
      }
    } catch (error: any) {
      console.error('Login error:', error);

      // Provide user-friendly error messages
      if (error.code === 'auth/user-not-found') {
        throw new Error('No account found with this email. Please sign up first.');
      } else if (error.code === 'auth/wrong-password') {
        throw new Error('Incorrect password. Please try again.');
      } else if (error.code === 'auth/invalid-credential') {
        throw new Error('Invalid email or password. If you don\'t have an account, please sign up first.');
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
      // Call the logout API to clear the session cookie
      await fetch('/api/auth/logout', {
        method: 'POST',
      });

      // Sign out from Firebase client
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
