import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  Auth,
  setPersistence,
  browserLocalPersistence,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  UserCredential,
  initializeRecaptchaConfig,
} from 'firebase/auth';
import { initializeAppCheck, ReCaptchaEnterpriseProvider, AppCheck } from 'firebase/app-check';
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

/**
 * Initialize Firebase App Check with reCAPTCHA Enterprise
 * This protects all Firebase services from abuse
 * The site key should match what's configured in Firebase Console > App Check
 *
 * NOTE: App Check is temporarily disabled to avoid conflict with Phone Auth's
 * RecaptchaVerifier. Phone Auth uses standard reCAPTCHA v2 which is managed
 * automatically by Firebase. Re-enable App Check once phone auth is working.
 */
function initializeAppCheckIfNeeded(): void {
  if (typeof window === 'undefined' || _appCheckInitialized) {
    return;
  }

  // TEMPORARILY DISABLED: App Check conflicts with Phone Auth's RecaptchaVerifier
  // The reCAPTCHA Enterprise key causes "Invalid site key" errors because
  // Phone Auth expects Firebase-managed reCAPTCHA v2, not Enterprise.
  // Re-enable once phone auth is working by uncommenting the code below.
  console.log('[Firebase] App Check disabled - using standard reCAPTCHA for phone auth');
  _appCheckInitialized = true;
  return;

  /*
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY;
  if (!siteKey) {
    console.warn('[Firebase] NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY not set, App Check disabled');
    _appCheckInitialized = true;
    return;
  }

  try {
    _appCheckInitialized = true;
    _appCheck = initializeAppCheck(getApp(), {
      provider: new ReCaptchaEnterpriseProvider(siteKey),
      isTokenAutoRefreshEnabled: true,
    });
    console.log('[Firebase] App Check initialized with reCAPTCHA Enterprise');
  } catch (error) {
    console.error('[Firebase] Failed to initialize App Check:', error);
  }
  */
}

// Lazy-initialized services - only created when first accessed
let _auth: Auth | null = null;
let _db: Firestore | null = null;
let _storage: FirebaseStorage | null = null;
let _appCheck: AppCheck | null = null;
let _persistenceInitialized = false;
let _appCheckInitialized = false;
let _recaptchaConfigInitialized = false;

/**
 * Initialize reCAPTCHA Enterprise config for phone authentication
 * This must be called to enable reCAPTCHA Enterprise for phone auth flows
 *
 * NOTE: Temporarily disabled - initializeRecaptchaConfig() requires Firebase
 * Authentication to be configured for reCAPTCHA Enterprise in the Console.
 * Using standard Firebase-managed reCAPTCHA v2 instead.
 */
async function initializeRecaptchaConfigIfNeeded(auth: Auth): Promise<void> {
  if (typeof window === 'undefined' || _recaptchaConfigInitialized) {
    return;
  }

  // TEMPORARILY DISABLED: initializeRecaptchaConfig requires Firebase Auth
  // to be configured for reCAPTCHA Enterprise mode in Firebase Console.
  // Using standard reCAPTCHA v2 for now (handled automatically by RecaptchaVerifier).
  console.log('[Firebase] Using standard reCAPTCHA v2 for phone auth');
  _recaptchaConfigInitialized = true;
  return;

  /*
  _recaptchaConfigInitialized = true;

  try {
    await initializeRecaptchaConfig(auth);
    console.log('[Firebase] reCAPTCHA Enterprise config initialized for phone auth');
  } catch (error) {
    console.error('[Firebase] Failed to initialize reCAPTCHA config:', error);
    // Reset flag so it can be retried
    _recaptchaConfigInitialized = false;
  }
  */
}

// Getter for Auth - initializes on first use
export function getAuthInstance(): Auth {
  if (!_auth) {
    // Initialize App Check before auth to ensure phone auth works with reCAPTCHA Enterprise
    initializeAppCheckIfNeeded();

    _auth = getAuth(getApp());

    // Set persistence to LOCAL mode on first auth access (persists across browser restarts)
    if (typeof window !== 'undefined' && !_persistenceInitialized) {
      _persistenceInitialized = true;
      setPersistence(_auth, browserLocalPersistence).catch((error) => {
        console.error('Error setting auth persistence:', error);
      });

      // Initialize reCAPTCHA Enterprise config for phone authentication
      initializeRecaptchaConfigIfNeeded(_auth);
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

// Phone Authentication Utilities
let _recaptchaVerifier: RecaptchaVerifier | null = null;
let _recaptchaCreatedAt: number = 0;
const RECAPTCHA_MAX_AGE = 60000; // 1 minute - reCAPTCHA tokens expire

/**
 * Set up invisible reCAPTCHA verifier for phone authentication
 * Reuses existing verifier if still valid (< 1 minute old)
 * @param containerId - The ID of the container element for reCAPTCHA
 * @param forceNew - Force creation of a new verifier
 * @returns RecaptchaVerifier instance
 */
export function setupRecaptchaVerifier(containerId: string = 'recaptcha-container', forceNew: boolean = false): RecaptchaVerifier {
  const now = Date.now();

  // Reuse existing verifier if it's still fresh (less than 1 minute old) and not forced new
  if (_recaptchaVerifier && !forceNew && now - _recaptchaCreatedAt < RECAPTCHA_MAX_AGE) {
    console.log('[Phone Auth] Reusing existing reCAPTCHA verifier');
    return _recaptchaVerifier;
  }

  // Clean up existing verifier if any
  if (_recaptchaVerifier) {
    try {
      _recaptchaVerifier.clear();
    } catch (e) {
      // Ignore cleanup errors
    }
    _recaptchaVerifier = null;
  }

  const auth = getAuthInstance();

  _recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
    callback: () => {
      console.log('[Phone Auth] reCAPTCHA solved');
    },
    'expired-callback': () => {
      console.log('[Phone Auth] reCAPTCHA expired');
      // Mark as expired so next call creates a new one
      _recaptchaCreatedAt = 0;
    },
  });

  _recaptchaCreatedAt = now;
  console.log('[Phone Auth] Created new reCAPTCHA verifier');

  return _recaptchaVerifier;
}

/**
 * Get the current RecaptchaVerifier instance
 * Creates a new one if none exists
 */
export function getRecaptchaVerifier(containerId: string = 'recaptcha-container'): RecaptchaVerifier {
  if (!_recaptchaVerifier) {
    return setupRecaptchaVerifier(containerId);
  }
  return _recaptchaVerifier;
}

/**
 * Clean up reCAPTCHA verifier
 */
export function cleanupRecaptchaVerifier(): void {
  if (_recaptchaVerifier) {
    try {
      _recaptchaVerifier.clear();
    } catch (e) {
      // Ignore cleanup errors
    }
    _recaptchaVerifier = null;
    _recaptchaCreatedAt = 0;
  }
}

/**
 * Send OTP to phone number via Firebase
 * @param phoneNumber - Phone number in E.164 format (e.g., +639171234567)
 * @param recaptchaVerifier - RecaptchaVerifier instance
 * @returns ConfirmationResult to verify the OTP
 */
export async function sendPhoneOTP(
  phoneNumber: string,
  recaptchaVerifier: RecaptchaVerifier
): Promise<ConfirmationResult> {
  const auth = getAuthInstance();
  console.log('[Phone Auth] Sending OTP to:', phoneNumber);

  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    console.log('[Phone Auth] OTP sent successfully');
    return confirmationResult;
  } catch (error) {
    console.error('[Phone Auth] Error sending OTP:', error);
    // Clean up reCAPTCHA on error so it can be re-initialized
    cleanupRecaptchaVerifier();
    throw error;
  }
}

/**
 * Verify OTP code
 * @param confirmationResult - ConfirmationResult from sendPhoneOTP
 * @param code - 6-digit verification code
 * @returns UserCredential on success
 */
export async function verifyPhoneOTP(
  confirmationResult: ConfirmationResult,
  code: string
): Promise<UserCredential> {
  console.log('[Phone Auth] Verifying OTP code');

  try {
    const userCredential = await confirmationResult.confirm(code);
    console.log('[Phone Auth] OTP verified successfully');
    return userCredential;
  } catch (error) {
    console.error('[Phone Auth] Error verifying OTP:', error);
    throw error;
  }
}

// Re-export types for convenience
export type { ConfirmationResult, RecaptchaVerifier };
