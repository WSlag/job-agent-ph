import admin from 'firebase-admin';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  });
}

const db = admin.firestore();
const auth = admin.auth();

async function checkUserProfile(email: string) {
  console.log(`\n=== Checking user profile for: ${email} ===\n`);

  try {
    // 1. Check if user exists in Firebase Auth
    console.log('1. Checking Firebase Auth...');
    let user;
    try {
      user = await auth.getUserByEmail(email);
      console.log('✓ User found in Firebase Auth');
      console.log('  - UID:', user.uid);
      console.log('  - Email:', user.email);
      console.log('  - Display Name:', user.displayName || '(not set)');
      console.log('  - Created:', new Date(user.metadata.creationTime).toLocaleString());
    } catch (error: any) {
      console.error('✗ User NOT found in Firebase Auth');
      console.error('  Error:', error.message);
      return;
    }

    const userId = user.uid;

    // 2. Check users collection
    console.log('\n2. Checking /users collection...');
    const userDoc = await db.collection('users').doc(userId).get();
    if (userDoc.exists) {
      console.log('✓ User document found');
      console.log('  Data:', JSON.stringify(userDoc.data(), null, 2));
    } else {
      console.log('✗ User document NOT found in /users collection');
    }

    // 3. Check jobHunters collection
    console.log('\n3. Checking /jobHunters collection...');
    const jobHunterDoc = await db.collection('jobHunters').doc(userId).get();
    if (jobHunterDoc.exists) {
      console.log('✓ JobHunter profile found');
      console.log('  Data:', JSON.stringify(jobHunterDoc.data(), null, 2));
    } else {
      console.log('- JobHunter profile not found');
    }

    // 4. Check agencies collection
    console.log('\n4. Checking /agencies collection...');
    const agencyDoc = await db.collection('agencies').doc(userId).get();
    if (agencyDoc.exists) {
      console.log('✓ Agency profile found');
      console.log('  Data:', JSON.stringify(agencyDoc.data(), null, 2));
    } else {
      console.log('- Agency profile not found');
    }

    // 5. Check admins collection
    console.log('\n5. Checking /admins collection...');
    const adminDoc = await db.collection('admins').doc(userId).get();
    if (adminDoc.exists) {
      console.log('✓ Admin profile found');
      console.log('  Data:', JSON.stringify(adminDoc.data(), null, 2));
    } else {
      console.log('- Admin profile not found');
    }

    // Summary
    console.log('\n=== Summary ===');
    const profileExists = jobHunterDoc.exists || agencyDoc.exists || adminDoc.exists;
    if (profileExists) {
      console.log('✓ User has a profile in Firestore');
      if (jobHunterDoc.exists) console.log('  - Profile Type: Job Hunter');
      if (agencyDoc.exists) console.log('  - Profile Type: Agency');
      if (adminDoc.exists) console.log('  - Profile Type: Admin');
    } else {
      console.log('✗ ERROR: User has NO profile in Firestore!');
      console.log('  This is why the login is failing.');
      console.log('  The user needs a profile document in one of:');
      console.log('  - /jobHunters/{userId}');
      console.log('  - /agencies/{userId}');
      console.log('  - /admins/{userId}');
    }

  } catch (error: any) {
    console.error('\n✗ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    process.exit(0);
  }
}

// Get email from command line or use default
const email = process.argv[2] || 'me@test.com';
checkUserProfile(email);
