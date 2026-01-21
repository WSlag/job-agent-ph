/**
 * Phone number validation and formatting utilities for Philippines (+63)
 */

// Valid Philippine mobile prefixes
const VALID_PH_MOBILE_PREFIXES = [
  // Globe/TM
  '817', '905', '906', '915', '916', '917', '926', '927', '935', '936', '937', '945', '953', '954', '955', '956', '965', '966', '967', '975', '976', '977', '978', '979', '994', '995', '996', '997',
  // Smart/TNT/Sun
  '813', '907', '908', '909', '910', '911', '912', '913', '914', '918', '919', '920', '921', '928', '929', '930', '938', '939', '940', '946', '947', '948', '949', '950', '951', '961', '963', '968', '969', '970', '971', '981', '989', '992', '998', '999',
  // DITO
  '895', '896', '897', '898', '991', '993',
];

/**
 * Normalize phone number by removing spaces, dashes, parentheses
 */
export function normalizePhone(phone: string): string {
  return phone.replace(/[\s\-\(\)\.]/g, '');
}

/**
 * Convert local Philippine phone number to E.164 format for Firebase
 * Accepts: 09171234567, +639171234567, 639171234567, 9171234567
 * Returns: +639171234567
 */
export function formatPhoneForFirebase(phone: string): string {
  const normalized = normalizePhone(phone);

  // Already in +63 format
  if (normalized.startsWith('+63')) {
    return normalized;
  }

  // Starts with 63 (without +)
  if (normalized.startsWith('63') && normalized.length === 12) {
    return '+' + normalized;
  }

  // Local format starting with 0
  if (normalized.startsWith('0') && normalized.length === 11) {
    return '+63' + normalized.substring(1);
  }

  // Just the 10 digits without country code or leading 0
  if (normalized.length === 10 && !normalized.startsWith('0')) {
    return '+63' + normalized;
  }

  // Return as-is with + prefix if not already there
  return normalized.startsWith('+') ? normalized : '+' + normalized;
}

/**
 * Format phone number for display
 * Input: +639171234567
 * Output: +63 917 123 4567
 */
export function formatPhoneForDisplay(phone: string): string {
  const normalized = normalizePhone(phone);

  // Handle +63 format
  if (normalized.startsWith('+63') && normalized.length === 13) {
    const digits = normalized.substring(3);
    return `+63 ${digits.substring(0, 3)} ${digits.substring(3, 6)} ${digits.substring(6)}`;
  }

  // Handle local format
  if (normalized.startsWith('0') && normalized.length === 11) {
    return `${normalized.substring(0, 4)} ${normalized.substring(4, 7)} ${normalized.substring(7)}`;
  }

  return phone;
}

/**
 * Validate Philippine mobile number
 * Returns true if valid Philippine mobile number
 */
export function validatePhilippinesPhone(phone: string): boolean {
  const normalized = normalizePhone(phone);

  let digits: string;

  // Extract the 10 digits after country code
  if (normalized.startsWith('+63')) {
    digits = normalized.substring(3);
  } else if (normalized.startsWith('63') && normalized.length === 12) {
    digits = normalized.substring(2);
  } else if (normalized.startsWith('0') && normalized.length === 11) {
    digits = normalized.substring(1);
  } else if (normalized.length === 10 && !normalized.startsWith('0')) {
    digits = normalized;
  } else {
    return false;
  }

  // Must be exactly 10 digits
  if (digits.length !== 10 || !/^\d+$/.test(digits)) {
    return false;
  }

  // Check if prefix is valid
  const prefix = digits.substring(0, 3);
  return VALID_PH_MOBILE_PREFIXES.includes(prefix);
}

/**
 * Check if phone number is a Philippine number
 */
export function isPhilippinesNumber(phone: string): boolean {
  const normalized = normalizePhone(phone);
  return (
    normalized.startsWith('+63') ||
    normalized.startsWith('63') ||
    (normalized.startsWith('0') && normalized.length === 11) ||
    (normalized.length === 10 && VALID_PH_MOBILE_PREFIXES.includes(normalized.substring(0, 3)))
  );
}

/**
 * Get user-friendly error message for Firebase phone auth errors
 */
export function getPhoneAuthErrorMessage(errorCode: string): string {
  const errorMessages: Record<string, string> = {
    'auth/invalid-phone-number': 'Please enter a valid Philippine mobile number',
    'auth/missing-phone-number': 'Phone number is required',
    'auth/quota-exceeded': 'SMS quota exceeded. Please try again later',
    'auth/user-disabled': 'This account has been disabled',
    'auth/operation-not-allowed': 'Phone authentication is not enabled',
    'auth/invalid-verification-code': 'Invalid verification code. Please try again',
    'auth/code-expired': 'Verification code has expired. Please request a new one',
    'auth/too-many-requests': 'Too many attempts. Please try again later',
    'auth/captcha-check-failed': 'reCAPTCHA verification failed. Please try again',
    'auth/invalid-app-credential': 'Phone verification service configuration error. Please try again later.',
    'auth/missing-verification-code': 'Please enter the verification code',
    'auth/invalid-verification-id': 'Verification session expired. Please request a new code',
    'auth/credential-already-in-use': 'This phone number is already linked to another account',
    'auth/provider-already-linked': 'This account already has a phone number linked',
    'auth/account-exists-with-different-credential': 'An account with this phone number already exists',
  };

  return errorMessages[errorCode] || 'An error occurred. Please try again';
}

/**
 * Get phone validation error message
 */
export function getPhoneValidationError(phone: string): string | null {
  if (!phone || phone.trim() === '') {
    return 'Phone number is required';
  }

  const normalized = normalizePhone(phone);

  // Check length
  if (normalized.length < 10) {
    return 'Phone number is too short';
  }

  if (normalized.length > 13) {
    return 'Phone number is too long';
  }

  // Check if it's a valid PH number
  if (!validatePhilippinesPhone(phone)) {
    return 'Please enter a valid Philippine mobile number';
  }

  return null;
}
