/**
 * PWA Analytics Helper
 *
 * Tracks PWA installation and engagement metrics.
 * This is a simple console-based implementation.
 * Replace with your analytics service (Google Analytics, Firebase Analytics, etc.)
 */

/**
 * PWA Event Types
 */
export type PWAEvent =
  | 'install_prompt_shown'
  | 'install_prompt_accepted'
  | 'install_prompt_dismissed'
  | 'install_banner_shown'
  | 'install_banner_clicked'
  | 'install_banner_dismissed'
  | 'install_button_clicked'
  | 'app_installed'
  | 'ios_modal_shown'
  | 'ios_modal_dismissed';

/**
 * Platform types
 */
export type Platform = 'chrome' | 'ios' | 'firefox' | 'safari' | 'edge' | 'unknown';

/**
 * Event metadata
 */
interface EventMetadata {
  platform?: Platform;
  source?: 'button' | 'banner' | 'prompt';
  [key: string]: any;
}

/**
 * Track a PWA event
 *
 * @param event The event to track
 * @param metadata Additional metadata for the event
 *
 * @example
 * ```ts
 * trackPWAEvent('install_prompt_shown', {
 *   platform: 'chrome',
 *   source: 'button',
 * });
 * ```
 */
export function trackPWAEvent(event: PWAEvent, metadata?: EventMetadata): void {
  // Console logging for development
  console.log('[PWA Analytics]', event, metadata);

  // TODO: Replace with your analytics service
  // Examples:

  // Google Analytics 4
  // if (typeof window !== 'undefined' && (window as any).gtag) {
  //   (window as any).gtag('event', event, {
  //     event_category: 'PWA',
  //     ...metadata,
  //   });
  // }

  // Firebase Analytics
  // import { logEvent } from 'firebase/analytics';
  // logEvent(analytics, event, metadata);

  // Custom endpoint
  // fetch('/api/analytics', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ event, metadata }),
  // });
}

/**
 * Get PWA installation statistics from localStorage
 *
 * @returns Installation statistics
 */
export function getPWAStats(): {
  installPromptShownCount: number;
  installPromptDismissedCount: number;
  bannerShownCount: number;
  isInstalled: boolean;
  lastDismissedAt: number | null;
} {
  if (typeof window === 'undefined') {
    return {
      installPromptShownCount: 0,
      installPromptDismissedCount: 0,
      bannerShownCount: 0,
      isInstalled: false,
      lastDismissedAt: null,
    };
  }

  try {
    return {
      installPromptShownCount: parseInt(localStorage.getItem('pwa-install-shown-count') || '0', 10),
      installPromptDismissedCount: parseInt(localStorage.getItem('pwa-dismiss-count') || '0', 10),
      bannerShownCount: parseInt(localStorage.getItem('pwa-banner-shown-count') || '0', 10),
      isInstalled: localStorage.getItem('pwa-install-accepted') === 'true',
      lastDismissedAt: localStorage.getItem('pwa-install-dismissed')
        ? parseInt(localStorage.getItem('pwa-install-dismissed')!, 10)
        : null,
    };
  } catch {
    return {
      installPromptShownCount: 0,
      installPromptDismissedCount: 0,
      bannerShownCount: 0,
      isInstalled: false,
      lastDismissedAt: null,
    };
  }
}

/**
 * Calculate install conversion rate
 *
 * @returns Conversion rate (0-100)
 */
export function getInstallConversionRate(): number {
  const stats = getPWAStats();

  if (stats.installPromptShownCount === 0) {
    return 0;
  }

  return stats.isInstalled
    ? (1 / stats.installPromptShownCount) * 100
    : 0;
}
