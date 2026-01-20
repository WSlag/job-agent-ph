import Papa from 'papaparse';
import { ParsedCSVRow, OutreachMessageType } from '@/types';

export interface CSVValidationResult {
  isValid: boolean;
  data: ParsedCSVRow[];
  errors: string[];
  stats: {
    total: number;
    valid: number;
    invalid: number;
    duplicates: number;
  };
}

// RFC 5322 compliant email regex
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const VALID_MESSAGE_TYPES: OutreachMessageType[] = ['short', 'standard', 'formal'];

/**
 * Validates an email address
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim().toLowerCase();
  return EMAIL_REGEX.test(trimmed) && trimmed.length <= 254;
}

/**
 * Validates and normalizes a message type
 */
export function validateMessageType(type: string | undefined): OutreachMessageType | null {
  if (!type) return 'standard'; // Default to standard
  const normalized = type.trim().toLowerCase() as OutreachMessageType;
  return VALID_MESSAGE_TYPES.includes(normalized) ? normalized : null;
}

/**
 * Parses CSV content for outreach emails
 */
export function parseOutreachCSV(csvContent: string): CSVValidationResult {
  const errors: string[] = [];
  const seenEmails = new Set<string>();
  let duplicatesCount = 0;

  const result = Papa.parse<Record<string, string>>(csvContent, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim().toLowerCase(),
  });

  if (result.errors.length > 0) {
    result.errors.forEach((error) => {
      errors.push(`CSV parsing error at row ${error.row}: ${error.message}`);
    });
  }

  // Validate headers
  const headers = result.meta.fields || [];
  const hasEmailColumn = headers.some(h =>
    h === 'recipientemail' || h === 'email' || h === 'recipient_email'
  );

  if (!hasEmailColumn) {
    errors.push('CSV must have a "recipientEmail" or "email" column');
    return {
      isValid: false,
      data: [],
      errors,
      stats: { total: 0, valid: 0, invalid: 0, duplicates: 0 },
    };
  }

  const data: ParsedCSVRow[] = result.data.map((row, index) => {
    // Get email from various possible column names
    const email = (
      row['recipientemail'] ||
      row['email'] ||
      row['recipient_email'] ||
      ''
    ).trim().toLowerCase();

    // Get agency name
    const agencyName = (
      row['agencyname'] ||
      row['agency_name'] ||
      row['agency'] ||
      row['name'] ||
      ''
    ).trim() || undefined;

    // Get message type
    const rawMessageType = (
      row['messagetype'] ||
      row['message_type'] ||
      row['type'] ||
      ''
    ).trim();

    // Validate
    let isValid = true;
    let validationError: string | undefined;

    // Check email
    if (!email) {
      isValid = false;
      validationError = 'Email is required';
    } else if (!validateEmail(email)) {
      isValid = false;
      validationError = 'Invalid email format';
    } else if (seenEmails.has(email)) {
      isValid = false;
      validationError = 'Duplicate email';
      duplicatesCount++;
    } else {
      seenEmails.add(email);
    }

    // Validate message type
    const messageType = validateMessageType(rawMessageType);
    if (rawMessageType && !messageType) {
      isValid = false;
      validationError = validationError || `Invalid message type: ${rawMessageType}. Use short, standard, or formal`;
    }

    // Validate agency name length
    if (agencyName && agencyName.length > 100) {
      isValid = false;
      validationError = validationError || 'Agency name must be 100 characters or less';
    }

    return {
      recipientEmail: email,
      agencyName,
      messageType: messageType || 'standard',
      isValid,
      validationError,
    };
  });

  // Filter out completely empty rows
  const filteredData = data.filter(row => row.recipientEmail);

  const validCount = filteredData.filter(row => row.isValid).length;
  const invalidCount = filteredData.filter(row => !row.isValid).length;

  return {
    isValid: errors.length === 0 && invalidCount === 0,
    data: filteredData,
    errors,
    stats: {
      total: filteredData.length,
      valid: validCount,
      invalid: invalidCount,
      duplicates: duplicatesCount,
    },
  };
}

/**
 * Generates a sample CSV for download
 */
export function generateSampleCSV(): string {
  const headers = ['recipientEmail', 'agencyName', 'messageType'];
  const sampleRows = [
    ['agency1@example.com', 'ABC Recruitment Agency', 'standard'],
    ['agency2@example.com', 'XYZ Manpower Services', 'formal'],
    ['agency3@example.com', '', 'short'],
  ];

  return [
    headers.join(','),
    ...sampleRows.map(row => row.join(',')),
  ].join('\n');
}

/**
 * Downloads a string as a file
 */
export function downloadCSV(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

/**
 * Removes duplicate emails, keeping the first occurrence
 */
export function removeDuplicateEmails(rows: ParsedCSVRow[]): ParsedCSVRow[] {
  const seen = new Set<string>();
  return rows.filter(row => {
    const email = row.recipientEmail.toLowerCase();
    if (seen.has(email)) {
      return false;
    }
    seen.add(email);
    return true;
  });
}

/**
 * Filters to only valid rows
 */
export function getValidRows(rows: ParsedCSVRow[]): ParsedCSVRow[] {
  return rows.filter(row => row.isValid);
}

/**
 * Max allowed rows per batch (to manage rate limits)
 */
export const MAX_BATCH_SIZE = 500;

/**
 * Max file size in bytes (1MB)
 */
export const MAX_FILE_SIZE = 1024 * 1024;
