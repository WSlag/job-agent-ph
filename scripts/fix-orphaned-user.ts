/**
 * Script to fix orphaned users (users with Firebase Auth but no Firestore profile)
 *
 * Usage:
 * 1. Update the USER_ID and USER_TYPE constants below
 * 2. Fill in the profile data
 * 3. Run: npx tsx scripts/fix-orphaned-user.ts
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// Configuration
const USER_ID = 'T7GuXLdyFUfreAXWc73qspQLAwG2'; // The orphaned user ID
const USER_TYPE: 'jobhunter' | 'agency' | 'admin' = 'jobhunter'; // Change to appropriate type

// Initialize Firebase Admin (requires service account key)
// Download your service account key from Firebase Console > Project Settings > Service Accounts
// Place it in the root directory as 'serviceAccountKey.json'
const serviceAccount = require('../serviceAccountKey.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();
const auth = getAuth();

async function fixOrphanedUser() {
  try {
    console.log(`Checking user ${USER_ID}...`);

    // Get user from Firebase Auth
    const userRecord = await auth.getUser(USER_ID);
    console.log('User found in Firebase Auth:', {
      email: userRecord.email,
      displayName: userRecord.displayName,
      createdAt: userRecord.metadata.creationTime
    });

    // Check if profile already exists
    const collections = {
      jobhunter: 'jobHunters',
      agency: 'agencies',
      admin: 'admins'
    };

    const collectionName = collections[USER_TYPE];
    const profileRef = db.collection(collectionName).doc(USER_ID);
    const profileDoc = await profileRef.get();

    if (profileDoc.exists) {
      console.log(`✅ Profile already exists in ${collectionName} collection`);
      console.log('Profile data:', profileDoc.data());
      return;
    }

    // Create profile based on user type
    let profileData: any = {
      email: userRecord.email,
      userType: USER_TYPE,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (USER_TYPE === 'jobhunter') {
      // Extract name from displayName or email
      const nameParts = (userRecord.displayName || userRecord.email?.split('@')[0] || '').split(' ');
      profileData = {
        ...profileData,
        firstName: nameParts[0] || 'User',
        lastName: nameParts.slice(1).join(' ') || 'Name',
        phoneNumber: '',
        address: '',
        city: '',
        country: 'Philippines',
        bio: '',
        skills: [],
        experience: [],
        education: [],
        savedJobs: [],
        appliedJobs: []
      };
    } else if (USER_TYPE === 'agency') {
      profileData = {
        ...profileData,
        companyName: userRecord.displayName || 'Agency Name',
        companyDescription: '',
        companyWebsite: '',
        phoneNumber: '',
        address: '',
        city: '',
        country: 'Philippines',
        verified: false,
        jobs: []
      };
    } else if (USER_TYPE === 'admin') {
      const nameParts = (userRecord.displayName || userRecord.email?.split('@')[0] || '').split(' ');
      profileData = {
        ...profileData,
        firstName: nameParts[0] || 'Admin',
        lastName: nameParts.slice(1).join(' ') || 'User',
        role: 'moderator',
        permissions: ['view_jobs', 'edit_jobs', 'view_users']
      };
    }

    // Create the profile document
    await profileRef.set(profileData);

    // Also create/update the users collection document
    await db.collection('users').doc(USER_ID).set({
      email: userRecord.email,
      userType: USER_TYPE,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log(`✅ Successfully created ${USER_TYPE} profile for user ${USER_ID}`);
    console.log('Profile data:', profileData);
    console.log('\n🎉 User is now ready to use the application!');

  } catch (error) {
    console.error('❌ Error fixing orphaned user:', error);
    throw error;
  }
}

// Run the fix
fixOrphanedUser()
  .then(() => {
    console.log('\n✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });
