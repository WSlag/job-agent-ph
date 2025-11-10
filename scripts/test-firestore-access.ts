import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function testFirestoreAccess() {
  console.log('Testing Firestore access after authentication...\n');

  try {
    // Sign in with the test account
    console.log('Signing in as agency2@test.com...');
    const userCredential = await signInWithEmailAndPassword(
      auth,
      'agency2@test.com',
      'Password123'
    );

    console.log('✓ Authentication successful!');
    console.log('User ID:', userCredential.user.uid);

    const userId = userCredential.user.uid;

    // Now try to read from each collection
    console.log('\n--- Testing Firestore Reads ---\n');

    // Test 1: Read from agencies collection
    console.log('1. Reading from agencies collection...');
    try {
      const agencyDoc = await getDoc(doc(db, 'agencies', userId));
      if (agencyDoc.exists()) {
        console.log('✓ Agency document found!');
        console.log('Data:', JSON.stringify(agencyDoc.data(), null, 2));
      } else {
        console.log('✗ Agency document not found');
      }
    } catch (error: any) {
      console.error('✗ Error reading agencies:', error.code, error.message);
    }

    // Test 2: Read from jobHunters collection
    console.log('\n2. Reading from jobHunters collection...');
    try {
      const jobHunterDoc = await getDoc(doc(db, 'jobHunters', userId));
      if (jobHunterDoc.exists()) {
        console.log('✓ JobHunter document found!');
      } else {
        console.log('- JobHunter document not found (expected for agency account)');
      }
    } catch (error: any) {
      console.error('✗ Error reading jobHunters:', error.code, error.message);
    }

    // Test 3: Read from admins collection
    console.log('\n3. Reading from admins collection...');
    try {
      const adminDoc = await getDoc(doc(db, 'admins', userId));
      if (adminDoc.exists()) {
        console.log('✓ Admin document found!');
      } else {
        console.log('- Admin document not found (expected for agency account)');
      }
    } catch (error: any) {
      console.error('✗ Error reading admins:', error.code, error.message);
    }

    // Test 4: Read from users collection
    console.log('\n4. Reading from users collection...');
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        console.log('✓ User document found!');
        console.log('Data:', JSON.stringify(userDoc.data(), null, 2));
      } else {
        console.log('✗ User document not found - THIS COULD BE THE PROBLEM!');
      }
    } catch (error: any) {
      console.error('✗ Error reading users:', error.code, error.message);
    }

    // Test 5: Try parallel reads (like AuthContext does)
    console.log('\n5. Testing parallel reads (Promise.all)...');
    try {
      const [adminDoc, jobHunterDoc, agencyDoc] = await Promise.all([
        getDoc(doc(db, 'admins', userId)),
        getDoc(doc(db, 'jobHunters', userId)),
        getDoc(doc(db, 'agencies', userId))
      ]);
      console.log('✓ Parallel reads successful!');
      console.log('Admin exists:', adminDoc.exists());
      console.log('JobHunter exists:', jobHunterDoc.exists());
      console.log('Agency exists:', agencyDoc.exists());
    } catch (error: any) {
      console.error('✗ Error in parallel reads:', error.code, error.message);
    }

    console.log('\n--- Test Complete ---');
    process.exit(0);

  } catch (error: any) {
    console.error('Error:', error.code, error.message);
    process.exit(1);
  }
}

testFirestoreAccess();
