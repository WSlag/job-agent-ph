'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  isInAppBrowser as checkIsInAppBrowser,
  getInAppBrowserName,
  getDevicePlatform,
  isPWAInstalled as checkIsPWAInstalled,
} from '@/lib/browser-detection';

/**
 * Storage keys for Facebook browser detection state
 */
const STORAGE_KEYS = {
  DISMISSED: 'fb-browser-dismissed',
  DISMISSED_AT: 'fb-browser-dismissed-at',
  CONTINUE_ANYWAY: 'fb-browser-continue-anyway',
} as const;

/**
 * Hook return type
 */
export interface UseFacebookBrowserReturn {
  /** Whether the user is in a social media in-app browser */
  isInAppBrowser: boolean;
  /** Which in-app browser the user is in */
  browserName: 'facebook' | 'instagram' | 'tiktok' | 'other' | null;
  /** Device platform */
  platform: 'ios' | 'android' | 'desktop';
  /** Whether the PWA is installed */
  isPWAInstalled: boolean;
  /** Whether the user dismissed the prompt */
  isDismissed: boolean;
  /** Dismiss the prompt (remembers for 7 days) */
  dismissPrompt: () => void;
  /** User chose to continue using in-app browser */
  continueAnyway: () => void;
  /** Whether user has chosen to continue anyway */
  hasContinuedAnyway: boolean;
  /** Clear all stored preferences */
  clearPreferences: () => void;
}

/**
 * Time before allowing the prompt to show again after dismissal (7 days in ms)
 */
const DISMISSAL_COOLDOWN = 7 * 24 * 60 * 60 * 1000;

/**
 * Check if the prompt was dismissed and within cooldown period
 */
const checkIfDismissed = (): boolean => {
  if (typeof window === 'undefined') return false;

  try {
    const dismissedAt = localStorage.getItem(STORAGE_KEYS.DISMISSED_AT);
    if (dismissedAt) {
      const dismissTime = parseInt(dismissedAt, 10);
      const now = Date.now();
      return (now - dismissTime) < DISMISSAL_COOLDOWN;
    }
    return false;
  } catch {
    return false;
  }
};

/**
 * Check if user chose to continue anyway (session-only, resets when browser closes)
 */
const checkHasContinuedAnyway = (): boolean => {
  if (typeof window === 'undefined') return false;

  try {
    // Use sessionStorage so it resets when browser/tab closes
    return sessionStorage.getItem(STORAGE_KEYS.CONTINUE_ANYWAY) === 'true';
  } catch {
    return false;
  }
};

/**
 * Custom hook to detect Facebook/Instagram/TikTok in-app browsers
 * and manage user preferences for handling them.
 *
 * @example
 * ```tsx
 * const {
 *   isInAppBrowser,
 *   browserName,
 *   platform,
 *   isDismissed,
 *   dismissPrompt,
 *   continueAnyway,
 *   hasContinuedAnyway,
 * } = useFacebookBrowser();
 *
 * if (isInAppBrowser && !isDismissed && !hasContinuedAnyway) {
 *   // Show prompt to open in external browser
 * }
 * ```
 */
export function useFacebookBrowser(): UseFacebookBrowserReturn {
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [browserName, setBrowserName] = useState<'facebook' | 'instagram' | 'tiktok' | 'other' | null>(null);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop'>('desktop');
  const [isPWAInstalled, setIsPWAInstalled] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [hasContinuedAnyway, setHasContinuedAnyway] = useState(false);

  // Initialize state on mount
  useEffect(() => {
    setIsInAppBrowser(checkIsInAppBrowser());
    setBrowserName(getInAppBrowserName());
    setPlatform(getDevicePlatform());
    setIsPWAInstalled(checkIsPWAInstalled());
    setIsDismissed(checkIfDismissed());
    setHasContinuedAnyway(checkHasContinuedAnyway());
  }, []);

  /**
   * Dismiss the prompt and remember the choice
   */
  const dismissPrompt = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DISMISSED, 'true');
      localStorage.setItem(STORAGE_KEYS.DISMISSED_AT, String(Date.now()));
      setIsDismissed(true);
      console.log('[FB Browser] Prompt dismissed');
    } catch (error) {
      console.error('[FB Browser] Failed to save dismissal state:', error);
    }
  }, []);

  /**
   * User chose to continue using in-app browser (session-only)
   */
  const continueAnyway = useCallback(() => {
    try {
      // Use sessionStorage so choice resets when browser/tab closes
      sessionStorage.setItem(STORAGE_KEYS.CONTINUE_ANYWAY, 'true');
      setHasContinuedAnyway(true);
      console.log('[FB Browser] User chose to continue in-app (session only)');
    } catch (error) {
      console.error('[FB Browser] Failed to save continue anyway state:', error);
    }
  }, []);

  /**
   * Clear all stored preferences
   */
  const clearPreferences = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEYS.DISMISSED);
      localStorage.removeItem(STORAGE_KEYS.DISMISSED_AT);
      sessionStorage.removeItem(STORAGE_KEYS.CONTINUE_ANYWAY); // Session storage
      setIsDismissed(false);
      setHasContinuedAnyway(false);
      console.log('[FB Browser] Preferences cleared');
    } catch (error) {
      console.error('[FB Browser] Failed to clear preferences:', error);
    }
  }, []);

  return {
    isInAppBrowser,
    browserName,
    platform,
    isPWAInstalled,
    isDismissed,
    dismissPrompt,
    continueAnyway,
    hasContinuedAnyway,
    clearPreferences,
  };
}
