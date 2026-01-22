/**
 * Browser Detection Utilities
 *
 * Detects Facebook, Instagram, and TikTok in-app browsers
 * and provides utilities for guiding users to external browsers.
 */

/**
 * Check if running in Facebook in-app browser
 */
export function isFacebookBrowser(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent || '';
  return ua.includes('FBAN') || ua.includes('FBAV');
}

/**
 * Check if running in Instagram in-app browser
 */
export function isInstagramBrowser(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent || '';
  return ua.includes('Instagram');
}

/**
 * Check if running in TikTok in-app browser
 */
export function isTikTokBrowser(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent || '';
  return ua.includes('TikTok') || ua.includes('BytedanceWebview');
}

/**
 * Check if running in any social media in-app browser
 */
export function isInAppBrowser(): boolean {
  return isFacebookBrowser() || isInstagramBrowser() || isTikTokBrowser();
}

/**
 * Get which in-app browser the user is in
 */
export function getInAppBrowserName(): 'facebook' | 'instagram' | 'tiktok' | 'other' | null {
  if (typeof window === 'undefined') return null;

  if (isFacebookBrowser()) return 'facebook';
  if (isInstagramBrowser()) return 'instagram';
  if (isTikTokBrowser()) return 'tiktok';

  return null;
}

/**
 * Get the device platform
 */
export function getDevicePlatform(): 'ios' | 'android' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';

  const ua = navigator.userAgent.toLowerCase();

  if (/iphone|ipad|ipod/.test(ua)) {
    return 'ios';
  }

  if (/android/.test(ua)) {
    return 'android';
  }

  return 'desktop';
}

/**
 * Check if the PWA is installed (running in standalone mode)
 */
export function isPWAInstalled(): boolean {
  if (typeof window === 'undefined') return false;

  // Check if running in standalone mode (Android/Desktop)
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return true;
  }

  // Check if running as installed PWA (Safari/iOS)
  if ((window.navigator as any).standalone === true) {
    return true;
  }

  return false;
}

/**
 * Generate a URL to open in an external browser with install prompt parameter
 * For Android, generates a Chrome intent URL
 * For iOS, returns the regular URL (user must manually open in Safari)
 *
 * Adds ?source=fb&install=1 to trigger immediate PWA install prompt
 */
export function getOpenInBrowserUrl(path: string = '/'): string {
  if (typeof window === 'undefined') return path;

  const platform = getDevicePlatform();
  const browserName = getInAppBrowserName() || 'social';

  // Add install prompt parameters to the path
  const separator = path.includes('?') ? '&' : '?';
  const pathWithParams = `${path}${separator}source=${browserName}&install=1`;

  if (platform === 'android') {
    // Chrome intent URL for Android
    // This will open the URL in Chrome if installed
    return `intent://${window.location.host}${pathWithParams}#Intent;scheme=https;package=com.android.chrome;end`;
  }

  // For iOS/desktop, return full URL with parameters
  return `${window.location.origin}${pathWithParams}`;
}

/**
 * Copy text to clipboard
 * Returns true if successful, false otherwise
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  try {
    // Try modern clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);

    return successful;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * Get the display name for the recommended browser based on platform
 */
export function getRecommendedBrowserName(): string {
  const platform = getDevicePlatform();

  if (platform === 'ios') {
    return 'Safari';
  }

  if (platform === 'android') {
    return 'Chrome';
  }

  return 'your browser';
}

/**
 * Get the current page URL for sharing/copying
 */
export function getCurrentUrl(): string {
  if (typeof window === 'undefined') return '';
  return window.location.href;
}

/**
 * Get the current page URL with install prompt parameters
 * Used when copying URL for users to paste in external browser
 */
export function getCurrentUrlWithInstallParams(): string {
  if (typeof window === 'undefined') return '';

  const browserName = getInAppBrowserName() || 'social';
  const url = new URL(window.location.href);

  // Add install parameters
  url.searchParams.set('source', browserName);
  url.searchParams.set('install', '1');

  return url.toString();
}
