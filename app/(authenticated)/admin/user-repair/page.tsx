'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function UserRepairPage() {
  const { user, userProfile, userType, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('exultantcreationsinc2018@gmail.com');
  const [diagnosticResult, setDiagnosticResult] = useState<any>(null);
  const [repairResult, setRepairResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDiagnose = async () => {
    setLoading(true);
    setError(null);
    setDiagnosticResult(null);
    setRepairResult(null);

    try {
      const response = await fetch(`/api/admin/diagnose-user?email=${encodeURIComponent(email)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to diagnose user');
      }

      setDiagnosticResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRepair = async () => {
    if (!diagnosticResult?.auth?.data?.uid) {
      setError('Please run diagnostic first to get user ID');
      return;
    }

    setLoading(true);
    setError(null);
    setRepairResult(null);

    try {
      const userType = diagnosticResult.detectedUserType || 'agency';

      const response = await fetch('/api/admin/repair-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: diagnosticResult.auth.data.uid,
          userType,
          profileData: {
            companyName: email.split('@')[0],
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to repair user');
      }

      setRepairResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while auth is loading
  if (authLoading) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user is logged in
  if (!user) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-red-600">You must be logged in to access this page.</p>
        </div>
      </div>
    );
  }

  // Check if user is an admin
  if (userType !== 'admin') {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-red-600">You must be logged in as an admin to access this page.</p>
          <p className="text-sm text-gray-600 mt-2">Current user type: {userType || 'unknown'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">User Repair Utility</h1>

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Diagnose User</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="user@example.com"
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleDiagnose}
              disabled={loading || !email}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Run Diagnostic'}
            </button>

            {diagnosticResult?.summary?.canRepair && (
              <button
                onClick={handleRepair}
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Repair User'}
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 font-semibold">Error:</p>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {diagnosticResult && (
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Diagnostic Results</h2>

            <div className="mb-4">
              <h3 className="font-semibold mb-2">Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Is Orphaned:</span>
                  <span className={`ml-2 font-semibold ${diagnosticResult.summary.isOrphaned ? 'text-red-600' : 'text-green-600'}`}>
                    {diagnosticResult.summary.isOrphaned ? 'Yes' : 'No'}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Can Repair:</span>
                  <span className={`ml-2 font-semibold ${diagnosticResult.summary.canRepair ? 'text-green-600' : 'text-gray-600'}`}>
                    {diagnosticResult.summary.canRepair ? 'Yes' : 'No'}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Detected Type:</span>
                  <span className="ml-2 font-semibold">{diagnosticResult.detectedUserType || 'Unknown'}</span>
                </div>
              </div>
            </div>

            {diagnosticResult.issues.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold mb-2 text-red-600">Issues Found:</h3>
                <ul className="list-disc list-inside space-y-1">
                  {diagnosticResult.issues.map((issue: string, idx: number) => (
                    <li key={idx} className="text-sm text-red-700">{issue}</li>
                  ))}
                </ul>
              </div>
            )}

            {diagnosticResult.recommendations.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold mb-2 text-blue-600">Recommendations:</h3>
                <ul className="list-disc list-inside space-y-1">
                  {diagnosticResult.recommendations.map((rec: string, idx: number) => (
                    <li key={idx} className="text-sm text-blue-700">{rec}</li>
                  ))}
                </ul>
              </div>
            )}

            <details className="mt-4">
              <summary className="cursor-pointer font-semibold">Full Diagnostic Data</summary>
              <pre className="mt-2 p-4 bg-gray-100 rounded overflow-auto text-xs">
                {JSON.stringify(diagnosticResult, null, 2)}
              </pre>
            </details>
          </div>
        )}

        {repairResult && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-green-800">Repair Successful!</h2>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Created Documents:</p>
              <ul className="list-disc list-inside">
                {repairResult.createdDocuments.map((doc: string, idx: number) => (
                  <li key={idx} className="text-green-700">{doc}</li>
                ))}
              </ul>
            </div>

            {repairResult.skippedDocuments.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Skipped (Already Existed):</p>
                <ul className="list-disc list-inside">
                  {repairResult.skippedDocuments.map((doc: string, idx: number) => (
                    <li key={idx} className="text-gray-600">{doc}</li>
                  ))}
                </ul>
              </div>
            )}

            <p className="mt-4 text-sm text-gray-600">
              User should now appear in the admin dashboard.
              <a href="/admin/users" className="text-blue-600 hover:underline ml-1">
                Go to Users Dashboard
              </a>
            </p>

            <details className="mt-4">
              <summary className="cursor-pointer font-semibold">Full Repair Data</summary>
              <pre className="mt-2 p-4 bg-gray-100 rounded overflow-auto text-xs">
                {JSON.stringify(repairResult, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}
