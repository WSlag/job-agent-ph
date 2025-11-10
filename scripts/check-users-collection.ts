import { initializeApp } from 'firebase/app';
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
const db = getFirestore(app);

async function checkUsersCollection() {
  console.log('Checking users collection for test accounts...\n');

  const testAccounts = [
    { email: 'agency@test.com', userId: 'yWVaDtAieuhz3byWwqX5M1VuZIx1' },
    { email: 'agency2@test.com', userId: 'NMbpJTF7xLYtXfQQ15qz4J4D8ss2' }
  ];

  for (const account of testAccounts) {
    console.log(`\n--- ${account.email} (${account.userId}) ---`);

    try {
      const userDoc = await getDoc(doc(db, 'users', account.userId));

      if (userDoc.exists()) {
        console.log('✓ Users document EXISTS');
        console.log('Data:', JSON.stringify(userDoc.data(), null, 2));
      } else {
        console.log('✗ Users document MISSING');
      }

      // Also check the agencies collection
      const agencyDoc = await getDoc(doc(db, 'agencies', account.userId));
      if (agencyDoc.exists()) {
        console.log('✓ Agencies document EXISTS');
      } else {
        console.log('✗ Agencies document MISSING');
      }

    } catch (error) {
      console.error('Error checking document:', error);
    }
  }

  process.exit(0);
}

checkUsersCollection();
