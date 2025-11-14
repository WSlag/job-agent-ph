import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getAuth, type Auth } from 'firebase-admin/auth';

// Only initialize during runtime, not during build
let app: App | undefined;
let _adminDb: Firestore | undefined;
let _adminAuth: Auth | undefined;

function getApp(): App {
  if (app) return app;

  // If already initialized by another module
  if (getApps().length > 0) {
    app = getApps()[0];
    return app;
  }

  // Initialize Firebase Admin
  try {
    // Method 1: Individual environment variables (recommended)
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      const credential = cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      });
      app = initializeApp({
        credential,
        projectId: process.env.FIREBASE_PROJECT_ID,
      });
      return app;
    }

    // Method 2: Base64 encoded service account
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64) {
      const serviceAccount = JSON.parse(
        Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64, 'base64').toString('utf-8')
      );
      app = initializeApp({
        credential: cert(serviceAccount),
        projectId: serviceAccount.project_id,
      });
      return app;
    }

    // Method 3: Direct JSON string (deprecated)
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      app = initializeApp({
        credential: cert(serviceAccount),
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
      return app;
    }

    // Method 4: Application Default Credentials
    app = initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
    return app;
  } catch (error) {
    console.error('[Firebase Admin] Initialization error:', error);
    throw new Error('Failed to initialize Firebase Admin');
  }
}

// Lazy getters
function getAdminDb(): Firestore {
  if (!_adminDb) {
    _adminDb = getFirestore(getApp());
  }
  return _adminDb;
}

function getAdminAuth(): Auth {
  if (!_adminAuth) {
    _adminAuth = getAuth(getApp());
  }
  return _adminAuth;
}

// Export as Proxy objects for lazy initialization
export const adminDb = new Proxy({} as Firestore, {
  get(target, prop) {
    return (getAdminDb() as any)[prop];
  }
});

export const adminAuth = new Proxy({} as Auth, {
  get(target, prop) {
    return (getAdminAuth() as any)[prop];
  }
});
