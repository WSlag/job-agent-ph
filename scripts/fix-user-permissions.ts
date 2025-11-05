/**
 * Script to diagnose and fix user permission issues
 *
 * This script checks if authenticated users have the required documents
 * in both the 'users' and 'jobHunters'/'agencies' collections.
 *
 * Run with: npx tsx scripts/fix-user-permissions.ts
 */

import { config } from 'dotenv';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs
} from 'firebase/firestore';

// Load environment variables
config({ path: '.env.local' });

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

console.log('Firebase Config:', {
  apiKey: firebaseConfig.apiKey ? '***' + firebaseConfig.apiKey.slice(-4) : 'MISSING',
  authDomain: firebaseConfig.authDomain || 'MISSING',
  projectId: firebaseConfig.projectId || 'MISSING',
});

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function diagnoseUser(userId: string) {
  console.log(`\n=== Diagnosing User: ${userId} ===`);

  // Check users collection
  const userDocRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    console.log('❌ PROBLEM: User document NOT found in "users" collection');
    console.log('   This is required for Firestore security rules to work');
  } else {
    console.log('✓ User document found in "users" collection');
    console.log('  Data:', userDoc.data());
  }

  // Check jobHunters collection
  const jobHunterDocRef = doc(db, 'jobHunters', userId);
  const jobHunterDoc = await getDoc(jobHunterDocRef);

  if (jobHunterDoc.exists()) {
    console.log('✓ JobHunter document found in "jobHunters" collection');
    console.log('  Data:', jobHunterDoc.data());
  } else {
    console.log('ℹ JobHunter document not found (user might be agency)');
  }

  // Check agencies collection
  const agencyDocRef = doc(db, 'agencies', userId);
  const agencyDoc = await getDoc(agencyDocRef);

  if (agencyDoc.exists()) {
    console.log('✓ Agency document found in "agencies" collection');
    console.log('  Data:', agencyDoc.data());
  } else {
    console.log('ℹ Agency document not found (user might be job hunter)');
  }

  return {
    hasUserDoc: userDoc.exists(),
    hasJobHunterDoc: jobHunterDoc.exists(),
    hasAgencyDoc: agencyDoc.exists(),
    userData: userDoc.data(),
    jobHunterData: jobHunterDoc.data(),
    agencyData: agencyDoc.data(),
  };
}

async function fixUserDocument(userId: string) {
  console.log(`\n=== Attempting to fix User: ${userId} ===`);

  const diagnosis = await diagnoseUser(userId);

  if (!diagnosis.hasUserDoc) {
    console.log('\n⚠️  Creating missing "users" document...');

    // Determine user type from other collections
    let userType: 'jobhunter' | 'agency' | null = null;
    let email = '';

    if (diagnosis.hasJobHunterDoc && diagnosis.jobHunterData) {
      userType = 'jobhunter';
      email = diagnosis.jobHunterData.email || '';
    } else if (diagnosis.hasAgencyDoc && diagnosis.agencyData) {
      userType = 'agency';
      email = diagnosis.agencyData.email || '';
    }

    if (!userType) {
      console.log('❌ Cannot determine user type. Please create user document manually.');
      return false;
    }

    // Create the users document
    const userDoc = {
      email,
      userType,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      await setDoc(doc(db, 'users', userId), userDoc);
      console.log('✅ Successfully created "users" document');
      console.log('   Data:', userDoc);
      return true;
    } catch (error) {
      console.error('❌ Failed to create "users" document:', error);
      return false;
    }
  } else {
    console.log('✅ User document already exists. No fix needed.');
    return true;
  }
}

async function scanAllUsers() {
  console.log('=== Scanning All Job Hunters ===\n');

  const jobHuntersSnapshot = await getDocs(collection(db, 'jobHunters'));
  const jobHunterIds: string[] = [];

  jobHuntersSnapshot.forEach((doc) => {
    jobHunterIds.push(doc.id);
  });

  console.log(`Found ${jobHunterIds.length} job hunters`);

  let missingUserDocs = 0;

  for (const userId of jobHunterIds) {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      console.log(`❌ Job Hunter ${userId} is MISSING "users" document`);
      missingUserDocs++;
    }
  }

  if (missingUserDocs === 0) {
    console.log('\n✅ All job hunters have "users" documents');
  } else {
    console.log(`\n⚠️  ${missingUserDocs} job hunters are missing "users" documents`);
  }

  return jobHunterIds;
}

async function fixAllUsers() {
  console.log('=== Fixing All Users ===\n');

  const jobHunterIds = await scanAllUsers();

  console.log('\n--- Fixing Missing Documents ---\n');

  for (const userId of jobHunterIds) {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      await fixUserDocument(userId);
    }
  }

  console.log('\n✅ Fix completed!');
}

// Main execution
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage:');
    console.log('  npx tsx scripts/fix-user-permissions.ts scan          - Scan for issues');
    console.log('  npx tsx scripts/fix-user-permissions.ts fix           - Fix all users');
    console.log('  npx tsx scripts/fix-user-permissions.ts diagnose <id> - Diagnose specific user');
    console.log('  npx tsx scripts/fix-user-permissions.ts fix-one <id>  - Fix specific user');
    return;
  }

  const command = args[0];

  switch (command) {
    case 'scan':
      await scanAllUsers();
      break;

    case 'fix':
      await fixAllUsers();
      break;

    case 'diagnose':
      if (args.length < 2) {
        console.error('Please provide user ID');
        return;
      }
      await diagnoseUser(args[1]);
      break;

    case 'fix-one':
      if (args.length < 2) {
        console.error('Please provide user ID');
        return;
      }
      await fixUserDocument(args[1]);
      break;

    default:
      console.error('Unknown command:', command);
  }
}

main()
  .then(() => {
    console.log('\n--- Done ---');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
