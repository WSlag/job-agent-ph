'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';
import { COLORS } from '@/lib/colors';
import IOSInstallModal from './iOSInstallModal';

/**
 * FloatingInstallButton Component
 *
 * A floating action button (FAB) that stays visible at the bottom-right
 * of the screen until the user installs the PWA.
 *
 * Features:
 * - No dismiss option - always visible until installed
 * - Platform-aware behavior:
 *   - Chrome/Android: Triggers native beforeinstallprompt
 *   - iOS: Opens the iOS install instruction modal
 * - Positioned above BottomNav on mobile
 * - Pulse animation to draw attention
 * - Accessible (ARIA labels)
 *
 * @example
 * ```tsx
 * // Add to root layout
 * <FloatingInstallButton />
 * ```
 */
export default function FloatingInstallButton() {
  const {
    canInstall,
    isInstalled,
    promptInstall,
    platform,
    isInstalling,
  } = useInstallPrompt();

  const [showIOSModal, setShowIOSModal] = useState(false);

  // Don't render if already installed
  if (isInstalled) {
    return null;
  }

  // Don't render on unsupported platforms
  if (platform === 'unsupported') {
    return null;
  }

  // For Chrome: only show if canInstall (beforeinstallprompt fired)
  // For iOS: always show (they need manual install instructions)
  if (platform === 'chrome' && !canInstall) {
    return null;
  }

  const handleClick = async () => {
    if (platform === 'ios') {
      // Open iOS instruction modal
      setShowIOSModal(true);
    } else if (platform === 'chrome') {
      // Trigger native install prompt
      await promptInstall();
    }
  };

  return (
    <>
      {/* Floating Install Button */}
      <button
        onClick={handleClick}
        disabled={isInstalling}
        className="
          fixed z-50
          bottom-20 right-4
          md:bottom-6 md:right-6
          w-14 h-14
          rounded-full
          flex items-center justify-center
          text-white
          shadow-lg
          transition-all duration-200
          hover:scale-110 hover:shadow-xl
          active:scale-95
          focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50
        "
        style={{
          backgroundColor: COLORS.PRIMARY.BLUE,
          animation: 'pulse-subtle 2s ease-in-out infinite',
        }}
        aria-label="Install App"
        title="Install App"
      >
        <Download
          size={24}
          className={isInstalling ? 'animate-bounce' : ''}
          aria-hidden="true"
        />
      </button>

      {/* iOS Install Modal (controlled) */}
      {platform === 'ios' && (
        <IOSInstallModal
          isOpen={showIOSModal}
          onClose={() => setShowIOSModal(false)}
        />
      )}
    </>
  );
}
