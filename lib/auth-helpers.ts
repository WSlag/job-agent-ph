/**
 * Authentication helper functions
 */

/**
 * Get the current application URL based on environment
 * This ensures proper redirect URIs for OAuth flows
 */
export function getAppUrl(): string {
  // In development, use the actual URL where the app is running
  if (process.env.NODE_ENV === 'development') {
    // Check if we're in the browser
    if (typeof window !== 'undefined') {
      // Use the current browser URL
      return window.location.origin;
    }
    // Server-side in development
    return 'http://localhost:3000';
  }

  // In production, use the configured app URL
  return process.env.NEXT_PUBLIC_APP_URL || 'https://www.jobagentph.com';
}

/**
 * Get the redirect URI for OAuth providers
 * This ensures we use the correct domain for redirects
 */
export function getOAuthRedirectUri(path: string = '/auth/login'): string {
  const baseUrl = getAppUrl();
  return `${baseUrl}${path}`;
}

/**
 * Check if we're running on localhost
 */
export function isLocalhost(): boolean {
  if (typeof window === 'undefined') return false;

  const hostname = window.location.hostname;
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.');
}

/**
 * Log authentication debug information
 */
export function logAuthDebug(message: string, data?: any) {
  const timestamp = new Date().toISOString();
  const prefix = '[Auth Debug]';

  if (data) {
    console.log(`${prefix} ${timestamp} - ${message}`, data);
  } else {
    console.log(`${prefix} ${timestamp} - ${message}`);
  }
}