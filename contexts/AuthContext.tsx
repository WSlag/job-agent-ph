'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  getRedirectResult,
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
  sessionReady: boolean;
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
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let isCleaningUp = false;

    const initialize = async () => {
      const auth = getAuthInstance();
      const expectedAuthDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;

      console.log('[AuthContext] Initializing with auth domain:', expectedAuthDomain);

      // Check for pending redirect result (from Google sign-in)
      // NOTE: This is now handled in the login/signup pages directly
      // DO NOT call getRedirectResult() here as it can only be called once
      // and will consume the result, preventing the login/signup page from processing it

      // Check for auth domain mismatch
      const storedAuthDomain = localStorage.getItem('firebase:authDomain');
      const hasFirebaseTokens = Object.keys(localStorage).some(key =>
        key.startsWith('firebase:authUser:')
      );

      // Detect mismatch
      const hasMismatch = hasFirebaseTokens && (!storedAuthDomain || storedAuthDomain !== expectedAuthDomain);

      if (hasMismatch) {
        console.warn('[AuthContext] ⚠️ AUTH DOMAIN MISMATCH DETECTED!');
        console.warn('[AuthContext] Expected:', expectedAuthDomain);
        console.warn('[AuthContext] Stored:', storedAuthDomain || '(none)');
        console.warn('[AuthContext] Redirecting to /clear-auth for complete cleanup...');

        // Mark as cleaning up to prevent listener from being set up
        isCleaningUp = true;

        // Redirect to clear-auth page which handles complete cleanup
        window.location.href = '/clear-auth';
        return; // Don't set up auth listener
      }

      // Store auth domain for future checks
      if (expectedAuthDomain && !storedAuthDomain) {
        localStorage.setItem('firebase:authDomain', expectedAuthDomain);
        console.log('[AuthContext] Stored auth domain for tracking:', expectedAuthDomain);
      }

      // Only set up listener if not cleaning up
      if (!isCleaningUp) {
        console.log('[AuthContext] Setting up auth state listener...');
        unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          console.log('[AuthContext] Auth state changed:', firebaseUser ? `User ${firebaseUser.uid}` : 'No user');
          setUser(firebaseUser);

          if (firebaseUser) {
            await loadUserProfile(firebaseUser.uid);

            // Check if session cookie exists when user is authenticated
            const sessionCookie = document.cookie.includes('session=');
            console.log('[AuthContext] Session cookie present:', sessionCookie);
            setSessionReady(sessionCookie);
          } else {
            setUserProfile(null);
            setUserType(null);
            setSessionReady(false);
          }

          setLoading(false);
        });
      }
    };

    initialize();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const loadUserProfile = async (userId: string, retryCount: number = 0) => {
    try {
      console.log('[AuthContext] Loading user profile for ID:', userId, 'retry:', retryCount);
      const db = getDbInstance();
      const auth = getAuthInstance();

      // Query collections SEQUENTIALLY to avoid amplifying permission errors
      // Most users are job hunters, so check that first for performance

      console.log('[AuthContext] Checking jobHunters collection...');
      try {
        const jobHunterDoc = await getDoc(doc(db, COLLECTIONS.JOB_HUNTERS, userId));
        if (jobHunterDoc.exists()) {
          console.log('[AuthContext] User is a JOB HUNTER');
          const jobHunterData = { id: jobHunterDoc.id, ...jobHunterDoc.data() } as JobHunter;

          if (jobHunterData.status === 'suspended' || jobHunterData.status === 'deleted') {
            console.log('[AuthContext] Job hunter account is', jobHunterData.status);
            const message = jobHunterData.status === 'suspended'
              ? `Your account has been suspended. ${jobHunterData.suspensionReason || ''}`
              : 'Your account has been deleted.';
            alert(message);
            await firebaseSignOut(auth);
            setUserProfile(null);
            setUserType(null);
            return;
          }

          setUserProfile(jobHunterData);
          setUserType('jobhunter');
          return;
        }
      } catch (error: any) {
        // Permission denied on jobHunters is unusual but can happen during token propagation
        console.warn('[AuthContext] Error checking jobHunters (code: ' + error?.code + '). This may be normal during initial auth.');
      }

      console.log('[AuthContext] Checking agencies collection...');
      try {
        const agencyDoc = await getDoc(doc(db, COLLECTIONS.AGENCIES, userId));
        if (agencyDoc.exists()) {
          console.log('[AuthContext] User is an AGENCY');
          const agencyData = { id: agencyDoc.id, ...agencyDoc.data() } as Agency;

          if (agencyData.status === 'suspended' || agencyData.status === 'deleted') {
            console.log('[AuthContext] Agency account is', agencyData.status);
            const message = agencyData.status === 'suspended'
              ? `Your account has been suspended. ${agencyData.suspensionReason || ''}`
              : 'Your account has been deleted.';
            alert(message);
            await firebaseSignOut(auth);
            setUserProfile(null);
            setUserType(null);
            return;
          }

          setUserProfile(agencyData);
          setUserType('agency');
          return;
        }
      } catch (error: any) {
        console.warn('[AuthContext] Error checking agencies (code: ' + error?.code + ')');
      }

      console.log('[AuthContext] Checking admins collection...');
      try {
        const adminDoc = await getDoc(doc(db, COLLECTIONS.ADMINS, userId));
        if (adminDoc.exists()) {
          console.log('[AuthContext] User is an ADMIN');
          const adminData = { id: adminDoc.id, ...adminDoc.data() } as Admin;

          if (adminData.status === 'suspended' || adminData.status === 'deleted') {
            console.log('[AuthContext] Admin account is', adminData.status);
            alert(`Your account has been ${adminData.status}. ${adminData.suspensionReason || ''}`);
            await firebaseSignOut(auth);
            setUserProfile(null);
            setUserType(null);
            return;
          }

          setUserProfile(adminData);
          setUserType('admin');
          return;
        }
      } catch (error: any) {
        // Permission denied on admins is EXPECTED for non-admins - don't treat as error
        console.log('[AuthContext] Not an admin (expected for non-admin users, code: ' + error?.code + ')');
      }

      // Profile not found - retry with exponential backoff
      if (retryCount < 3) {
        const waitTime = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
        console.log(`[AuthContext] Profile not found, retrying in ${waitTime/1000}s... (attempt ${retryCount + 1} of 3)`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        return loadUserProfile(userId, retryCount + 1);
      }

      // Profile not found after retries
      console.error('[AuthContext] ERROR: User profile not found after', retryCount, 'retries. User ID:', userId);
      console.error('[AuthContext] No profile document found in jobHunters, agencies, or admins collections.');
      alert('Could not load your profile. Please contact support if this persists.');
      await firebaseSignOut(auth);
      setUserProfile(null);
      setUserType(null);

    } catch (error: any) {
      // Handle unexpected errors
      console.error('[AuthContext] UNEXPECTED ERROR loading profile:', error);
      console.error('[AuthContext] Error details:', JSON.stringify(error, null, 2));

      // IMPORTANT: Not all permission-denied errors are auth domain mismatches!
      // They can be caused by:
      // 1. Normal Firestore security rule rejections (e.g., non-admin querying admin collection)
      // 2. Token not yet propagated to Firestore
      // 3. IndexedDB sync delays

      if (error?.code === 'permission-denied') {
        console.warn('[AuthContext] Permission denied error during profile load');

        // Only treat as auth domain mismatch if we have SPECIFIC indicators
        const isAuthDomainIssue = error?.message?.includes('auth/invalid-user-token') ||
                                   error?.message?.includes('auth/user-token-expired') ||
                                   error?.code === 'auth/invalid-credential';

        if (isAuthDomainIssue) {
          console.error('[AuthContext] ⚠️ ACTUAL AUTH DOMAIN MISMATCH DETECTED!');
          alert('Authentication error detected. Your browser will be redirected to clear cached data.');
          window.location.href = '/clear-auth';
          return;
        }

        // For regular permission-denied, retry with token refresh
        if (retryCount < 2) {
          console.log('[AuthContext] Retrying with fresh token (attempt', retryCount + 1, ')...');

          try {
            const auth = getAuthInstance();
            const currentUser = auth.currentUser;
            if (currentUser) {
              await currentUser.reload();
              await currentUser.getIdToken(true); // Force refresh
              console.log('[AuthContext] Token refreshed, waiting for propagation...');

              // Exponential backoff: 2s, 4s
              const waitTime = Math.pow(2, retryCount + 1) * 1000;
              await new Promise(r => setTimeout(r, waitTime));

              // Retry loading profile
              return await loadUserProfile(userId, retryCount + 1);
            }
          } catch (refreshError) {
            console.error('[AuthContext] Failed to refresh token:', refreshError);
          }
        }

        // After retries failed, this is likely a real permission issue
        console.error('[AuthContext] Permission denied after retries. User may not have a profile.');
        alert('Could not load your profile. Please contact support if this persists.');
        const auth = getAuthInstance();
        await firebaseSignOut(auth);
        setUserProfile(null);
        setUserType(null);
        return;
      }

      // For other errors, sign out
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

        // Send welcome email and message to new agency (non-blocking)
        fetch('/api/agency/welcome', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ agencyId: userId }),
        }).catch(err => console.error('[AuthContext] Failed to send welcome message:', err));

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
      setSessionReady(false); // Reset session ready state
      const auth = getAuthInstance();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('[AuthContext] Firebase authentication successful');

      // Force token refresh to ensure it's created with current auth domain
      console.log('[AuthContext] Forcing token refresh to ensure correct auth domain...');
      await userCredential.user.reload();
      const idToken = await userCredential.user.getIdToken(true); // true = force refresh
      console.log('[AuthContext] Fresh ID token obtained');

      // Log token details for debugging
      try {
        const tokenParts = idToken.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          console.log('[AuthContext] Token details:');
          console.log('  - Issued at:', new Date(payload.iat * 1000).toLocaleString());
          console.log('  - Expires at:', new Date(payload.exp * 1000).toLocaleString());
          console.log('  - Audience:', payload.aud);
        }
      } catch (e) {
        // Ignore token parsing errors
      }

      console.log('[AuthContext] Creating session cookie...');

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
        throw new Error('Failed to create session cookie. Please try again.');
      }

      const responseData = await response.json();
      console.log('[AuthContext] Session cookie created successfully:', responseData);

      // Wait longer to ensure token is fully propagated before Firestore queries
      console.log('[AuthContext] Waiting for token propagation to Firestore...');
      await new Promise(resolve => setTimeout(resolve, 2500)); // Increased from 1000ms to 2500ms

      // Mark session as ready - this allows login page to redirect
      setSessionReady(true);
      console.log('[AuthContext] Session ready for redirect');
    } catch (error: any) {
      console.error('[AuthContext] Login error:', error);

      // Provide user-friendly error messages
      if (error.code === 'auth/user-not-found') {
        throw new Error('No account found with this email. Please sign up first.');
      } else if (error.code === 'auth/wrong-password' || error.code === 'auth/missing-password') {
        // Check if this user signed up with Google instead
        try {
          const auth = getAuthInstance();
          const { fetchSignInMethodsForEmail } = await import('firebase/auth');
          const methods = await fetchSignInMethodsForEmail(auth, email);
          if (methods.includes('google.com')) {
            throw new Error('This account uses Google sign-in. Please click "Continue with Google" instead.');
          }
        } catch (checkError) {
          // If we can't check, provide generic error
        }
        throw new Error('Incorrect password. Please try again.');
      } else if (error.code === 'auth/invalid-credential') {
        // Check if this user signed up with Google instead
        try {
          const auth = getAuthInstance();
          const { fetchSignInMethodsForEmail } = await import('firebase/auth');
          const methods = await fetchSignInMethodsForEmail(auth, email);
          if (methods.includes('google.com')) {
            throw new Error('This account uses Google sign-in. Please click "Continue with Google" instead.');
          }
        } catch (checkError) {
          // If we can't check, provide generic error
        }
        throw new Error('Invalid email or password. If you signed up with Google, please use "Continue with Google" instead.');
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
    sessionReady,
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
