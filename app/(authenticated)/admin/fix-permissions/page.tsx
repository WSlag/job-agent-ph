'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/layout/AdminLayout';
import { getDbInstance } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { COLLECTIONS } from '@/lib/collections';
import { Permission, Admin } from '@/types';
import { CheckCircle, AlertCircle } from 'lucide-react';

export default function FixPermissionsPage() {
  const { userProfile, user } = useAuth();
  const admin = userProfile as Admin;
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function fixPermissions() {
    if (!user?.uid) {
      setStatus('error');
      setMessage('No user logged in');
      return;
    }

    setStatus('loading');
    setMessage('Updating admin permissions...');

    try {
      const db = getDbInstance();
      const adminRef = doc(db, COLLECTIONS.ADMINS, user.uid);

      await updateDoc(adminRef, {
        role: 'super_admin', // Changed from 'super-admin' to 'super_admin'
        permissions: Object.values(Permission), // Add all permissions
        updatedAt: new Date(),
      });

      setStatus('success');
      setMessage('Permissions updated successfully! Please refresh the page.');
    } catch (error: any) {
      console.error('Error updating permissions:', error);
      setStatus('error');
      setMessage(`Error: ${error.message}`);
    }
  }

  return (
    <AdminLayout>
      <div className="p-6 max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-4">Fix Admin Permissions</h1>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Current Status:</h2>
            <div className="bg-gray-50 border rounded p-4 space-y-2">
              <p className="text-sm">
                <span className="font-medium">User ID:</span> {user?.uid}
              </p>
              <p className="text-sm">
                <span className="font-medium">Email:</span> {admin?.email}
              </p>
              <p className="text-sm">
                <span className="font-medium">Current Role:</span>{' '}
                <span className={admin?.role === 'super_admin' ? 'text-red-600 font-bold' : 'text-green-600'}>
                  {admin?.role || 'Not set'}
                </span>
              </p>
              <p className="text-sm">
                <span className="font-medium">Permissions:</span>{' '}
                {admin?.permissions?.length || 0} permission(s)
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">What This Will Do:</h2>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
              <li>Change role from <code className="bg-gray-100 px-1 rounded">super-admin</code> to <code className="bg-gray-100 px-1 rounded">super_admin</code></li>
              <li>Add all {Object.values(Permission).length} permissions to your account</li>
              <li>Grant you full access to all admin features</li>
            </ul>
          </div>

          <button
            onClick={fixPermissions}
            disabled={status === 'loading'}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {status === 'loading' ? 'Updating...' : 'Fix Permissions Now'}
          </button>

          {status === 'success' && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
              <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
              <div>
                <p className="text-green-800 font-medium">{message}</p>
                <p className="text-green-700 text-sm mt-1">
                  Please refresh the page or navigate to another page to see the changes.
                </p>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
              <div>
                <p className="text-red-800 font-medium">Failed to update permissions</p>
                <p className="text-red-700 text-sm mt-1">{message}</p>
              </div>
            </div>
          )}

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <span className="font-medium">Note:</span> This is a one-time fix page. After running this,
              you can delete the <code className="bg-yellow-100 px-1 rounded">fix-permissions</code> page.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
