import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

console.log('=== Testing Client-Side Firestore Access ===\n');
console.log('Configuration:');
console.log('- Auth Domain:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
console.log('- Project ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
console.log();

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

async function testClientFirestore() {
  try {
    // Sign in
    console.log('1. Signing in as agency2@test.com...');
    const userCredential = await signInWithEmailAndPassword(
      auth,
      'agency2@test.com',
      'Password123'
    );
    console.log('✓ Authentication successful');
    console.log('  - UID:', userCredential.user.uid);
    console.log('  - Email:', userCredential.user.email);

    const userId = userCredential.user.uid;

    // Get ID token to verify it's valid
    console.log('\n2. Getting ID token...');
    const idToken = await userCredential.user.getIdToken();
    console.log('✓ ID token obtained (length:', idToken.length, 'chars)');

    // Decode token to check claims
    const tokenParts = idToken.split('.');
    if (tokenParts.length === 3) {
      const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
      console.log('  - Token issued at:', new Date(payload.iat * 1000).toLocaleString());
      console.log('  - Token expires at:', new Date(payload.exp * 1000).toLocaleString());
      console.log('  - Auth time:', new Date(payload.auth_time * 1000).toLocaleString());
      console.log('  - Issuer:', payload.iss);
      console.log('  - Audience:', payload.aud);
    }

    // Wait a moment for auth state to propagate
    console.log('\n3. Waiting for auth state to propagate...');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Test parallel reads (same as AuthContext does)
    console.log('\n4. Testing parallel Firestore reads (Promise.all)...');
    try {
      const [adminDoc, jobHunterDoc, agencyDoc] = await Promise.all([
        getDoc(doc(db, 'admins', userId)),
        getDoc(doc(db, 'jobHunters', userId)),
        getDoc(doc(db, 'agencies', userId))
      ]);

      console.log('✓ Parallel reads successful!');
      console.log('  - Admin exists:', adminDoc.exists());
      console.log('  - JobHunter exists:', jobHunterDoc.exists());
      console.log('  - Agency exists:', agencyDoc.exists());

      if (agencyDoc.exists()) {
        const data = agencyDoc.data();
        console.log('\n✓ Agency data retrieved:');
        console.log('  - Company:', data.companyName);
        console.log('  - Email:', data.email);
        console.log('  - Verified:', data.verified);
      }

      console.log('\n=== SUCCESS: Client-side Firestore access is working! ===');
      console.log('The permission error in the browser must be due to:');
      console.log('1. Cached authentication tokens from the old authDomain');
      console.log('2. Browser needs to clear localStorage/sessionStorage');
      console.log('\nSolution: User must clear browser cache or use incognito mode');

    } catch (firestoreError: any) {
      console.error('\n✗ Firestore read FAILED:', firestoreError.code);
      console.error('  Message:', firestoreError.message);
      console.error('\nThis means:');
      console.error('- The authentication token is not being accepted by Firestore');
      console.error('- Possible causes:');
      console.error('  1. Auth domain mismatch');
      console.error('  2. Security rules blocking the request');
      console.error('  3. Token not properly propagated');
    }

    process.exit(0);

  } catch (error: any) {
    console.error('\n✗ Error:', error.code || 'unknown');
    console.error('  Message:', error.message);
    process.exit(1);
  }
}

testClientFirestore();
