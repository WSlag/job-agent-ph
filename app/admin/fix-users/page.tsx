'use client';

import { useState } from 'react';
import { collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/collections';

export default function FixUsersPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState('');

  const fixUserProfiles = async () => {
    setLoading(true);
    setResults([]);
    setError('');

    const logs: string[] = [];

    try {
      logs.push('🔍 Checking users collection...');
      setResults([...logs]);

      // Get all users
      const usersSnapshot = await getDocs(collection(db, COLLECTIONS.USERS));
      logs.push(`✅ Found ${usersSnapshot.size} users in 'users' collection`);
      setResults([...logs]);

      let fixed = 0;
      let skipped = 0;

      for (const userDoc of usersSnapshot.docs) {
        const userId = userDoc.id;
        const userData = userDoc.data();
        const userType = userData.userType;

        logs.push(`\n📧 Checking: ${userData.email} (${userType})`);
        setResults([...logs]);

        if (userType === 'jobhunter') {
          // Check if profile exists in jobHunters
          const jobHunterDoc = await getDoc(
            doc(db, COLLECTIONS.JOB_HUNTERS, userId)
          );

          if (!jobHunterDoc.exists()) {
            logs.push(`  ❌ Missing jobHunter profile`);
            logs.push(`  🔧 Creating profile...`);
            setResults([...logs]);

            // Create jobHunter profile
            await setDoc(doc(db, COLLECTIONS.JOB_HUNTERS, userId), {
              email: userData.email,
              userType: 'jobhunter',
              firstName: userData.firstName || '',
              lastName: userData.lastName || '',
              location: userData.location || 'Manila',
              skills: userData.skills || [],
              experience: userData.experience || 0,
              createdAt: userData.createdAt || new Date(),
              updatedAt: new Date(),
            });

            logs.push(`  ✅ Created jobHunter profile!`);
            fixed++;
          } else {
            logs.push(`  ✓ Profile exists`);
            skipped++;
          }
        } else if (userType === 'agency') {
          // Check if profile exists in agencies
          const agencyDoc = await getDoc(doc(db, COLLECTIONS.AGENCIES, userId));

          if (!agencyDoc.exists()) {
            logs.push(`  ❌ Missing agency profile`);
            logs.push(`  🔧 Creating profile...`);
            setResults([...logs]);

            // Create agency profile
            await setDoc(doc(db, COLLECTIONS.AGENCIES, userId), {
              email: userData.email,
              userType: 'agency',
              companyName: userData.companyName || '',
              registrationNumber: userData.registrationNumber || '',
              contactPerson: userData.contactPerson || '',
              phone: userData.phone || '',
              address: userData.address || '',
              verified: false,
              createdAt: userData.createdAt || new Date(),
              updatedAt: new Date(),
            });

            logs.push(`  ✅ Created agency profile!`);
            fixed++;
          } else {
            logs.push(`  ✓ Profile exists`);
            skipped++;
          }
        }

        setResults([...logs]);
      }

      logs.push('\n================================');
      logs.push('✨ Fix Complete!');
      logs.push(`✅ Fixed: ${fixed}`);
      logs.push(`✓ Already OK: ${skipped}`);
      logs.push('================================');
      setResults([...logs]);
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'An error occurred');
      logs.push(`\n❌ Error: ${err.message}`);
      setResults([...logs]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Fix User Profiles
          </h1>
          <p className="text-gray-600 mb-6">
            This tool checks for users in the 'users' collection that don't have
            corresponding profiles in 'jobHunters' or 'agencies' collections and
            creates them.
          </p>

          <button
            onClick={fixUserProfiles}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Run Fix'}
          </button>

          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {results.length > 0 && (
            <div className="mt-6 bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-auto max-h-96">
              {results.map((line, index) => (
                <div key={index}>{line}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
