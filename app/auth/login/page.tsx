'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { getDefaultRouteForUserType, buildRedirectUrl } from '@/lib/auth-redirect';
import GoogleAuthButton from '@/components/auth/GoogleAuthButton';
import { getRedirectResult } from 'firebase/auth';
import { getAuthInstance, getDbInstance } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { COLLECTIONS } from '@/lib/collections';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, user, userType, loading: authLoading, sessionReady } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);
  const hasRedirected = useRef(false);

  // Helper function to process Google authentication result
  const processGoogleAuthResult = async (user: any) => {
    try {
      const db = getDbInstance();
      const userId = user.uid;

      console.log('[Login] Processing Google auth for user:', userId);

      // Get stored user type and return URL from sessionStorage
      const storedUserType = sessionStorage.getItem('googleAuthUserType') || 'jobhunter';
      const storedReturnUrl = sessionStorage.getItem('googleAuthReturnUrl');

      // Check if user profile already exists in any collection
      const [adminDoc, jobHunterDoc, agencyDoc] = await Promise.all([
        getDoc(doc(db, COLLECTIONS.ADMINS, userId)),
        getDoc(doc(db, COLLECTIONS.JOB_HUNTERS, userId)),
        getDoc(doc(db, COLLECTIONS.AGENCIES, userId))
      ]);

      // If no profile exists, create one based on stored userType
      if (!adminDoc.exists() && !jobHunterDoc.exists() && !agencyDoc.exists()) {
        const displayName = user.displayName || 'User';
        const nameParts = displayName.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        // Create user document
        await setDoc(doc(db, COLLECTIONS.USERS, userId), {
          email: user.email,
          userType: storedUserType,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        // Create profile based on user type
        if (storedUserType === 'jobhunter') {
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
        } else if (storedUserType === 'agency') {
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
      console.log('[Login] Creating session cookie...');
      const idToken = await user.getIdToken(true);

      const sessionResponse = await fetch('/api/auth/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      if (!sessionResponse.ok) {
        console.error('[Login] Failed to create session cookie');
        const errorData = await sessionResponse.json().catch(() => ({}));
        console.error('[Login] Session error details:', errorData);
        throw new Error('Failed to create session cookie. Please try again.');
      }

      const sessionData = await sessionResponse.json();
      console.log('[Login] Session cookie created successfully:', sessionData);

      // Clean up sessionStorage
      sessionStorage.removeItem('googleAuthUserType');
      sessionStorage.removeItem('googleAuthReturnUrl');

      // Wait for session cookie to propagate
      console.log('[Login] Waiting for session propagation...');
      await new Promise(resolve => setTimeout(resolve, 2500));

      // Determine the appropriate redirect URL
      let finalRedirect = storedReturnUrl || '/';

      // If no stored URL, determine based on user type
      if (!storedReturnUrl) {
        const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, userId));
        const userData = userDoc.data();
        const actualUserType = userData?.userType || storedUserType;

        console.log('[Login] User type:', actualUserType);

        if (actualUserType === 'admin') {
          finalRedirect = '/admin/dashboard';
        } else if (actualUserType === 'agency') {
          finalRedirect = '/agency/dashboard';
        } else if (actualUserType === 'jobhunter') {
          finalRedirect = '/jobs';
        }
      }

      console.log('[Login] Redirecting to:', finalRedirect);
      setIsRedirecting(true);

      // Use window.location for full page reload
      window.location.href = finalRedirect;
    } catch (error) {
      console.error('[Login] Error processing Google auth:', error);
      setError('Failed to complete Google sign-in. Please try again.');
      setLoading(false);
    }
  };

  // Handle Google redirect result when page loads
  useEffect(() => {
    const handleGoogleRedirect = async () => {
      try {
        console.log('[Login] Checking for Google redirect result...');

        // Check if we're expecting a Google redirect
        const googleAuthPending = sessionStorage.getItem('googleAuthPending');
        console.log('[Login] Google auth pending flag:', googleAuthPending);

        const auth = getAuthInstance();
        console.log('[Login] Auth instance obtained, calling getRedirectResult...');

        const result = await getRedirectResult(auth);
        console.log('[Login] getRedirectResult returned:', {
          hasResult: !!result,
          hasUser: !!result?.user,
          userId: result?.user?.uid
        });

        if (result && result.user) {
          // Clear the pending flag
          sessionStorage.removeItem('googleAuthPending');

          // Google sign-in successful, handle session creation HERE
          console.log('[Login] Google redirect result received, processing authentication...');
          console.log('[Login] User details:', {
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName
          });

          // Process the authentication result directly here
          await processGoogleAuthResult(result.user);
        } else if (googleAuthPending) {
          console.log('[Login] Google auth was pending but no result received');
          sessionStorage.removeItem('googleAuthPending');
        }
      } catch (error: any) {
        console.error('[Login] Error handling Google redirect:', error);
        console.error('[Login] Error code:', error?.code);
        console.error('[Login] Error message:', error?.message);

        // Clean up pending flag on error
        sessionStorage.removeItem('googleAuthPending');
      }
    };

    handleGoogleRedirect();
  }, [router]);

  // Handle redirect after authentication
  useEffect(() => {
    console.log('[LoginPage] Auth state:', {
      hasUser: !!user,
      userType,
      authLoading,
      sessionReady,
      isRedirecting,
      hasRedirected: hasRedirected.current
    });

    // Only redirect once session is ready - use ref to prevent multiple redirects
    if (user && userType && !authLoading && sessionReady && !hasRedirected.current) {
      const redirectParam = searchParams.get('redirect');
      const jobId = searchParams.get('jobId');
      const agencyId = searchParams.get('agencyId');
      const action = searchParams.get('action');

      let finalRedirect: string;

      if (redirectParam) {
        // Use specified redirect with preserved query params
        finalRedirect = buildRedirectUrl(redirectParam, {
          jobId,
          agencyId,
          action
        });
      } else {
        // Use role-based default redirect
        finalRedirect = getDefaultRouteForUserType(userType);
      }

      console.log('[LoginPage] Redirecting to:', finalRedirect);
      hasRedirected.current = true;
      setIsRedirecting(true);

      // Use window.location.href for full page reload to ensure session cookie is sent with request
      // The signIn function verifies the cookie is set before this executes
      // This prevents middleware race condition where cookie might not be available yet
      setTimeout(() => {
        window.location.href = finalRedirect;
      }, 100);
    }
  }, [user, userType, authLoading, sessionReady, router, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      // Redirect is handled by useEffect after userType is loaded
    } catch (err: any) {
      setError(err.message || 'Failed to login');
      setLoading(false);
    }
    // Don't set loading to false on success - let redirect handle it
  };

  // Show redirecting state
  if (isRedirecting) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Redirecting to your dashboard...</h2>
          <p className="text-gray-600">Please wait</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back!
          </h1>
          <p className="text-gray-600">
            Login to Job Agent PH
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-md">
          {/* Google Sign-In Button */}
          <div className="mb-6">
            <GoogleAuthButton
              userType="jobhunter"
              returnUrl={searchParams.get('redirect') || undefined}
              onError={(errorMsg) => setError(errorMsg)}
              disabled={loading}
            />
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className={`px-4 py-3 rounded-lg ${
                error.includes('Google sign-in')
                  ? 'bg-blue-50 border border-blue-200 text-blue-700'
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
                {error}
                {error.includes('Google sign-in') && (
                  <p className="mt-2 text-sm font-medium">
                    👆 Use the "Continue with Google" button above
                  </p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>

          <div className="text-center mt-6 space-y-4">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-blue-600 hover:underline font-semibold">
                Sign Up
              </Link>
            </p>
            <button
              type="button"
              onClick={() => router.push('/')}
              className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
            >
              Maybe Later - Continue Browsing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
