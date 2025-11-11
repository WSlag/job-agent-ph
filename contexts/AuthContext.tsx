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
import { getAuthInstance, getDbInstance } from '@/lib/firebase';
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
    const auth = getAuthInstance();
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

  const loadUserProfile = async (userId: string, retryCount: number = 0) => {
    try {
      console.log('[AuthContext] Loading user profile for ID:', userId, 'retry:', retryCount);

      // OPTIMIZATION: Check all user types in parallel instead of sequential
      console.log('[AuthContext] Querying Firestore collections...');
      const db = getDbInstance();
      const auth = getAuthInstance();
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

      // Profile not found - retry up to 3 times with delay (for signup race condition)
      if (retryCount < 3) {
        console.log('[AuthContext] Profile not found, retrying in 1 second... (attempt', retryCount + 1, 'of 3)');
        await new Promise(resolve => setTimeout(resolve, 1000));
        return loadUserProfile(userId, retryCount + 1);
      }

      // Profile not found after retries - sign out the user to prevent issues
      console.error('[AuthContext] ERROR: User profile not found in database after', retryCount, 'retries. User ID:', userId);
      console.error('[AuthContext] No profile document found in jobHunters, agencies, or admins collections.');
      console.error('[AuthContext] Please create a profile document in Firestore with this user ID.');
      await firebaseSignOut(auth);
      setUserProfile(null);
      setUserType(null);
    } catch (error) {
      console.error('[AuthContext] CRITICAL ERROR loading user profile:', error);
      console.error('[AuthContext] Error details:', JSON.stringify(error, null, 2));
      // Sign out on error to prevent stuck auth state
      const auth = getAuthInstance();
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
      console.log('[AuthContext] Starting signup process for email:', email);
      console.log('[AuthContext] User type:', userType);
      console.log('[AuthContext] Profile data:', JSON.stringify(profileData, null, 2));

      // Create auth user
      console.log('[AuthContext] Creating Firebase Auth user...');
      const auth = getAuthInstance();
      const db = getDbInstance();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userId = userCredential.user.uid;
      console.log('[AuthContext] Firebase Auth user created successfully. User ID:', userId);

      // Create user profile in Firestore
      const userDoc = {
        email,
        userType,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      console.log('[AuthContext] Creating base user document in users collection...');
      await setDoc(doc(db, COLLECTIONS.USERS, userId), userDoc);
      console.log('[AuthContext] Base user document created successfully');

      // Create profile based on user type
      if (userType === 'jobhunter') {
        console.log('[AuthContext] Creating job hunter profile for user:', userId);
        const typedProfileData = profileData as JobHunterProfileData;
        const jobHunterProfile = {
          ...profileData,
          email,
          userType,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        console.log('[AuthContext] Job hunter profile data:', JSON.stringify(jobHunterProfile, null, 2));
        await setDoc(doc(db, COLLECTIONS.JOB_HUNTERS, userId), jobHunterProfile);
        console.log('[AuthContext] Job hunter profile document created successfully');

        // Update display name
        await updateProfile(userCredential.user, {
          displayName: `${typedProfileData.firstName} ${typedProfileData.lastName}`,
        });
        console.log('[AuthContext] Display name updated successfully');
      } else if (userType === 'agency') {
        console.log('[AuthContext] Creating agency profile for user:', userId);
        const typedProfileData = profileData as AgencyProfileData;
        const agencyProfile = {
          ...profileData,
          email,
          userType,
          verified: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        console.log('[AuthContext] Agency profile data:', JSON.stringify(agencyProfile, null, 2));
        await setDoc(doc(db, COLLECTIONS.AGENCIES, userId), agencyProfile);
        console.log('[AuthContext] Agency profile document created successfully');

        // Update display name
        await updateProfile(userCredential.user, {
          displayName: typedProfileData.companyName,
        });
        console.log('[AuthContext] Display name updated successfully');
      } else if (userType === 'admin') {
        console.log('[AuthContext] Creating admin profile for user:', userId);
        const typedProfileData = profileData as AdminProfileData;
        const adminProfile = {
          ...profileData,
          email,
          userType,
          role: typedProfileData.role || 'moderator',
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        console.log('[AuthContext] Admin profile data:', JSON.stringify(adminProfile, null, 2));
        await setDoc(doc(db, COLLECTIONS.ADMINS, userId), adminProfile);
        console.log('[AuthContext] Admin profile document created successfully');

        // Update display name
        await updateProfile(userCredential.user, {
          displayName: `${typedProfileData.firstName} ${typedProfileData.lastName}`,
        });
        console.log('[AuthContext] Display name updated successfully');
      }

      console.log('[AuthContext] All profile documents created successfully.');

      // Create session cookie for server-side auth
      console.log('[AuthContext] Creating session cookie...');
      try {
        const idToken = await userCredential.user.getIdToken();

        const sessionResponse = await fetch('/api/auth/session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ idToken }),
        });

        if (!sessionResponse.ok) {
          console.error('[AuthContext] Failed to create session cookie');
          // Don't throw error here - client-side auth still works
        } else {
          console.log('[AuthContext] Session cookie created successfully');
        }
      } catch (sessionError) {
        console.error('[AuthContext] Error creating session cookie:', sessionError);
        // Don't throw - allow signup to complete with client-side auth only
      }

      // Don't manually call loadUserProfile here - the onAuthStateChanged listener will handle it with retry logic
      console.log('[AuthContext] Signup process completed successfully! Profile will be loaded by auth state listener.');
    } catch (error: any) {
      console.error('[AuthContext] SIGNUP ERROR occurred:', error);
      console.error('[AuthContext] Error code:', error.code);
      console.error('[AuthContext] Error message:', error.message);
      console.error('[AuthContext] Full error details:', JSON.stringify(error, null, 2));

      // Provide user-friendly error messages
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('This email is already registered. Please login instead.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address format.');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Password is too weak. Use at least 6 characters.');
      } else if (error.code === 'auth/network-request-failed') {
        throw new Error('Network error. Please check your internet connection.');
      } else if (error.code?.startsWith('permission-denied') || error.message?.includes('permission')) {
        console.error('[AuthContext] Firestore permission denied. Check security rules.');
        throw new Error('Database permission error. Please contact support.');
      } else {
        throw new Error(error.message || 'Failed to sign up. Please try again.');
      }
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('[AuthContext] Starting sign in process...');
      const auth = getAuthInstance();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('[AuthContext] Firebase authentication successful');

      // Get the ID token and create a session cookie
      const idToken = await userCredential.user.getIdToken();
      console.log('[AuthContext] ID token obtained, creating session cookie...');

      // Call the session API to create a server-side session cookie
      const response = await fetch('/api/auth/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        console.error('[AuthContext] Failed to create session cookie, status:', response.status);
        const errorData = await response.json().catch(() => ({}));
        console.error('[AuthContext] Session error details:', errorData);
        // Don't throw error here - client-side auth still works
      } else {
        console.log('[AuthContext] Session cookie created successfully');
        // Wait a bit to ensure cookie is properly set in browser
        await new Promise(resolve => setTimeout(resolve, 150));
        console.log('[AuthContext] Session cookie should now be available');
      }
    } catch (error: any) {
      console.error('[AuthContext] Login error:', error);

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
      const auth = getAuthInstance();
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

// Optional version for components that may or may not have auth context
export function useOptionalAuth() {
  const context = useContext(AuthContext);
  return context || {
    user: null,
    userProfile: null,
    userType: null,
    loading: false,
    signUp: async () => {},
    signIn: async () => {},
    signOut: async () => {},
    updateUserProfile: async () => {},
  };
}
