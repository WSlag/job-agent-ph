import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

let app: App;
let adminDb: Firestore;
let adminAuth: Auth;

if (!getApps().length) {
  // Initialize Firebase Admin
  // Supports multiple credential methods for security and flexibility
  try {
    let credential;

    // Method 1 (Recommended for Production): Individual environment variables
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      credential = cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      });
      app = initializeApp({
        credential,
        projectId: process.env.FIREBASE_PROJECT_ID,
      });
    }
    // Method 2: Base64 encoded service account (for platforms like Vercel)
    else if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64) {
      const serviceAccount = JSON.parse(
        Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64, 'base64').toString('utf-8')
      );
      app = initializeApp({
        credential: cert(serviceAccount),
        projectId: serviceAccount.project_id,
      });
    }
    // Method 3 (Deprecated - Legacy support): Direct JSON string
    // WARNING: This method exposes private keys in plain text. Use only for local development.
    else if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      console.warn('⚠️  Using deprecated FIREBASE_SERVICE_ACCOUNT_KEY. Please migrate to FIREBASE_PRIVATE_KEY method.');
      const serviceAccount = JSON.parse(
        process.env.FIREBASE_SERVICE_ACCOUNT_KEY
      );
      app = initializeApp({
        credential: cert(serviceAccount),
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
    }
    // Method 4: Application Default Credentials (for Google Cloud environments)
    else {
      console.log('Using Application Default Credentials');
      app = initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
    }
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
    throw new Error('Failed to initialize Firebase Admin. Please check your credentials.');
  }
} else {
  app = getApps()[0];
}

if (app) {
  adminDb = getFirestore(app);
  adminAuth = getAuth(app);
}

export { adminDb, adminAuth };
