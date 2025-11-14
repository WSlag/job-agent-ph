'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * BeforeInstallPromptEvent interface
 * This event is fired before the browser shows the install prompt
 */
interface BeforeInstallPromptEvent extends Event {
  /**
   * Returns a Promise that resolves to an object containing the user's choice
   */
  prompt: () => Promise<void>;
  /**
   * Returns the platform the user chose
   */
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
}

/**
 * Platform types for PWA installation
 */
type Platform = 'chrome' | 'ios' | 'unsupported';

/**
 * Install prompt hook return type
 */
interface InstallPromptHook {
  /**
   * Whether the install prompt can be shown
   */
  canInstall: boolean;

  /**
   * Whether the PWA is already installed
   */
  isInstalled: boolean;

  /**
   * Whether the install prompt was dismissed by the user
   */
  isDismissed: boolean;

  /**
   * Trigger the install prompt
   */
  promptInstall: () => Promise<void>;

  /**
   * Dismiss the prompt and remember the choice
   */
  dismissPrompt: () => void;

  /**
   * The current platform
   */
  platform: Platform;

  /**
   * Whether the install is in progress
   */
  isInstalling: boolean;
}

/**
 * LocalStorage keys for PWA install state
 */
const STORAGE_KEYS = {
  DISMISSED: 'pwa-install-dismissed',
  ACCEPTED: 'pwa-install-accepted',
  DISMISS_COUNT: 'pwa-dismiss-count',
} as const;

/**
 * Time before allowing the prompt to show again after dismissal (7 days in ms)
 */
const DISMISSAL_COOLDOWN = 7 * 24 * 60 * 60 * 1000;

/**
 * Maximum number of dismissals before never showing again
 */
const MAX_DISMISSALS = 3;

/**
 * Detect the current platform
 */
const detectPlatform = (): Platform => {
  if (typeof window === 'undefined') return 'unsupported';

  const userAgent = window.navigator.userAgent.toLowerCase();
  const isIOS = /iphone|ipad|ipod/.test(userAgent);
  const isChromium = /chrome|chromium|edg/.test(userAgent) && !/opr/.test(userAgent);

  if (isIOS) return 'ios';
  if (isChromium) return 'chrome';
  return 'unsupported';
};

/**
 * Check if the app is already installed as a PWA
 */
const checkIfInstalled = (): boolean => {
  if (typeof window === 'undefined') return false;

  // Check if running in standalone mode
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return true;
  }

  // Check if running as installed PWA (Safari)
  if ((window.navigator as any).standalone === true) {
    return true;
  }

  // Check localStorage for install acceptance
  try {
    return localStorage.getItem(STORAGE_KEYS.ACCEPTED) === 'true';
  } catch {
    return false;
  }
};

/**
 * Check if the prompt was dismissed and within cooldown period
 */
const checkIfDismissed = (): boolean => {
  if (typeof window === 'undefined') return false;

  try {
    // Check if dismissed too many times
    const dismissCount = parseInt(localStorage.getItem(STORAGE_KEYS.DISMISS_COUNT) || '0', 10);
    if (dismissCount >= MAX_DISMISSALS) {
      return true;
    }

    // Check if dismissed recently (within cooldown period)
    const dismissedAt = localStorage.getItem(STORAGE_KEYS.DISMISSED);
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
 * Custom hook to handle PWA installation prompt
 *
 * This hook listens to the `beforeinstallprompt` event and provides
 * methods to trigger the install prompt or dismiss it.
 *
 * @example
 * ```tsx
 * const { canInstall, promptInstall, platform } = useInstallPrompt();
 *
 * return (
 *   <>
 *     {canInstall && platform === 'chrome' && (
 *       <button onClick={promptInstall}>Install App</button>
 *     )}
 *   </>
 * );
 * ```
 */
export function useInstallPrompt(): InstallPromptHook {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [isInstalling, setIsInstalling] = useState<boolean>(false);
  const [platform, setPlatform] = useState<Platform>('unsupported');

  // Initialize state on mount
  useEffect(() => {
    setPlatform(detectPlatform());
    setIsInstalled(checkIfInstalled());
    setIsDismissed(checkIfDismissed());
  }, []);

  // Listen for beforeinstallprompt event
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the default browser install prompt
      e.preventDefault();

      // Store the event for later use
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      console.log('[PWA] beforeinstallprompt event fired - PWA is installable');
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      console.log('[PWA] App successfully installed');
      setIsInstalled(true);
      setDeferredPrompt(null);

      // Store in localStorage
      try {
        localStorage.setItem(STORAGE_KEYS.ACCEPTED, 'true');
      } catch (error) {
        console.error('[PWA] Failed to save install state:', error);
      }
    };

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  /**
   * Trigger the install prompt
   */
  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) {
      console.warn('[PWA] Install prompt not available');
      return;
    }

    try {
      setIsInstalling(true);

      // Show the install prompt
      await deferredPrompt.prompt();

      // Wait for the user's response
      const choiceResult = await deferredPrompt.userChoice;

      console.log('[PWA] User choice:', choiceResult.outcome);

      if (choiceResult.outcome === 'accepted') {
        console.log('[PWA] User accepted the install prompt');
        setIsInstalled(true);

        // Store acceptance in localStorage
        try {
          localStorage.setItem(STORAGE_KEYS.ACCEPTED, 'true');
        } catch (error) {
          console.error('[PWA] Failed to save install acceptance:', error);
        }
      } else {
        console.log('[PWA] User dismissed the install prompt');
        // Don't mark as dismissed here - let user decide via dismissPrompt()
      }

      // Clear the deferred prompt
      setDeferredPrompt(null);
    } catch (error) {
      console.error('[PWA] Error showing install prompt:', error);
    } finally {
      setIsInstalling(false);
    }
  }, [deferredPrompt]);

  /**
   * Dismiss the prompt and remember the choice
   */
  const dismissPrompt = useCallback(() => {
    try {
      // Increment dismiss count
      const currentCount = parseInt(localStorage.getItem(STORAGE_KEYS.DISMISS_COUNT) || '0', 10);
      localStorage.setItem(STORAGE_KEYS.DISMISS_COUNT, String(currentCount + 1));

      // Store dismissal timestamp
      localStorage.setItem(STORAGE_KEYS.DISMISSED, String(Date.now()));

      setIsDismissed(true);

      console.log('[PWA] Install prompt dismissed by user (count:', currentCount + 1, ')');
    } catch (error) {
      console.error('[PWA] Failed to save dismissal state:', error);
    }
  }, []);

  // Determine if we can show install UI
  const canInstall = Boolean(
    deferredPrompt &&
    !isInstalled &&
    !isDismissed &&
    platform === 'chrome'
  );

  return {
    canInstall,
    isInstalled,
    isDismissed,
    promptInstall,
    dismissPrompt,
    platform,
    isInstalling,
  };
}
