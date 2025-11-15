import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Log Firebase configuration on initialization
console.log('[Firebase Init] Initializing with configuration:');
console.log('[Firebase Init] Auth Domain:', firebaseConfig.authDomain);
console.log('[Firebase Init] Project ID:', firebaseConfig.projectId);
console.log('[Firebase Init] Timestamp:', new Date().toISOString());

// Initialize Firebase app (lazy initialization)
let app: FirebaseApp | null = null;

function getApp(): FirebaseApp {
  if (!app) {
    const existingApps = getApps();
    if (existingApps.length === 0) {
      console.log('[Firebase Init] Creating new Firebase app instance');
      app = initializeApp(firebaseConfig);
    } else {
      console.log('[Firebase Init] Reusing existing Firebase app instance');
      app = existingApps[0];
    }
  }
  return app;
}

// Lazy-initialized services - only created when first accessed
let _auth: Auth | null = null;
let _db: Firestore | null = null;
let _storage: FirebaseStorage | null = null;
let _persistenceInitialized = false;

// Getter for Auth - initializes on first use
export function getAuthInstance(): Auth {
  if (!_auth) {
    _auth = getAuth(getApp());

    // Set persistence to LOCAL mode on first auth access (persists across browser restarts)
    if (typeof window !== 'undefined' && !_persistenceInitialized) {
      _persistenceInitialized = true;
      setPersistence(_auth, browserLocalPersistence).catch((error) => {
        console.error('Error setting auth persistence:', error);
      });
    }
  }
  return _auth;
}

// Getter for Firestore - initializes on first use
export function getDbInstance(): Firestore {
  if (!_db) {
    _db = getFirestore(getApp());
  }
  return _db;
}

// Getter for Storage - initializes on first use
export function getStorageInstance(): FirebaseStorage {
  if (!_storage) {
    _storage = getStorage(getApp());
  }
  return _storage;
}

// Legacy exports for backward compatibility (will be removed in Phase 2)
// These use the lazy getters internally
export const auth = new Proxy({} as Auth, {
  get(_target, prop) {
    return (getAuthInstance() as any)[prop];
  }
});

export const db = new Proxy({} as Firestore, {
  get(_target, prop) {
    return (getDbInstance() as any)[prop];
  }
});

export const storage = new Proxy({} as FirebaseStorage, {
  get(_target, prop) {
    return (getStorageInstance() as any)[prop];
  }
});
