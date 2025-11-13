'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { getDefaultRouteForUserType, buildRedirectUrl } from '@/lib/auth-redirect';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, user, userType, loading: authLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);
  const hasRedirected = useRef(false);

  // Handle redirect after authentication
  useEffect(() => {
    console.log('[LoginPage] Auth state:', {
      hasUser: !!user,
      userType,
      authLoading,
      isRedirecting,
      hasRedirected: hasRedirected.current
    });

    // Only redirect once - use ref to prevent multiple redirects
    if (user && userType && !authLoading && !hasRedirected.current) {
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
  }, [user, userType, authLoading, router, searchParams]);

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
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
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
