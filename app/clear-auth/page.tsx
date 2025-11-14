'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ClearAuthPage() {
  const router = useRouter();
  const [status, setStatus] = useState<string>('Clearing authentication state...');
  const [cleared, setCleared] = useState(false);
  const [details, setDetails] = useState<string[]>([]);

  useEffect(() => {
    const clearAuth = async () => {
      const logs: string[] = [];

      try {
        // Clear localStorage
        setStatus('Clearing localStorage...');
        logs.push('Clearing localStorage...');
        const firebaseKeys = Object.keys(localStorage).filter(k => k.startsWith('firebase:'));
        logs.push(`Found ${firebaseKeys.length} Firebase keys in localStorage`);
        localStorage.clear();
        logs.push('✓ localStorage cleared');
        setDetails([...logs]);
        await new Promise(resolve => setTimeout(resolve, 500));

        // Clear sessionStorage
        setStatus('Clearing sessionStorage...');
        logs.push('Clearing sessionStorage...');
        sessionStorage.clear();
        logs.push('✓ sessionStorage cleared');
        setDetails([...logs]);
        await new Promise(resolve => setTimeout(resolve, 500));

        // Clear cookies
        setStatus('Clearing cookies...');
        logs.push('Clearing cookies...');
        let cookieCount = 0;
        document.cookie.split(";").forEach((c) => {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
          cookieCount++;
        });
        logs.push(`✓ ${cookieCount} cookies cleared`);
        setDetails([...logs]);
        await new Promise(resolve => setTimeout(resolve, 500));

        // Call logout API to clear server-side session
        setStatus('Clearing server-side session...');
        logs.push('Clearing server-side session...');
        await fetch('/api/auth/logout', { method: 'POST' });
        logs.push('✓ Server-side session cleared');
        setDetails([...logs]);
        await new Promise(resolve => setTimeout(resolve, 500));

        setStatus('✓ Authentication state cleared successfully!');
        logs.push('');
        logs.push('✓ All authentication data cleared successfully!');
        setDetails([...logs]);
        setCleared(true);
      } catch (error) {
        console.error('Error clearing auth:', error);
        setStatus('✗ Error clearing auth state');
        logs.push('✗ Error: ' + (error as Error).message);
        setDetails([...logs]);
      }
    };

    clearAuth();
  }, []);

  const handleRedirect = () => {
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Clear Authentication State
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            This page clears cached authentication data that may be causing login issues
          </p>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-4">
              <p className="text-lg font-semibold mb-2">{status}</p>

              {/* Progress indicator */}
              {!cleared && (
                <div className="flex justify-center mb-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              )}
            </div>

            {/* Detailed logs */}
            {details.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-md text-left mb-4">
                <p className="text-xs font-semibold text-gray-700 mb-2">Details:</p>
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {details.map((log, index) => (
                    <p key={index} className="text-xs text-gray-600 font-mono">
                      {log}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {cleared && (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <p className="text-sm text-green-800 font-semibold mb-2">
                    ✓ Success!
                  </p>
                  <p className="text-sm text-green-700">
                    Your authentication state has been cleared. You can now login again with the updated configuration.
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-left">
                  <p className="text-sm font-semibold text-blue-900 mb-2">
                    What was cleared:
                  </p>
                  <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                    <li>Firebase authentication tokens</li>
                    <li>Session cookies</li>
                    <li>Local and session storage</li>
                    <li>Server-side session data</li>
                  </ul>
                </div>

                <button
                  onClick={handleRedirect}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-semibold"
                >
                  Go to Login
                </button>
              </div>
            )}
          </div>

          {/* Additional info */}
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <p className="text-sm font-semibold text-yellow-900 mb-2">
              Why am I seeing this page?
            </p>
            <p className="text-sm text-yellow-800">
              The Firebase authentication domain was recently updated. Old cached tokens need to be cleared for the new configuration to work properly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
