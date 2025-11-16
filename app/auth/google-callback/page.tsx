'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getRedirectResult } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuthInstance, getDbInstance } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/collections';
import { Loader2 } from 'lucide-react';

/**
 * Google Authentication Callback Page
 *
 * This page handles the redirect result from Google sign-in.
 * It processes the authentication result, creates user profiles if needed,
 * and redirects to the appropriate page.
 */
export default function GoogleCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const auth = getAuthInstance();
        const db = getDbInstance();

        // Get the redirect result
        const result = await getRedirectResult(auth);

        if (!result) {
          // No redirect result, redirect to login
          console.log('No redirect result found');
          router.push('/auth/login');
          return;
        }

        const user = result.user;
        const userId = user.uid;

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

        // CRITICAL FIX: Create session cookie before redirecting
        console.log('[Google Callback] Creating session cookie...');

        // Get a fresh ID token
        const idToken = await user.getIdToken(true); // Force refresh to ensure it's current
        console.log('[Google Callback] Fresh ID token obtained');

        // Create session cookie by calling the session API
        const sessionResponse = await fetch('/api/auth/session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ idToken }),
        });

        if (!sessionResponse.ok) {
          console.error('[Google Callback] Failed to create session cookie');
          const errorData = await sessionResponse.json().catch(() => ({}));
          console.error('[Google Callback] Session error details:', errorData);
          throw new Error('Failed to create session cookie. Please try again.');
        }

        const sessionData = await sessionResponse.json();
        console.log('[Google Callback] Session cookie created successfully:', sessionData);

        // Clean up sessionStorage
        sessionStorage.removeItem('googleAuthUserType');
        sessionStorage.removeItem('googleAuthReturnUrl');

        // Wait for session cookie to propagate (same as email login)
        console.log('[Google Callback] Waiting for session propagation...');
        await new Promise(resolve => setTimeout(resolve, 2500));

        // Determine the appropriate redirect URL
        let finalRedirect = storedReturnUrl || '/';

        // If no stored URL, determine based on user type
        if (!storedReturnUrl) {
          const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, userId));
          const userData = userDoc.data();
          const userType = userData?.userType || storedUserType;

          console.log('[Google Callback] User type:', userType);

          if (userType === 'admin') {
            finalRedirect = '/admin/dashboard';
          } else if (userType === 'agency') {
            finalRedirect = '/agency/dashboard';
          } else if (userType === 'jobhunter') {
            finalRedirect = '/jobs';
          }
        }

        console.log('[Google Callback] Redirecting to:', finalRedirect);

        // Use router.push for client-side navigation
        router.push(finalRedirect);
      } catch (error: any) {
        console.error('Error handling redirect result:', error);

        let errorMessage = 'Authentication failed. Please try again.';

        if (error.code === 'auth/user-cancelled') {
          errorMessage = 'Sign-in was cancelled. Please try again.';
        } else if (error.code === 'auth/operation-not-allowed') {
          errorMessage = 'This sign-in method is not enabled. Please contact support.';
        } else if (error.code === 'auth/unauthorized-domain') {
          errorMessage = 'This domain is not authorized for authentication.';
        }

        setError(errorMessage);

        // Clean up sessionStorage on error
        sessionStorage.removeItem('googleAuthUserType');
        sessionStorage.removeItem('googleAuthReturnUrl');

        // Redirect to login after showing error
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      } finally {
        setIsProcessing(false);
      }
    };

    handleRedirectResult();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center p-8">
        {isProcessing ? (
          <div className="space-y-4">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Completing sign-in...
            </h2>
            <p className="text-gray-600">
              Please wait while we complete your authentication.
            </p>
          </div>
        ) : error ? (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
            <p className="text-gray-600 text-sm">
              Redirecting to login page...
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800">Authentication successful!</p>
            </div>
            <p className="text-gray-600 text-sm">
              Redirecting...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}