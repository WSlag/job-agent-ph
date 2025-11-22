/**
 * Legal Document Version Control
 *
 * This file maintains version tracking for all legal documents.
 * Update the version number whenever you make changes to legal documents.
 */

export const LEGAL_VERSIONS = {
  TERMS_OF_SERVICE: '1.0',
  AGENCY_TERMS: '1.0',
  PRIVACY_POLICY: '1.1', // Updated November 11, 2025
} as const;

export const LEGAL_DOCUMENT_URLS = {
  TERMS_OF_SERVICE: '/terms',
  AGENCY_TERMS: '/agency-terms',
  PRIVACY_POLICY: '/privacy',
  ZERO_FEE_POLICY: '/legal/zero-fee-policy',
} as const;

export type LegalDocumentType = keyof typeof LEGAL_VERSIONS;
