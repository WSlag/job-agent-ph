'use client';

import { useState, useEffect, useRef, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { UserType } from '@/types';
import { Loader2, Phone, ArrowLeft } from 'lucide-react';
import { getDefaultRouteForUserType, buildRedirectUrl } from '@/lib/auth-redirect';
import GoogleAuthButton from '@/components/auth/GoogleAuthButton';
import PhoneInput from '@/components/auth/PhoneInput';
import OTPInput from '@/components/auth/OTPInput';
import { getRedirectResult, ConfirmationResult } from 'firebase/auth';
import { getAuthInstance, getDbInstance, cleanupRecaptchaVerifier } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { COLLECTIONS } from '@/lib/collections';
import { LEGAL_VERSIONS } from '@/lib/legal-versions';

type SignupMethod = 'email' | 'phone';

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signUp, signUpWithPhone, sendPhoneVerificationCode, user, userType: contextUserType, loading: authLoading, sessionReady } = useAuth();

  // Signup method state
  const [signupMethod, setSignupMethod] = useState<SignupMethod | null>(null);

  const [userType, setUserType] = useState<UserType>('jobhunter');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);
  const hasRedirected = useRef(false);

  // Job Hunter fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [location, setLocation] = useState('');

  // Agency fields
  const [companyName, setCompanyName] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // Legal acceptance fields
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [acceptedAgencyTerms, setAcceptedAgencyTerms] = useState(false);

  // Phone auth state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [sendingCode, setSendingCode] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const sendingCodeRef = useRef(false);
  const lastSendTime = useRef<number>(0);

  // Helper function to process Google authentication result
  const processGoogleAuthResult = async (user: any) => {
    try {
      const db = getDbInstance();
      const userId = user.uid;

      console.log('[Signup] Processing Google auth for user:', userId);

      // Get stored user type and return URL from sessionStorage
      const storedUserType = sessionStorage.getItem('googleAuthUserType') || userType || 'jobhunter';
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

        const now = new Date();

        // IMPORTANT: Google sign-up requires users to accept terms during the OAuth flow
        // We assume implicit acceptance when they complete Google sign-in
        const legalFields = {
          termsAcceptedAt: now,
          termsVersion: LEGAL_VERSIONS.TERMS_OF_SERVICE,
          privacyAcceptedAt: now,
          privacyVersion: LEGAL_VERSIONS.PRIVACY_POLICY,
        };

        // Create user document with legal acceptance fields
        const userDoc: any = {
          email: user.email,
          userType: storedUserType,
          createdAt: now,
          updatedAt: now,
          ...legalFields,
        };

        // Note: For Google sign-up, age will be entered later in profile completion

        await setDoc(doc(db, COLLECTIONS.USERS, userId), userDoc);

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
            createdAt: now,
            updatedAt: now,
            ...legalFields,
            // Age will be entered in profile completion
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
            createdAt: now,
            updatedAt: now,
            ...legalFields,
            agencyTermsAcceptedAt: now,
            agencyTermsVersion: LEGAL_VERSIONS.AGENCY_TERMS,
          });
        }
      }

      // CRITICAL: Create session cookie
      console.log('[Signup] Creating session cookie...');
      const idToken = await user.getIdToken(true);

      const sessionResponse = await fetch('/api/auth/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      if (!sessionResponse.ok) {
        console.error('[Signup] Failed to create session cookie');
        const errorData = await sessionResponse.json().catch(() => ({}));
        console.error('[Signup] Session error details:', errorData);
        throw new Error('Failed to create session cookie. Please try again.');
      }

      const sessionData = await sessionResponse.json();
      console.log('[Signup] Session cookie created successfully:', sessionData);

      // Clean up sessionStorage
      sessionStorage.removeItem('googleAuthUserType');
      sessionStorage.removeItem('googleAuthReturnUrl');

      // Wait for session cookie to propagate
      console.log('[Signup] Waiting for session propagation...');
      await new Promise(resolve => setTimeout(resolve, 2500));

      // Send welcome email and message (non-blocking) - AFTER session is ready
      console.log('[Signup] Triggering welcome message...');
      if (storedUserType === 'jobhunter') {
        fetch('/api/jobhunter/welcome', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jobHunterId: userId }),
        }).catch(err => console.error('Failed to send welcome message:', err));
      } else if (storedUserType === 'agency') {
        fetch('/api/agency/welcome', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ agencyId: userId }),
        }).catch(err => console.error('Failed to send welcome message:', err));
      }

      // Determine the appropriate redirect URL
      let finalRedirect = storedReturnUrl || '/';

      // If no stored URL, determine based on user type
      if (!storedReturnUrl) {
        const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, userId));
        const userData = userDoc.data();
        const actualUserType = userData?.userType || storedUserType;

        console.log('[Signup] User type:', actualUserType);

        if (actualUserType === 'admin') {
          finalRedirect = '/admin/dashboard';
        } else if (actualUserType === 'agency') {
          finalRedirect = '/agency/dashboard';
        } else if (actualUserType === 'jobhunter') {
          finalRedirect = '/jobs';
        }
      }

      console.log('[Signup] Redirecting to:', finalRedirect);
      setIsRedirecting(true);

      // Use window.location for full page reload
      window.location.href = finalRedirect;
    } catch (error) {
      console.error('[Signup] Error processing Google auth:', error);
      setError('Failed to complete Google sign-in. Please try again.');
      setLoading(false);
    }
  };

  // Handle Google redirect result when page loads
  useEffect(() => {
    const handleGoogleRedirect = async () => {
      try {
        console.log('[Signup] Checking for Google redirect result...');

        // Check if we're expecting a Google redirect
        const googleAuthPending = sessionStorage.getItem('googleAuthPending');
        console.log('[Signup] Google auth pending flag:', googleAuthPending);

        const auth = getAuthInstance();
        console.log('[Signup] Auth instance obtained, calling getRedirectResult...');

        const result = await getRedirectResult(auth);
        console.log('[Signup] getRedirectResult returned:', {
          hasResult: !!result,
          hasUser: !!result?.user,
          userId: result?.user?.uid
        });

        if (result && result.user) {
          // Clear the pending flag
          sessionStorage.removeItem('googleAuthPending');

          // Google sign-in successful, handle session creation HERE
          console.log('[Signup] Google redirect result received, processing authentication...');
          console.log('[Signup] User details:', {
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName
          });

          // Process the authentication result directly here
          await processGoogleAuthResult(result.user);
        } else if (googleAuthPending) {
          console.log('[Signup] Google auth was pending but no result received');
          sessionStorage.removeItem('googleAuthPending');
        }
      } catch (error: any) {
        console.error('[Signup] Error handling Google redirect:', error);
        console.error('[Signup] Error code:', error?.code);
        console.error('[Signup] Error message:', error?.message);

        // Clean up pending flag on error
        sessionStorage.removeItem('googleAuthPending');
      }
    };

    handleGoogleRedirect();
  }, [router]);

  // Handle redirect after authentication - only redirect once
  useEffect(() => {
    if (user && contextUserType && !authLoading && sessionReady && !hasRedirected.current) {
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
        finalRedirect = getDefaultRouteForUserType(contextUserType);
      }

      hasRedirected.current = true;
      setIsRedirecting(true);
      // Use replace instead of push to prevent back button issues
      router.replace(finalRedirect);
    }
  }, [user, contextUserType, authLoading, sessionReady, router, searchParams]);

  // Set user type from query parameter
  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'jobhunter' || type === 'agency') {
      setUserType(type);
    }
  }, [searchParams]);

  // Clean up reCAPTCHA on unmount
  useEffect(() => {
    return () => {
      cleanupRecaptchaVerifier();
    };
  }, []);

  // Reset phone state when changing signup method
  useEffect(() => {
    if (signupMethod !== 'phone') {
      setShowOTPInput(false);
      setConfirmationResult(null);
      setPhoneNumber('');
      setPhoneVerified(false);
      cleanupRecaptchaVerifier();
    }
  }, [signupMethod]);

  const handleSendPhoneCode = async () => {
    if (!isPhoneValid) {
      setError('Please enter a valid Philippine mobile number');
      return;
    }

    // Prevent duplicate calls with ref and time-based debounce
    const now = Date.now();
    const MIN_SEND_INTERVAL = 10000; // 10 seconds minimum between sends
    if (sendingCodeRef.current || now - lastSendTime.current < MIN_SEND_INTERVAL) {
      console.log('[SignupPage] Send code already in progress or too soon, skipping');
      return;
    }

    sendingCodeRef.current = true;
    lastSendTime.current = now;
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
      sendingCodeRef.current = false;
    }
  };

  // Store the OTP code for later use when submitting the form
  const [otpCode, setOtpCode] = useState('');
  const verifyingRef = useRef(false);

  const handleVerifyPhoneCode = useCallback(async (code: string) => {
    // Prevent duplicate calls (from React StrictMode or OTPInput re-renders)
    if (verifyingRef.current || phoneVerified) {
      console.log('[SignupPage] Verification already processed, skipping duplicate call');
      return;
    }

    if (!confirmationResult) {
      setError('Please request a new verification code');
      return;
    }

    verifyingRef.current = true;
    setError('');

    // Store the code for later submission
    setOtpCode(code);
    // Mark phone as verified - user will complete profile form
    setPhoneVerified(true);
    setShowOTPInput(false);
  }, [confirmationResult, phoneVerified]);

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

  const handlePhoneSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!confirmationResult) {
      setError('Please verify your phone number first');
      return;
    }

    // Validate terms acceptance
    if (!acceptedTerms) {
      setError('You must accept the Terms of Service to continue');
      return;
    }

    if (!acceptedPrivacy) {
      setError('You must accept the Privacy Policy to continue');
      return;
    }

    setLoading(true);

    try {
      let profileData: any;

      if (userType === 'jobhunter') {
        if (!firstName || !lastName || !location) {
          setError('Please fill in all required fields');
          setLoading(false);
          return;
        }

        profileData = {
          firstName,
          lastName,
          location,
          skills: [],
          experience: 0,
          termsAcceptedAt: new Date(),
          termsVersion: LEGAL_VERSIONS.TERMS_OF_SERVICE,
          privacyAcceptedAt: new Date(),
          privacyVersion: LEGAL_VERSIONS.PRIVACY_POLICY,
        };
      } else {
        if (!companyName || !registrationNumber || !contactPerson || !address) {
          setError('Please fill in all required fields');
          setLoading(false);
          return;
        }

        // Validate agency terms acceptance
        if (!acceptedAgencyTerms) {
          setError('You must accept the Agency Terms of Service to continue');
          setLoading(false);
          return;
        }

        profileData = {
          companyName,
          registrationNumber,
          contactPerson,
          phone: phoneNumber, // Use verified phone number
          address,
          termsAcceptedAt: new Date(),
          termsVersion: LEGAL_VERSIONS.TERMS_OF_SERVICE,
          privacyAcceptedAt: new Date(),
          privacyVersion: LEGAL_VERSIONS.PRIVACY_POLICY,
          agencyTermsAcceptedAt: new Date(),
          agencyTermsVersion: LEGAL_VERSIONS.AGENCY_TERMS,
        };
      }

      await signUpWithPhone(confirmationResult, otpCode, userType, profileData);
      // Redirect is handled by useEffect after userType is loaded
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to sign up';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate password match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    // Validate terms acceptance
    if (!acceptedTerms) {
      setError('You must accept the Terms of Service to continue');
      return;
    }

    if (!acceptedPrivacy) {
      setError('You must accept the Privacy Policy to continue');
      return;
    }

    setLoading(true);

    try {
      let profileData: any;

      if (userType === 'jobhunter') {
        if (!firstName || !lastName || !location) {
          setError('Please fill in all required fields');
          setLoading(false);
          return;
        }

        profileData = {
          firstName,
          lastName,
          location,
          skills: [],
          experience: 0,
          termsAcceptedAt: new Date(),
          termsVersion: LEGAL_VERSIONS.TERMS_OF_SERVICE,
          privacyAcceptedAt: new Date(),
          privacyVersion: LEGAL_VERSIONS.PRIVACY_POLICY,
        };
      } else {
        if (!companyName || !registrationNumber || !contactPerson || !phone || !address) {
          setError('Please fill in all required fields');
          setLoading(false);
          return;
        }

        // Validate agency terms acceptance
        if (!acceptedAgencyTerms) {
          setError('You must accept the Agency Terms of Service to continue');
          setLoading(false);
          return;
        }

        profileData = {
          companyName,
          registrationNumber,
          contactPerson,
          phone,
          address,
          termsAcceptedAt: new Date(),
          termsVersion: LEGAL_VERSIONS.TERMS_OF_SERVICE,
          privacyAcceptedAt: new Date(),
          privacyVersion: LEGAL_VERSIONS.PRIVACY_POLICY,
          agencyTermsAcceptedAt: new Date(),
          agencyTermsVersion: LEGAL_VERSIONS.AGENCY_TERMS,
        };
      }

      await signUp(email, password, userType, profileData);
      // Redirect is handled by useEffect after userType is loaded
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to sign up';
      setError(errorMessage);

      // If email already in use, suggest login
      if (errorMessage.includes('already registered')) {
        const redirectParam = searchParams.get('redirect');
        const jobId = searchParams.get('jobId');
        const agencyId = searchParams.get('agencyId');
        const action = searchParams.get('action');

        const loginParams = new URLSearchParams();
        if (redirectParam) loginParams.append('redirect', redirectParam);
        if (jobId) loginParams.append('jobId', jobId);
        if (agencyId) loginParams.append('agencyId', agencyId);
        if (action) loginParams.append('action', action);

        setTimeout(() => {
          if (confirm('This email is already registered. Would you like to go to the login page?')) {
            router.push(`/auth/login?${loginParams.toString()}`);
          }
        }, 100);
      }
    } finally {
      setLoading(false);
    }
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Job Agent PH
          </h1>
          <p className="text-gray-600">
            {userType === 'jobhunter'
              ? 'Start your journey to finding jobs abroad now!'
              : 'Start your journey to finding applicants now!'}
          </p>
        </div>

        {/* Role Toggle */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex bg-gray-100 rounded-full p-1.5">
            <button
              type="button"
              onClick={() => setUserType('jobhunter')}
              className={`px-8 py-3 rounded-full text-base font-medium transition-all ${
                userType === 'jobhunter'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Job Hunter
            </button>
            <button
              type="button"
              onClick={() => setUserType('agency')}
              className={`px-8 py-3 rounded-full text-base font-medium transition-all ${
                userType === 'agency'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Agency
            </button>
          </div>
        </div>

        {/* Sign Up Form */}
        <div className="bg-white p-8 rounded-xl shadow-md">
          {/* Method Selection - show only if method not selected yet */}
          {!signupMethod && !phoneVerified && (
            <>
              {/* Phone Sign-Up Button */}
              <div className="mb-4">
                <button
                  type="button"
                  onClick={() => setSignupMethod('phone')}
                  disabled={loading || sendingCode}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <Phone size={20} />
                  Sign up with Phone
                </button>
              </div>

              {/* Google Sign-Up Button */}
              <div className="mb-4">
                <GoogleAuthButton
                  userType={userType}
                  returnUrl={searchParams.get('redirect') || undefined}
                  onError={(errorMsg) => setError(errorMsg)}
                  disabled={loading || sendingCode}
                  buttonText="Sign up with Google"
                />
              </div>

              {/* Divider */}
              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or</span>
                </div>
              </div>

              {/* Email Sign-Up Button */}
              <button
                type="button"
                onClick={() => setSignupMethod('email')}
                disabled={loading || sendingCode}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Sign up with Email
              </button>
            </>
          )}

          {/* Phone Verification Flow */}
          {signupMethod === 'phone' && !phoneVerified && (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => {
                  setSignupMethod(null);
                  setShowOTPInput(false);
                  setConfirmationResult(null);
                  setPhoneNumber('');
                  verifyingRef.current = false; // Reset verification guard
                  cleanupRecaptchaVerifier();
                }}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium mb-4"
              >
                <ArrowLeft size={16} />
                Back to options
              </button>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

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

          {/* Phone Profile Form - after phone is verified */}
          {signupMethod === 'phone' && phoneVerified && (
            <form onSubmit={handlePhoneSignupSubmit} className="space-y-4">
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
                <p className="font-medium">Phone verified: {phoneNumber}</p>
                <p className="text-sm">Complete your profile below</p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Job Hunter Specific Fields */}
              {userType === 'jobhunter' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone-signup-first-name" className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        id="phone-signup-first-name"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone-signup-last-name" className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        id="phone-signup-last-name"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone-signup-location" className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      id="phone-signup-location"
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g., Manila, Philippines"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </>
              )}

              {/* Agency Specific Fields */}
              {userType === 'agency' && (
                <>
                  <div>
                    <label htmlFor="phone-signup-company-name" className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    <input
                      id="phone-signup-company-name"
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone-signup-registration-number" className="block text-sm font-medium text-gray-700 mb-2">
                      Registration Number
                    </label>
                    <input
                      id="phone-signup-registration-number"
                      type="text"
                      value={registrationNumber}
                      onChange={(e) => setRegistrationNumber(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone-signup-contact-person" className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Person
                    </label>
                    <input
                      id="phone-signup-contact-person"
                      type="text"
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone-signup-address" className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <textarea
                      id="phone-signup-address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </>
              )}

              {/* Legal Acceptance */}
              <div className="border-t pt-4 mt-4">
                <div className="flex items-start gap-3">
                  <input
                    id="phone-accept-all-terms"
                    type="checkbox"
                    checked={acceptedTerms && acceptedPrivacy && (userType !== 'agency' || acceptedAgencyTerms)}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setAcceptedTerms(checked);
                      setAcceptedPrivacy(checked);
                      if (userType === 'agency') {
                        setAcceptedAgencyTerms(checked);
                      }
                    }}
                    required
                    className="mt-0.5 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded flex-shrink-0"
                  />
                  <label htmlFor="phone-accept-all-terms" className="text-sm text-gray-700 leading-relaxed">
                    {userType === 'jobhunter' ? (
                      <>
                        By creating an account, you agree to our{' '}
                        <Link href="/terms" target="_blank" className="text-blue-600 hover:underline font-medium">
                          Terms
                        </Link>
                        {', '}
                        <Link href="/privacy" target="_blank" className="text-blue-600 hover:underline font-medium">
                          Privacy Policy
                        </Link>
                        , and confirm you are 18+ years old.
                      </>
                    ) : (
                      <>
                        By creating an account, you agree to our{' '}
                        <Link href="/terms" target="_blank" className="text-blue-600 hover:underline font-medium">
                          Terms
                        </Link>
                        {', '}
                        <Link href="/privacy" target="_blank" className="text-blue-600 hover:underline font-medium">
                          Privacy Policy
                        </Link>
                        {', '}
                        <Link href="/agency-terms" target="_blank" className="text-blue-600 hover:underline font-medium">
                          Agency Terms
                        </Link>
                        , and certify you hold a valid DMW license.
                      </>
                    )}
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setSignupMethod(null);
                  setPhoneVerified(false);
                  setShowOTPInput(false);
                  setConfirmationResult(null);
                  setPhoneNumber('');
                  verifyingRef.current = false; // Reset verification guard
                  cleanupRecaptchaVerifier();
                }}
                className="w-full text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
              >
                Start over with different method
              </button>
            </form>
          )}

          {/* Email Sign-Up Form */}
          {signupMethod === 'email' && (
            <>
              <button
                type="button"
                onClick={() => setSignupMethod(null)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium mb-4"
              >
                <ArrowLeft size={16} />
                Back to options
              </button>

              <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <p>{error}</p>
                {error.includes('already registered') && (() => {
                  const redirectParam = searchParams.get('redirect');
                  const jobId = searchParams.get('jobId');
                  const agencyId = searchParams.get('agencyId');
                  const action = searchParams.get('action');
                  const loginParams = new URLSearchParams();
                  if (redirectParam) loginParams.append('redirect', redirectParam);
                  if (jobId) loginParams.append('jobId', jobId);
                  if (agencyId) loginParams.append('agencyId', agencyId);
                  if (action) loginParams.append('action', action);

                  return (
                    <Link
                      href={`/auth/login?${loginParams.toString()}`}
                      className="inline-block mt-2 text-sm font-semibold text-red-800 hover:text-red-900 underline"
                    >
                      Go to Login Page →
                    </Link>
                  );
                })()}
              </div>
            )}

            {/* Common Fields */}
            <div>
              <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="signup-email"
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
              <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="signup-password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="signup-confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                id="signup-confirm-password"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Job Hunter Specific Fields */}
            {userType === 'jobhunter' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="signup-first-name" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      id="signup-first-name"
                      name="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      autoComplete="given-name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="signup-last-name" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      id="signup-last-name"
                      name="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      autoComplete="family-name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="signup-location" className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    id="signup-location"
                    name="location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Manila, Philippines"
                    required
                    autoComplete="address-level2"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </>
            )}

            {/* Agency Specific Fields */}
            {userType === 'agency' && (
              <>
                <div>
                  <label htmlFor="signup-company-name" className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    id="signup-company-name"
                    name="companyName"
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                    autoComplete="organization"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="signup-registration-number" className="block text-sm font-medium text-gray-700 mb-2">
                    Registration Number
                  </label>
                  <input
                    id="signup-registration-number"
                    name="registrationNumber"
                    type="text"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    required
                    autoComplete="off"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="signup-contact-person" className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Person
                  </label>
                  <input
                    id="signup-contact-person"
                    name="contactPerson"
                    type="text"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    required
                    autoComplete="name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="signup-phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    id="signup-phone"
                    name="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    autoComplete="tel"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="signup-address" className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    id="signup-address"
                    name="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    rows={3}
                    autoComplete="street-address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </>
            )}

            {/* Simplified Legal Acceptance */}
            <div className="border-t pt-4 mt-4">
              <div className="flex items-start gap-3">
                <input
                  id="accept-all-terms"
                  type="checkbox"
                  checked={acceptedTerms && acceptedPrivacy && (userType !== 'agency' || acceptedAgencyTerms)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setAcceptedTerms(checked);
                    setAcceptedPrivacy(checked);
                    if (userType === 'agency') {
                      setAcceptedAgencyTerms(checked);
                    }
                  }}
                  required
                  className="mt-0.5 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded flex-shrink-0"
                />
                <label htmlFor="accept-all-terms" className="text-sm text-gray-700 leading-relaxed">
                  {userType === 'jobhunter' ? (
                    <>
                      By creating an account, you agree to our{' '}
                      <Link href="/terms" target="_blank" className="text-blue-600 hover:underline font-medium">
                        Terms
                      </Link>
                      {', '}
                      <Link href="/privacy" target="_blank" className="text-blue-600 hover:underline font-medium">
                        Privacy Policy
                      </Link>
                      , and confirm you are 18+ years old.
                    </>
                  ) : (
                    <>
                      By creating an account, you agree to our{' '}
                      <Link href="/terms" target="_blank" className="text-blue-600 hover:underline font-medium">
                        Terms
                      </Link>
                      {', '}
                      <Link href="/privacy" target="_blank" className="text-blue-600 hover:underline font-medium">
                        Privacy Policy
                      </Link>
                      {', '}
                      <Link href="/agency-terms" target="_blank" className="text-blue-600 hover:underline font-medium">
                        Agency Terms
                      </Link>
                      , and certify you hold a valid DMW license.
                    </>
                  )}
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
            </>
          )}

          {/* reCAPTCHA container - must be present in DOM for phone auth */}
          <div id="recaptcha-container"></div>

          <div className="text-center mt-6 space-y-4">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-blue-600 hover:underline font-semibold">
                Login
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

export default function SignUpPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    }>
      <SignUpForm />
    </Suspense>
  );
}
