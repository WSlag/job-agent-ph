/**
 * Input validation and sanitization utilities
 * Protects against XSS, injection attacks, and invalid data
 */

// Email validation
export function validateEmail(email: string): boolean {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

// Phone number validation (international format)
export function validatePhone(phone: string): boolean {
  if (!phone) return false;
  // Accepts formats: +1234567890, (123) 456-7890, 123-456-7890, etc.
  const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
  return phoneRegex.test(phone.trim());
}

// URL validation
export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Sanitize string input (remove potentially dangerous characters)
export function sanitizeString(input: string, maxLength: number = 1000): string {
  if (!input) return '';

  // Remove null bytes and control characters
  let sanitized = input.replace(/\0/g, '');

  // Trim whitespace
  sanitized = sanitized.trim();

  // Limit length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized;
}

// Sanitize HTML to prevent XSS (basic - for more complex needs, use DOMPurify)
export function sanitizeHtml(html: string): string {
  if (!html) return '';

  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Validate and sanitize job title
export function validateJobTitle(title: string): { valid: boolean; sanitized: string; error?: string } {
  const sanitized = sanitizeString(title, 200);

  if (!sanitized || sanitized.length < 3) {
    return { valid: false, sanitized, error: 'Job title must be at least 3 characters' };
  }

  if (sanitized.length > 200) {
    return { valid: false, sanitized, error: 'Job title must be less than 200 characters' };
  }

  return { valid: true, sanitized };
}

// Validate and sanitize job description
export function validateJobDescription(description: string): { valid: boolean; sanitized: string; error?: string } {
  const sanitized = sanitizeString(description, 10000);

  if (!sanitized || sanitized.length < 50) {
    return { valid: false, sanitized, error: 'Job description must be at least 50 characters' };
  }

  if (sanitized.length > 10000) {
    return { valid: false, sanitized, error: 'Job description must be less than 10,000 characters' };
  }

  return { valid: true, sanitized };
}

// Validate salary range
export function validateSalaryRange(min: number, max: number): { valid: boolean; error?: string } {
  if (min < 0 || max < 0) {
    return { valid: false, error: 'Salary cannot be negative' };
  }

  if (min > max) {
    return { valid: false, error: 'Minimum salary cannot be greater than maximum salary' };
  }

  if (min > 10000000 || max > 10000000) {
    return { valid: false, error: 'Salary values seem unreasonably high' };
  }

  return { valid: true };
}

// Validate skills array
export function validateSkills(skills: string[]): { valid: boolean; sanitized: string[]; error?: string } {
  if (!Array.isArray(skills)) {
    return { valid: false, sanitized: [], error: 'Skills must be an array' };
  }

  if (skills.length === 0) {
    return { valid: false, sanitized: [], error: 'At least one skill is required' };
  }

  if (skills.length > 50) {
    return { valid: false, sanitized: [], error: 'Maximum 50 skills allowed' };
  }

  const sanitized = skills
    .map(skill => sanitizeString(skill, 100))
    .filter(skill => skill.length > 0 && skill.length <= 100);

  if (sanitized.length === 0) {
    return { valid: false, sanitized: [], error: 'No valid skills provided' };
  }

  return { valid: true, sanitized };
}

// Validate file upload (resume, images, etc.)
export function validateFile(
  file: File,
  options: {
    maxSize?: number; // in bytes
    allowedTypes?: string[];
    allowedExtensions?: string[];
  } = {}
): { valid: boolean; error?: string } {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'],
    allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png']
  } = options;

  // Check file size
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`
    };
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type must be one of: ${allowedTypes.join(', ')}`
    };
  }

  // Check file extension
  const fileName = file.name.toLowerCase();
  const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));

  if (!hasValidExtension) {
    return {
      valid: false,
      error: `File extension must be one of: ${allowedExtensions.join(', ')}`
    };
  }

  return { valid: true };
}

// Validate company registration number (format may vary by country)
export function validateRegistrationNumber(regNumber: string): { valid: boolean; sanitized: string; error?: string } {
  const sanitized = sanitizeString(regNumber, 50).replace(/[^a-zA-Z0-9-]/g, '');

  if (!sanitized || sanitized.length < 3) {
    return { valid: false, sanitized, error: 'Registration number must be at least 3 characters' };
  }

  if (sanitized.length > 50) {
    return { valid: false, sanitized, error: 'Registration number is too long' };
  }

  return { valid: true, sanitized };
}

// Validate location/address
export function validateLocation(location: string): { valid: boolean; sanitized: string; error?: string } {
  const sanitized = sanitizeString(location, 200);

  if (!sanitized || sanitized.length < 3) {
    return { valid: false, sanitized, error: 'Location must be at least 3 characters' };
  }

  return { valid: true, sanitized };
}

// Validate experience years
export function validateExperience(years: number): { valid: boolean; error?: string } {
  if (years < 0 || years > 70) {
    return { valid: false, error: 'Experience years must be between 0 and 70' };
  }

  return { valid: true };
}

// Validate cover letter
export function validateCoverLetter(coverLetter: string): { valid: boolean; sanitized: string; error?: string } {
  const sanitized = sanitizeString(coverLetter, 5000);

  if (sanitized.length > 5000) {
    return { valid: false, sanitized, error: 'Cover letter must be less than 5,000 characters' };
  }

  return { valid: true, sanitized };
}

// Validate message content
export function validateMessage(message: string): { valid: boolean; sanitized: string; error?: string } {
  const sanitized = sanitizeString(message, 2000);

  if (!sanitized || sanitized.length === 0) {
    return { valid: false, sanitized, error: 'Message cannot be empty' };
  }

  if (sanitized.length > 2000) {
    return { valid: false, sanitized, error: 'Message must be less than 2,000 characters' };
  }

  return { valid: true, sanitized };
}

// Password strength validation
export function validatePassword(password: string): { valid: boolean; error?: string; strength?: 'weak' | 'medium' | 'strong' } {
  if (!password || password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters', strength: 'weak' };
  }

  if (password.length > 128) {
    return { valid: false, error: 'Password is too long (max 128 characters)', strength: 'weak' };
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const criteriaMet = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;

  if (criteriaMet < 2) {
    return {
      valid: false,
      error: 'Password must contain at least 2 of: uppercase, lowercase, numbers, special characters',
      strength: 'weak'
    };
  }

  const strength = criteriaMet === 4 ? 'strong' : criteriaMet === 3 ? 'medium' : 'weak';

  return { valid: true, strength };
}

// Rate limiting helper (simple in-memory implementation)
// For production, use Redis or similar
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  key: string,
  maxAttempts: number = 10,
  windowMs: number = 60000 // 1 minute
): { allowed: boolean; remainingAttempts: number; resetAt: number } {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  // Clean up old entries
  if (record && now > record.resetAt) {
    rateLimitStore.delete(key);
  }

  const currentRecord = rateLimitStore.get(key);

  if (!currentRecord) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remainingAttempts: maxAttempts - 1, resetAt: now + windowMs };
  }

  if (currentRecord.count >= maxAttempts) {
    return {
      allowed: false,
      remainingAttempts: 0,
      resetAt: currentRecord.resetAt
    };
  }

  currentRecord.count++;
  return {
    allowed: true,
    remainingAttempts: maxAttempts - currentRecord.count,
    resetAt: currentRecord.resetAt
  };
}
