'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getAuthInstance } from '@/lib/firebase';
import { getRedirectResult } from 'firebase/auth';

export default function TestAuthPage() {
  const { user, userType, loading, sessionReady } = useAuth();
  const [logs, setLogs] = useState<string[]>([]);
  const [redirectResult, setRedirectResult] = useState<any>(null);
  const [sessionCookie, setSessionCookie] = useState<boolean>(false);

  useEffect(() => {
    const checkAuthState = async () => {
      const auth = getAuthInstance();

      // Check current auth state
      const currentUser = auth.currentUser;
      addLog(`Current user: ${currentUser ? currentUser.uid : 'null'}`);

      // Check for redirect result
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          addLog(`Redirect result found: ${result.user?.uid}`);
          setRedirectResult(result);
        } else {
          addLog('No redirect result found');
        }
      } catch (error) {
        addLog(`Error getting redirect result: ${error}`);
      }

      // Check session cookie
      const hasCookie = document.cookie.includes('session=');
      setSessionCookie(hasCookie);
      addLog(`Session cookie present: ${hasCookie}`);

      // Check sessionStorage
      const googleAuthPending = sessionStorage.getItem('googleAuthPending');
      const googleAuthUserType = sessionStorage.getItem('googleAuthUserType');
      const googleAuthReturnUrl = sessionStorage.getItem('googleAuthReturnUrl');

      addLog(`SessionStorage - pending: ${googleAuthPending}`);
      addLog(`SessionStorage - userType: ${googleAuthUserType}`);
      addLog(`SessionStorage - returnUrl: ${googleAuthReturnUrl}`);
    };

    checkAuthState();
  }, []);

  const addLog = (message: string) => {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
    console.log(`[TestAuth] ${message}`);
  };

  const clearSessionStorage = () => {
    sessionStorage.clear();
    addLog('SessionStorage cleared');
  };

  const clearCookies = () => {
    document.cookie.split(";").forEach(function(c) {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    addLog('Cookies cleared');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Authentication Debug Page</h1>

        <div className="grid grid-cols-2 gap-6">
          {/* Current State */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Current State</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">User:</span>
                <span className={user ? 'text-green-600' : 'text-red-600'}>
                  {user ? user.uid : 'Not logged in'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Email:</span>
                <span>{user?.email || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">User Type:</span>
                <span>{userType || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Loading:</span>
                <span>{loading ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Session Ready:</span>
                <span className={sessionReady ? 'text-green-600' : 'text-red-600'}>
                  {sessionReady ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Session Cookie:</span>
                <span className={sessionCookie ? 'text-green-600' : 'text-red-600'}>
                  {sessionCookie ? 'Present' : 'Missing'}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Debug Actions</h2>
            <div className="space-y-3">
              <button
                onClick={clearSessionStorage}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Clear SessionStorage
              </button>
              <button
                onClick={clearCookies}
                className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Clear All Cookies
              </button>
              <button
                onClick={() => window.location.href = '/auth/login'}
                className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Go to Login
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>

        {/* Redirect Result */}
        {redirectResult && (
          <div className="mt-6 bg-yellow-50 p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Redirect Result Detected</h2>
            <pre className="text-xs overflow-x-auto">
              {JSON.stringify({
                uid: redirectResult.user?.uid,
                email: redirectResult.user?.email,
                displayName: redirectResult.user?.displayName,
              }, null, 2)}
            </pre>
          </div>
        )}

        {/* Logs */}
        <div className="mt-6 bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Debug Logs</h2>
          <div className="bg-gray-100 p-4 rounded font-mono text-xs space-y-1 max-h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="text-gray-500">No logs yet...</div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="whitespace-pre-wrap">{log}</div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}