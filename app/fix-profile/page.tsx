'use client';

import { useState } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getDbInstance, getAuthInstance } from '@/lib/firebase';

const COLLECTIONS = {
  USERS: 'users',
  ADMINS: 'admins',
};

export default function FixProfilePage() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const createAdminProfile = async () => {
    setLoading(true);

    // Check if user is logged in
    const auth = getAuthInstance();
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setStatus('❌ Error: You must be logged in as wslagbas@gmail.com to create your admin profile.');
      setLoading(false);
      return;
    }

    const userId = currentUser.uid;
    const email = currentUser.email || '';

    setStatus(`Creating admin profile for ${email}...`);

    try {
      const db = getDbInstance();

      // Create user document
      await setDoc(doc(db, COLLECTIONS.USERS, userId), {
        email,
        userType: 'admin',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setStatus('User document created... Creating admin profile...');

      // Create admin profile
      await setDoc(doc(db, COLLECTIONS.ADMINS, userId), {
        email,
        userType: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        role: 'super-admin',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setStatus('✅ Admin profile created successfully! You can now log in.');
    } catch (error: any) {
      setStatus(`❌ Error: ${error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-4">Fix Orphaned User Profile</h1>
        <p className="text-gray-600 mb-6">
          Click the button below to create an admin profile for your account.
        </p>

        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Instructions:</strong>
            <br />
            1. Make sure you're logged in as wslagbas@gmail.com
            <br />
            2. Click "Create Admin Profile" below
            <br />
            3. Log out and log back in
          </p>
        </div>

        <button
          onClick={createAdminProfile}
          disabled={loading}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Creating...' : 'Create Admin Profile'}
        </button>

        {status && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm whitespace-pre-wrap">{status}</p>
          </div>
        )}

        {getAuthInstance().currentUser && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-xs text-green-800">
              Currently logged in as: {getAuthInstance().currentUser?.email}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
