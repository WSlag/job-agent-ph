'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithRedirect, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuthInstance, getDbInstance } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/collections';
import { UserType } from '@/types';
import Button from '@/components/ui/Button';
import { Loader2 } from 'lucide-react';

interface GoogleAuthButtonProps {
  /**
   * The user type for new user registration
   * @default 'jobhunter'
   */
  userType?: UserType;
  /**
   * URL to redirect to after successful authentication
   */
  returnUrl?: string;
  /**
   * Callback when authentication is successful
   */
  onSuccess?: () => void;
  /**
   * Callback when authentication fails
   */
  onError?: (error: string) => void;
  /**
   * Whether the button is disabled
   */
  disabled?: boolean;
  /**
   * Button text
   * @default 'Continue with Google'
   */
  buttonText?: string;
}

/**
 * GoogleAuthButton Component
 *
 * Reusable Google authentication button with redirect sign-in flow (primary)
 * and popup fallback. Uses redirect flow to avoid COOP policy issues.
 * Handles both new user registration and existing user login.
 * Automatically creates user profile if it doesn't exist.
 *
 * @example
 * ```tsx
 * <GoogleAuthButton
 *   userType="jobhunter"
 *   returnUrl="/dashboard"
 *   onSuccess={() => console.log('Login successful')}
 *   onError={(error) => console.error(error)}
 * />
 * ```
 */
export default function GoogleAuthButton({
  userType = 'jobhunter',
  returnUrl,
  onSuccess,
  onError,
  disabled = false,
  buttonText = 'Continue with Google',
}: GoogleAuthButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Helper function to handle the authentication result
  const handleAuthResult = async (user: any) => {
    const db = getDbInstance();
    const userId = user.uid;

    console.log('[GoogleAuthButton] Processing authentication for user:', userId);

    // Check if user profile already exists in any collection
    // Use sequential queries instead of parallel to avoid permission error amplification
    // This prevents multiplying permission denied errors across multiple collections
    console.log('[GoogleAuthButton] Checking for existing user profile...');

    const adminDoc = await getDoc(doc(db, COLLECTIONS.ADMINS, userId));
    const jobHunterDoc = await getDoc(doc(db, COLLECTIONS.JOB_HUNTERS, userId));
    const agencyDoc = await getDoc(doc(db, COLLECTIONS.AGENCIES, userId));

    // Determine actual user type based on existing profiles
    let actualUserType = userType;
    if (adminDoc.exists()) {
      actualUserType = 'admin';
      console.log('[GoogleAuthButton] Found existing admin profile');
    } else if (agencyDoc.exists()) {
      actualUserType = 'agency';
      console.log('[GoogleAuthButton] Found existing agency profile');
    } else if (jobHunterDoc.exists()) {
      actualUserType = 'jobhunter';
      console.log('[GoogleAuthButton] Found existing jobhunter profile');
    }

    // If no profile exists, create one based on specified userType
    if (!adminDoc.exists() && !jobHunterDoc.exists() && !agencyDoc.exists()) {
      console.log('[GoogleAuthButton] Creating new user profile for type:', userType);
      const displayName = user.displayName || 'User';
      const nameParts = displayName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Create user document
      await setDoc(doc(db, COLLECTIONS.USERS, userId), {
        email: user.email,
        userType,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Create profile based on user type
      if (userType === 'jobhunter') {
        await setDoc(doc(db, COLLECTIONS.JOB_HUNTERS, userId), {
          firstName,
          lastName,
          email: user.email,
          userType: 'jobhunter',
          location: '',
          skills: [],
          experience: 0,
          profileImageUrl: user.photoURL || '',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      } else if (userType === 'agency') {
        await setDoc(doc(db, COLLECTIONS.AGENCIES, userId), {
          companyName: displayName,
          email: user.email,
          userType: 'agency',
          registrationNumber: '',
          contactPerson: displayName,
          phone: '',
          address: '',
          logoUrl: user.photoURL || '',
          verified: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    // CRITICAL: Create session cookie
    console.log('[GoogleAuthButton] Creating session cookie...');
    try {
      const idToken = await user.getIdToken(true);
      console.log('[GoogleAuthButton] Got ID token, creating session...');

      const sessionResponse = await fetch('/api/auth/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      if (!sessionResponse.ok) {
        const errorData = await sessionResponse.json().catch(() => ({}));
        console.error('[GoogleAuthButton] Session creation failed:', errorData);
        throw new Error('Failed to create session cookie');
      }

      const sessionData = await sessionResponse.json();
      console.log('[GoogleAuthButton] Session cookie created successfully:', sessionData);

      // Wait for session to propagate
      console.log('[GoogleAuthButton] Waiting for session propagation...');
      await new Promise(resolve => setTimeout(resolve, 2500));

    } catch (error) {
      console.error('[GoogleAuthButton] Error creating session:', error);
      throw error;
    }

    // Determine redirect URL based on user type
    let finalRedirect = returnUrl || '/';
    if (!returnUrl) {
      if (actualUserType === 'admin') {
        finalRedirect = '/admin/dashboard';
      } else if (actualUserType === 'agency') {
        finalRedirect = '/agency/dashboard';
      } else if (actualUserType === 'jobhunter') {
        finalRedirect = '/jobs';
      }
    }

    console.log('[GoogleAuthButton] Redirecting to:', finalRedirect);

    // Success callback
    if (onSuccess) {
      onSuccess();
    }

    // Use window.location for a full page reload to ensure session is recognized
    window.location.href = finalRedirect;
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);

    try {
      const auth = getAuthInstance();
      const provider = new GoogleAuthProvider();

      // Force account selection
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      console.log('[GoogleAuthButton] Starting Google sign-in...');
      console.log('[GoogleAuthButton] Current URL:', window.location.href);
      console.log('[GoogleAuthButton] Auth domain:', auth.config.authDomain);

      // Store the intended user type and return URL in sessionStorage for redirect flow
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('googleAuthUserType', userType);
        if (returnUrl) {
          sessionStorage.setItem('googleAuthReturnUrl', returnUrl);
        }

        // Store a flag to indicate we're expecting a Google redirect
        sessionStorage.setItem('googleAuthPending', 'true');

        // Also store the current page URL for debugging
        sessionStorage.setItem('googleAuthOriginUrl', window.location.href);
      }

      // Try popup first for better UX in all environments, fall back to redirect if it fails
      // Popup works better because it doesn't require page reload and is more reliable
      console.log('[GoogleAuthButton] Attempting popup method for Google sign-in...');
      try {
        const result = await signInWithPopup(auth, provider);
        console.log('[GoogleAuthButton] Popup sign-in successful:', result.user.uid);

        // Clear the pending flag since we got immediate result
        sessionStorage.removeItem('googleAuthPending');
        sessionStorage.removeItem('googleAuthOriginUrl');

        // Process the result immediately
        await handleAuthResult(result.user);
        return;
      } catch (popupError: any) {
        console.log('[GoogleAuthButton] Popup failed, falling back to redirect:', popupError.code);

        // Only fall back to redirect if popup was explicitly blocked
        // Don't fall back for auth errors or other issues
        if (popupError.code !== 'auth/popup-blocked' && popupError.code !== 'auth/popup-closed-by-user') {
          throw popupError;
        }
      }

      // Use redirect method as fallback only when popup is blocked
      console.log('[GoogleAuthButton] Using redirect method for Google sign-in...');
      await signInWithRedirect(auth, provider);
      // Page will redirect to Google, then come back
    } catch (error: any) {
      console.error('Google login error:', error);

      let errorMessage = 'Failed to sign in with Google. Please try again.';

      // Handle specific error cases
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Login cancelled. Please try again.';
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        errorMessage = 'An account already exists with this email. Please use the original login method.';
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Popup was blocked by your browser. Please allow popups for this site.';
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMessage = 'Login cancelled. Please try again.';
      } else if (error.code === 'auth/unauthorized-domain') {
        errorMessage = 'This domain is not authorized for authentication. Please contact support.';
      }

      // Error callback
      if (onError) {
        onError(errorMessage);
      }

      // Clean up sessionStorage on error
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('googleAuthUserType');
        sessionStorage.removeItem('googleAuthReturnUrl');
      }

      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="md"
      fullWidth
      onClick={handleGoogleLogin}
      disabled={disabled || isLoading}
      className="relative"
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          Signing in...
        </>
      ) : (
        <>
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {buttonText}
        </>
      )}
    </Button>
  );
}
