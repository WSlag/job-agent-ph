/**
 * Script to create a test admin user
 * Run with: npx tsx scripts/create-test-admin.ts
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

// Initialize Firebase Admin
if (getApps().length === 0) {
  try {
    // Try using service account JSON
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
    if (serviceAccountPath) {
      const serviceAccount = require(path.resolve(serviceAccountPath));
      initializeApp({
        credential: cert(serviceAccount),
      });
    } else {
      // Use individual credentials
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
    }
    console.log('✅ Firebase Admin initialized');
  } catch (error) {
    console.error('❌ Failed to initialize Firebase Admin:', error);
    process.exit(1);
  }
}

const auth = getAuth();
const db = getFirestore();

// Test admin data
// Password comes from TEST_ADMIN_PASSWORD env var — never hardcode credentials in the repo.
const testAdmin = {
  email: 'admin@jobagentph.com',
  password: process.env.TEST_ADMIN_PASSWORD ?? '',
  firstName: 'System',
  lastName: 'Administrator',
  role: 'super_admin' as const,
  phone: '+63 912 345 6789',
};

async function createTestAdmin() {
  try {
    if (!testAdmin.password) {
      console.error('❌ TEST_ADMIN_PASSWORD env var is required (set it in .env.local)');
      process.exit(1);
    }
    console.log('\n🚀 Creating test admin user...\n');

    // Step 1: Create Firebase Auth user
    console.log(`📧 Creating auth user: ${testAdmin.email}`);
    let uid: string;

    try {
      const userRecord = await auth.createUser({
        email: testAdmin.email,
        password: testAdmin.password,
        displayName: `${testAdmin.firstName} ${testAdmin.lastName}`,
      });
      uid = userRecord.uid;
      console.log(`✅ Auth user created with UID: ${uid}`);
    } catch (error: any) {
      if (error.code === 'auth/email-already-exists') {
        console.log('⚠️  User already exists, fetching existing user...');
        const existingUser = await auth.getUserByEmail(testAdmin.email);
        uid = existingUser.uid;
        console.log(`✅ Found existing user with UID: ${uid}`);
      } else {
        throw error;
      }
    }

    // Step 2: Create/Update users document
    console.log('\n📝 Creating users document...');
    await db.collection('users').doc(uid).set({
      email: testAdmin.email,
      userType: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log('✅ Users document created');

    // Step 3: Create/Update admins document
    console.log('\n👑 Creating admins document...');
    await db.collection('admins').doc(uid).set({
      email: testAdmin.email,
      userType: 'admin',
      firstName: testAdmin.firstName,
      lastName: testAdmin.lastName,
      role: testAdmin.role,
      phone: testAdmin.phone,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log('✅ Admins document created');

    // Success summary
    console.log('\n' + '='.repeat(60));
    console.log('🎉 TEST ADMIN CREATED SUCCESSFULLY!');
    console.log('='.repeat(60));
    console.log('\n📋 Admin Details:');
    console.log(`   Email:    ${testAdmin.email}`);
    console.log(`   Password: ${testAdmin.password}`);
    console.log(`   Name:     ${testAdmin.firstName} ${testAdmin.lastName}`);
    console.log(`   Role:     ${testAdmin.role}`);
    console.log(`   UID:      ${uid}`);
    console.log('\n🔗 Access URLs:');
    console.log(`   Login:    http://localhost:3000/auth/login`);
    console.log(`   Dashboard: http://localhost:3000/admin/dashboard`);
    console.log('\n⚠️  IMPORTANT: Change the password after first login!');
    console.log('='.repeat(60) + '\n');

  } catch (error) {
    console.error('\n❌ Error creating test admin:', error);
    throw error;
  }
}

// Run the script
createTestAdmin()
  .then(() => {
    console.log('✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
