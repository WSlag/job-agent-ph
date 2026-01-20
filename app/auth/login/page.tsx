'use client';

import { useState, useEffect, useRef, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Phone, Mail } from 'lucide-react';
import { getDefaultRouteForUserType, buildRedirectUrl } from '@/lib/auth-redirect';
import GoogleAuthButton from '@/components/auth/GoogleAuthButton';
import PhoneInput from '@/components/auth/PhoneInput';
import OTPInput from '@/components/auth/OTPInput';
import { getRedirectResult, ConfirmationResult } from 'firebase/auth';
import { getAuthInstance, getDbInstance, cleanupRecaptchaVerifier } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { COLLECTIONS } from '@/lib/collections';

type AuthMethod = 'email' | 'phone';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, signInWithPhoneCode, sendPhoneVerificationCode, user, userType, loading: authLoading, sessionReady } = useAuth();

  // Common state
  const [authMethod, setAuthMethod] = useState<AuthMethod>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);
  const hasRedirected = useRef(false);

  // Email auth state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Phone auth state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [sendingCode, setSendingCode] = useState(false);
  const verifyingRef = useRef(false);

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
        console.log('[Login] Environment:', {
          protocol: window.location.protocol,
          hostname: window.location.hostname,
          href: window.location.href,
          cookieEnabled: navigator.cookieEnabled,
          userAgent: navigator.userAgent.substring(0, 50) + '...'
        });

        // Check if we're expecting a Google redirect
        const googleAuthPending = sessionStorage.getItem('googleAuthPending');
        const googleAuthReturnUrl = sessionStorage.getItem('googleAuthReturnUrl');
        console.log('[Login] Session storage state:', {
          googleAuthPending,
          googleAuthReturnUrl,
          allKeys: Object.keys(sessionStorage)
        });

        const auth = getAuthInstance();
        console.log('[Login] Auth instance obtained, calling getRedirectResult...');

        const result = await getRedirectResult(auth);
        console.log('[Login] getRedirectResult returned:', {
          hasResult: !!result,
          hasUser: !!result?.user,
          userId: result?.user?.uid,
          email: result?.user?.email
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
          console.log('[Login] Google auth was pending but no result received - this may indicate an issue');
          sessionStorage.removeItem('googleAuthPending');
        }
      } catch (error: any) {
        console.error('[Login] Error handling Google redirect:', error);
        console.error('[Login] Error details:', {
          code: error?.code,
          message: error?.message,
          stack: error?.stack?.substring(0, 200)
        });

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

  // Clean up reCAPTCHA when switching auth methods or unmounting
  useEffect(() => {
    return () => {
      cleanupRecaptchaVerifier();
    };
  }, []);

  // Reset phone state when switching to email
  useEffect(() => {
    if (authMethod === 'email') {
      setShowOTPInput(false);
      setConfirmationResult(null);
      setPhoneNumber('');
      cleanupRecaptchaVerifier();
    }
  }, [authMethod]);

  const handleSendPhoneCode = async () => {
    if (!isPhoneValid) {
      setError('Please enter a valid Philippine mobile number');
      return;
    }

    setError('');
    setSendingCode(true);

    try {
      const result = await sendPhoneVerificationCode(phoneNumber);
      setConfirmationResult(result);
      setShowOTPInput(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send verification code');
    } finally {
      setSendingCode(false);
    }
  };

  const handleVerifyPhoneCode = useCallback(async (code: string) => {
    // Prevent duplicate verification calls
    if (verifyingRef.current) {
      console.log('[LoginPage] Verification already in progress, skipping duplicate call');
      return;
    }

    if (!confirmationResult) {
      setError('Please request a new verification code');
      return;
    }

    verifyingRef.current = true;
    setError('');
    setLoading(true);

    try {
      await signInWithPhoneCode(confirmationResult, code);
      // Redirect is handled by useEffect after userType is loaded
    } catch (err: any) {
      setError(err.message || 'Failed to verify code');
      setLoading(false);
      verifyingRef.current = false; // Reset on error to allow retry
    }
  }, [confirmationResult, signInWithPhoneCode]);

  const handleResendCode = async () => {
    setError('');
    setShowOTPInput(false);
    setConfirmationResult(null);
    verifyingRef.current = false; // Reset verification guard
    cleanupRecaptchaVerifier();

    // Small delay to allow cleanup
    await new Promise(resolve => setTimeout(resolve, 100));
    await handleSendPhoneCode();
  };

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
          {/* Phone Sign-In Button */}
          <div className="mb-4">
            <button
              type="button"
              onClick={() => setAuthMethod('phone')}
              disabled={loading || sendingCode}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <Phone size={20} />
              Continue with Phone
            </button>
          </div>

          {/* Google Sign-In Button */}
          <div className="mb-6">
            <GoogleAuthButton
              userType="jobhunter"
              returnUrl={searchParams.get('redirect') || undefined}
              onError={(errorMsg) => setError(errorMsg)}
              disabled={loading || sendingCode}
            />
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className={`mb-4 px-4 py-3 rounded-lg ${
              error.includes('Google sign-in')
                ? 'bg-blue-50 border border-blue-200 text-blue-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {error}
              {error.includes('Google sign-in') && (
                <p className="mt-2 text-sm font-medium">
                  Use the "Continue with Google" button above
                </p>
              )}
            </div>
          )}

          {/* Email Login Form */}
          {authMethod === 'email' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="login-email"
                  name="email"
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
                  <label htmlFor="login-password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
                    Forgot password?
                  </Link>
                </div>
                <input
                  id="login-password"
                  name="password"
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
          )}

          {/* Phone Login Form */}
          {authMethod === 'phone' && (
            <div className="space-y-4">
              {!showOTPInput ? (
                <>
                  <PhoneInput
                    value={phoneNumber}
                    onChange={(phone, isValid) => {
                      setPhoneNumber(phone);
                      setIsPhoneValid(isValid);
                    }}
                    disabled={sendingCode}
                    label="Phone Number"
                    placeholder="917 123 4567"
                  />

                  <button
                    type="button"
                    onClick={handleSendPhoneCode}
                    disabled={sendingCode || !isPhoneValid}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {sendingCode ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Sending code...
                      </>
                    ) : (
                      'Send Verification Code'
                    )}
                  </button>
                </>
              ) : (
                <>
                  <div className="text-center mb-4">
                    <p className="text-gray-600">
                      Enter the 6-digit code sent to
                    </p>
                    <p className="font-medium text-gray-900">{phoneNumber}</p>
                  </div>

                  <OTPInput
                    onComplete={handleVerifyPhoneCode}
                    onResend={handleResendCode}
                    error={error ? undefined : undefined}
                    disabled={loading}
                  />

                  {loading && (
                    <div className="flex items-center justify-center gap-2 text-blue-600">
                      <Loader2 className="animate-spin" size={20} />
                      <span>Verifying...</span>
                    </div>
                  )}

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setShowOTPInput(false);
                      setConfirmationResult(null);
                      setError('');
                      verifyingRef.current = false; // Reset verification guard
                      cleanupRecaptchaVerifier();
                    }}
                    className="w-full text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
                  >
                    Use a different number
                  </button>
                </>
              )}
            </div>
          )}

          {/* reCAPTCHA container - must be present in DOM for phone auth */}
          <div id="recaptcha-container"></div>

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
