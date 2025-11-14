'use client';

import { useState, useEffect } from 'react';
import { X, Download, Smartphone } from 'lucide-react';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';
import { COLORS } from '@/lib/colors';
import Image from 'next/image';

/**
 * LocalStorage key for banner state
 */
const BANNER_SHOWN_KEY = 'pwa-banner-shown-count';
const BANNER_LAST_SHOWN_KEY = 'pwa-banner-last-shown';
const PAGE_COUNT_KEY = 'pwa-page-count';

/**
 * Engagement thresholds for showing the banner
 */
const ENGAGEMENT_THRESHOLDS = {
  TIME_ON_SITE: 30000, // 30 seconds
  PAGES_VISITED: 3,    // 3 pages
} as const;

/**
 * InstallPWABanner Component
 *
 * Displays a dismissible banner promoting PWA installation.
 * Follows Google's best practices for install promotion:
 * - Shows after user demonstrates engagement
 * - Dismissible and respects user choice
 * - Displays for 4-7 seconds minimum
 * - Bottom placement (non-intrusive)
 *
 * Display Logic:
 * - Shows after 30 seconds OR 3 pages visited
 * - Does not show if dismissed in last 7 days
 * - Does not show if installed
 * - Does not show if dismissed 3+ times total
 *
 * @example
 * ```tsx
 * // Add to root layout
 * <InstallPWABanner />
 * ```
 */
export default function InstallPWABanner() {
  const {
    canInstall,
    isInstalled,
    isDismissed,
    promptInstall,
    dismissPrompt,
    platform,
  } = useInstallPrompt();

  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasEngagement, setHasEngagement] = useState(false);

  // Track time on site
  useEffect(() => {
    if (isInstalled || isDismissed || platform !== 'chrome') return;

    const timer = setTimeout(() => {
      setHasEngagement(true);
    }, ENGAGEMENT_THRESHOLDS.TIME_ON_SITE);

    return () => clearTimeout(timer);
  }, [isInstalled, isDismissed, platform]);

  // Track page visits
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isInstalled || isDismissed || platform !== 'chrome') return;

    try {
      // Increment page count
      const currentCount = parseInt(localStorage.getItem(PAGE_COUNT_KEY) || '0', 10);
      const newCount = currentCount + 1;
      localStorage.setItem(PAGE_COUNT_KEY, String(newCount));

      // Check if threshold reached
      if (newCount >= ENGAGEMENT_THRESHOLDS.PAGES_VISITED) {
        setHasEngagement(true);
      }
    } catch (error) {
      console.error('[PWA Banner] Failed to track page count:', error);
    }
  }, [isInstalled, isDismissed, platform]);

  // Show banner when engagement threshold is met
  useEffect(() => {
    if (!hasEngagement || !canInstall || isInstalled || isDismissed) {
      return;
    }

    // Small delay before showing (feels more natural)
    const timer = setTimeout(() => {
      setIsAnimating(true);
      setIsVisible(true);

      // Track that banner was shown
      try {
        const shown = parseInt(localStorage.getItem(BANNER_SHOWN_KEY) || '0', 10);
        localStorage.setItem(BANNER_SHOWN_KEY, String(shown + 1));
        localStorage.setItem(BANNER_LAST_SHOWN_KEY, String(Date.now()));
      } catch (error) {
        console.error('[PWA Banner] Failed to track banner display:', error);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [hasEngagement, canInstall, isInstalled, isDismissed]);

  const handleInstall = async () => {
    await promptInstall();

    // Hide banner after install attempt
    setIsAnimating(false);
    setTimeout(() => setIsVisible(false), 300);
  };

  const handleDismiss = () => {
    dismissPrompt();
    setIsAnimating(false);
    setTimeout(() => setIsVisible(false), 300);
  };

  // Don't render if not visible
  if (!isVisible) {
    return null;
  }

  return (
    <>
      {/* Backdrop (subtle) */}
      <div
        className={`
          fixed inset-0 bg-black/10 backdrop-blur-sm z-40
          transition-opacity duration-300
          ${isAnimating ? 'opacity-100' : 'opacity-0'}
        `}
        onClick={handleDismiss}
        aria-hidden="true"
      />

      {/* Banner */}
      <div
        className={`
          fixed bottom-16 md:bottom-4 left-4 right-4
          max-w-lg mx-auto z-50
          transition-all duration-300 ease-out
          ${isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
        `}
        role="dialog"
        aria-labelledby="install-banner-title"
        aria-describedby="install-banner-description"
      >
        <div
          className="
            bg-white rounded-2xl shadow-2xl border border-gray-200
            p-4 flex items-center gap-4
            hover:shadow-3xl transition-shadow
          "
        >
          {/* App Icon */}
          <div
            className="flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden shadow-md"
            style={{ backgroundColor: COLORS.PRIMARY.BLUE_LIGHT }}
          >
            <Image
              src="/icons/icon-192x192.png"
              alt="Job Agent PH"
              width={56}
              height={56}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3
              id="install-banner-title"
              className="font-semibold text-gray-900 text-sm md:text-base truncate"
            >
              Install Job Agent PH
            </h3>
            <p
              id="install-banner-description"
              className="text-xs md:text-sm text-gray-600 mt-0.5"
            >
              Faster access & works offline
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Install Button */}
            <button
              onClick={handleInstall}
              className="
                inline-flex items-center gap-1.5
                px-4 py-2 rounded-lg
                text-white font-medium text-sm
                transition-all duration-200
                hover:scale-105 active:scale-95
                shadow-md hover:shadow-lg
                focus:outline-none focus:ring-2 focus:ring-offset-2
              "
              style={{
                backgroundColor: COLORS.PRIMARY.BLUE,
                focusRingColor: COLORS.PRIMARY.BLUE,
              }}
              aria-label="Install app"
            >
              <Download size={16} aria-hidden="true" />
              <span className="hidden sm:inline">Install</span>
            </button>

            {/* Close Button */}
            <button
              onClick={handleDismiss}
              className="
                p-2 rounded-lg
                text-gray-400 hover:text-gray-600 hover:bg-gray-100
                transition-colors
                focus:outline-none focus:ring-2 focus:ring-gray-300
              "
              aria-label="Dismiss"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Mobile indicator (shows it's above bottom nav) */}
        <div className="md:hidden h-2" aria-hidden="true" />
      </div>
    </>
  );
}
