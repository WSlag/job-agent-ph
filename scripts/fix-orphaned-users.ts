/**
 * Fix orphaned users who have Firebase Auth accounts but no Firestore profiles
 *
 * Usage: npx tsx scripts/fix-orphaned-users.ts
 */

import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import * as readline from 'readline';

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
  projectId: firebaseConfig.projectId,
  hasApiKey: !!firebaseConfig.apiKey,
});

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const COLLECTIONS = {
  USERS: 'users',
  JOB_HUNTERS: 'jobHunters',
  AGENCIES: 'agencies',
  ADMINS: 'admins',
};

async function question(prompt: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function checkUserProfile(userId: string): Promise<string | null> {
  // Check admins
  const adminDoc = await getDoc(doc(db, COLLECTIONS.ADMINS, userId));
  if (adminDoc.exists()) return 'admin';

  // Check job hunters
  const jobHunterDoc = await getDoc(doc(db, COLLECTIONS.JOB_HUNTERS, userId));
  if (jobHunterDoc.exists()) return 'jobhunter';

  // Check agencies
  const agencyDoc = await getDoc(doc(db, COLLECTIONS.AGENCIES, userId));
  if (agencyDoc.exists()) return 'agency';

  return null;
}

async function createJobHunterProfile(userId: string, email: string) {
  console.log('\n📝 Creating job hunter profile...');

  const firstName = await question('First name: ');
  const lastName = await question('Last name: ');

  const profile = {
    email,
    userType: 'jobhunter' as const,
    firstName,
    lastName,
    skills: [],
    phone: '',
    address: '',
    bio: '',
    education: [],
    experience: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await setDoc(doc(db, COLLECTIONS.USERS, userId), {
    email,
    userType: 'jobhunter',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await setDoc(doc(db, COLLECTIONS.JOB_HUNTERS, userId), profile);

  console.log('✅ Job hunter profile created successfully!');
}

async function createAgencyProfile(userId: string, email: string) {
  console.log('\n📝 Creating agency profile...');

  const companyName = await question('Company name: ');
  const contactPerson = await question('Contact person: ');

  const profile = {
    email,
    userType: 'agency' as const,
    companyName,
    contactPerson,
    phone: '',
    address: '',
    description: '',
    website: '',
    verified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await setDoc(doc(db, COLLECTIONS.USERS, userId), {
    email,
    userType: 'agency',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await setDoc(doc(db, COLLECTIONS.AGENCIES, userId), profile);

  console.log('✅ Agency profile created successfully!');
}

async function fixOrphanedUser(userId: string, email: string) {
  console.log(`\n🔍 Checking user: ${email} (${userId})`);

  const profileType = await checkUserProfile(userId);

  if (profileType) {
    console.log(`✅ Profile exists as: ${profileType}`);
    return;
  }

  console.log('⚠️  No profile found!');

  const userType = await question('Create profile as (jobhunter/agency/skip): ');

  if (userType.toLowerCase() === 'jobhunter') {
    await createJobHunterProfile(userId, email);
  } else if (userType.toLowerCase() === 'agency') {
    await createAgencyProfile(userId, email);
  } else {
    console.log('⏭️  Skipped');
  }
}

async function main() {
  console.log('🔧 Orphaned User Fixer\n');

  // The orphaned user we found
  const orphanedUser = {
    userId: 'wxSTEBGY3zYYR2dCYk2PRgFY5yn2',
    email: 'hunter2@test.com',
  };

  await fixOrphanedUser(orphanedUser.userId, orphanedUser.email);

  console.log('\n✨ Done!');
  process.exit(0);
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
