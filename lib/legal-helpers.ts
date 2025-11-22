/**
 * Legal Helper Functions
 *
 * Utility functions for legal compliance checks and age verification.
 */

import { LEGAL_VERSIONS, type LegalDocumentType } from './legal-versions';
import type { User, Agency } from '@/types';

/**
 * Calculate age from date of birth
 */
export function calculateAge(dateOfBirth: Date | string): number {
  const dob = typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  return age;
}

/**
 * Check if user is 18 years or older
 */
export function isAdult(dateOfBirth: Date | string): boolean {
  return calculateAge(dateOfBirth) >= 18;
}

/**
 * Get current version of a legal document
 */
export function getCurrentLegalVersion(documentType: LegalDocumentType): string {
  return LEGAL_VERSIONS[documentType];
}

/**
 * Check if user has accepted the current version of a legal document
 */
export function hasAcceptedCurrentVersion(
  acceptedVersion: string | undefined,
  documentType: LegalDocumentType
): boolean {
  if (!acceptedVersion) return false;
  return acceptedVersion === getCurrentLegalVersion(documentType);
}

/**
 * Check if user needs to re-accept terms
 */
export function needsToAcceptTerms(user: User): boolean {
  return !hasAcceptedCurrentVersion(user.termsVersion, 'TERMS_OF_SERVICE');
}

/**
 * Check if user needs to re-accept privacy policy
 */
export function needsToAcceptPrivacy(user: User): boolean {
  return !hasAcceptedCurrentVersion(user.privacyVersion, 'PRIVACY_POLICY');
}

/**
 * Check if agency needs to re-accept agency terms
 */
export function needsToAcceptAgencyTerms(agency: Agency): boolean {
  return !hasAcceptedCurrentVersion(agency.agencyTermsVersion, 'AGENCY_TERMS');
}

/**
 * Format acceptance timestamp for display
 */
export function formatAcceptanceDate(timestamp: Date | string | undefined): string {
  if (!timestamp) return 'Not accepted';

  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  return date.toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Validate date of birth format and range
 */
export function validateDateOfBirth(dateOfBirth: Date | string): {
  valid: boolean;
  error?: string;
} {
  try {
    const dob = typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth;

    // Check if valid date
    if (isNaN(dob.getTime())) {
      return { valid: false, error: 'Invalid date format' };
    }

    // Check if date is in the future
    if (dob > new Date()) {
      return { valid: false, error: 'Date of birth cannot be in the future' };
    }

    // Check if person is at least 18 years old
    if (!isAdult(dob)) {
      return { valid: false, error: 'You must be at least 18 years old to use this platform' };
    }

    // Check if person is not unreasonably old (e.g., over 100 years)
    const age = calculateAge(dob);
    if (age > 100) {
      return { valid: false, error: 'Please enter a valid date of birth' };
    }

    return { valid: true };
  } catch (error) {
    return { valid: false, error: 'Invalid date format' };
  }
}
