/**
 * Create admin profile for orphaned user
 *
 * Usage: npx tsx scripts/create-admin-profile.ts
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const COLLECTIONS = {
  USERS: 'users',
  ADMINS: 'admins',
};

async function createAdminProfile() {
  const userId = 'qUqVWcQWYWRNrjO2iyUu7oIM7PZ2';
  const email = 'wslagbas@gmail.com';

  console.log('🔧 Creating admin profile...');
  console.log(`User ID: ${userId}`);
  console.log(`Email: ${email}`);

  // Create user document
  const userDoc = {
    email,
    userType: 'admin',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(doc(db, COLLECTIONS.USERS, userId), userDoc);
  console.log('✅ User document created');

  // Create admin profile
  const adminProfile = {
    email,
    userType: 'admin' as const,
    firstName: 'Admin',
    lastName: 'User',
    role: 'super-admin',
    permissions: [
      'manage_users',
      'manage_agencies',
      'manage_jobs',
      'manage_applications',
      'view_analytics',
      'manage_admins',
    ],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(doc(db, COLLECTIONS.ADMINS, userId), adminProfile);
  console.log('✅ Admin profile created');

  console.log('\n✨ Done! User can now log in as super admin.');
}

createAdminProfile()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
