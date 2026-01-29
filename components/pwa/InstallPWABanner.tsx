'use client';

import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
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
 * Displays a compact, non-intrusive banner promoting PWA installation.
 * - Shows after user demonstrates engagement (30s or 3 pages)
 * - Bottom placement above mobile nav
 * - Stays visible until user installs
 * - Does not show if already installed
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
    platform,
    isFromSocialApp,
  } = useInstallPrompt();

  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasEngagement, setHasEngagement] = useState(false);

  // For users from social apps, skip the wait time entirely
  useEffect(() => {
    if (isFromSocialApp && !isInstalled && !isDismissed && platform === 'chrome') {
      console.log('[PWA Banner] User from social app, showing immediately');
      setHasEngagement(true);
    }
  }, [isFromSocialApp, isInstalled, isDismissed, platform]);

  // Track time on site (skip if from social app - already engaged)
  useEffect(() => {
    if (isInstalled || isDismissed || platform !== 'chrome') return;
    if (isFromSocialApp) return; // Skip wait for social app users

    const timer = setTimeout(() => {
      setHasEngagement(true);
    }, ENGAGEMENT_THRESHOLDS.TIME_ON_SITE);

    return () => clearTimeout(timer);
  }, [isInstalled, isDismissed, platform, isFromSocialApp]);

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

  // Don't render if not visible
  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`
        fixed bottom-16 md:bottom-4 left-4 right-4
        max-w-md mx-auto z-50
        transition-all duration-300 ease-out
        ${isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
      `}
      role="dialog"
      aria-labelledby="install-banner-title"
      aria-describedby="install-banner-description"
    >
      <div
        className="
          bg-white rounded-xl shadow-lg border border-gray-200
          p-2.5 flex items-center gap-3
        "
      >
        {/* App Icon */}
        <div
          className="flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden shadow-sm"
          style={{ backgroundColor: COLORS.PRIMARY.BLUE_LIGHT }}
        >
          <Image
            src="/icons/icon-192x192.png"
            alt="Job Agent PH"
            width={40}
            height={40}
            sizes="40px"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3
            id="install-banner-title"
            className="font-semibold text-gray-900 text-xs truncate"
          >
            {isFromSocialApp ? 'Add to Home Screen' : 'Install Job Agent PH'}
          </h3>
          <p
            id="install-banner-description"
            className="text-[11px] text-gray-500"
          >
            {isFromSocialApp
              ? 'Quick access to jobs anytime!'
              : 'Faster access & works offline'}
          </p>
        </div>

        {/* Install Button */}
        <button
          onClick={handleInstall}
          className="
            flex-shrink-0
            inline-flex items-center gap-1
            px-3 py-1.5 rounded-lg
            text-white font-medium text-xs
            transition-all duration-200
            hover:scale-105 active:scale-95
            shadow-sm hover:shadow-md
            focus:outline-none focus:ring-2 focus:ring-offset-1
          "
          style={{
            backgroundColor: COLORS.PRIMARY.BLUE,
          }}
          aria-label={isFromSocialApp ? "Add to home screen" : "Install app"}
        >
          <Download size={14} aria-hidden="true" />
          <span>{isFromSocialApp ? 'Add' : 'Install'}</span>
        </button>
      </div>
    </div>
  );
}
