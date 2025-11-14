'use client';

import { useState, useEffect } from 'react';
import { X, Share, Plus, Smartphone } from 'lucide-react';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';
import { COLORS } from '@/lib/colors';
import Image from 'next/image';

interface iOSInstallModalProps {
  /**
   * Whether to show the modal
   */
  isOpen?: boolean;

  /**
   * Callback when modal is closed
   */
  onClose?: () => void;
}

/**
 * iOSInstallModal Component
 *
 * Provides step-by-step instructions for installing the PWA on iOS devices.
 * iOS Safari doesn't support the beforeinstallprompt event, so we need
 * to guide users through the manual installation process.
 *
 * Installation Steps:
 * 1. Tap the Share button (↗)
 * 2. Scroll and tap "Add to Home Screen"
 * 3. Tap "Add" to confirm
 *
 * Features:
 * - Auto-detects iOS platform
 * - Clear visual instructions
 * - Dismissible
 * - Respects user choice (doesn't show again if dismissed)
 *
 * @example
 * ```tsx
 * const [showModal, setShowModal] = useState(false);
 *
 * return (
 *   <>
 *     <button onClick={() => setShowModal(true)}>
 *       Install on iOS
 *     </button>
 *     <iOSInstallModal
 *       isOpen={showModal}
 *       onClose={() => setShowModal(false)}
 *     />
 *   </>
 * );
 * ```
 */
export default function IOSInstallModal({
  isOpen: controlledIsOpen,
  onClose,
}: iOSInstallModalProps = {}) {
  const { platform, isInstalled } = useInstallPrompt();
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Use controlled or internal state
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = controlledIsOpen !== undefined
    ? (value: boolean) => {
        if (!value) onClose?.();
      }
    : setInternalIsOpen;

  // Check if user already dismissed the modal
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const dismissed = localStorage.getItem('ios-install-modal-dismissed');
      setIsDismissed(dismissed === 'true');
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Auto-show modal for iOS users (if not controlled)
  useEffect(() => {
    if (controlledIsOpen !== undefined) return; // Skip if controlled
    if (platform !== 'ios') return;
    if (isInstalled) return;
    if (isDismissed) return;

    // Show modal after a delay (30 seconds or 3 page views)
    const timer = setTimeout(() => {
      setInternalIsOpen(true);
    }, 30000);

    return () => clearTimeout(timer);
  }, [platform, isInstalled, isDismissed, controlledIsOpen]);

  const handleClose = () => {
    try {
      localStorage.setItem('ios-install-modal-dismissed', 'true');
    } catch {
      // Ignore localStorage errors
    }

    setIsDismissed(true);
    setIsOpen(false);
  };

  // Don't render if not iOS or already installed
  if (platform !== 'ios' || isInstalled) {
    return null;
  }

  // Don't render if not open
  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="
          fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-[90%] max-w-md z-50
          animate-in zoom-in-95 duration-200
        "
        role="dialog"
        aria-labelledby="ios-install-title"
        aria-describedby="ios-install-description"
        aria-modal="true"
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div
            className="px-6 py-4 border-b border-gray-200"
            style={{ backgroundColor: COLORS.PRIMARY.BLUE_LIGHT + '20' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* App Icon */}
                <div className="w-12 h-12 rounded-xl overflow-hidden shadow-md">
                  <Image
                    src="/icons/icon-192x192.png"
                    alt="Job Agent PH"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <h2
                    id="ios-install-title"
                    className="font-bold text-gray-900 text-lg"
                  >
                    Install Job Agent PH
                  </h2>
                  <p className="text-sm text-gray-600">
                    Add to your home screen
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={handleClose}
                className="
                  p-2 rounded-lg text-gray-400 hover:text-gray-600
                  hover:bg-gray-100 transition-colors
                  focus:outline-none focus:ring-2 focus:ring-gray-300
                "
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            <p
              id="ios-install-description"
              className="text-gray-700 mb-6 text-center"
            >
              Install our app for quick access and offline browsing
            </p>

            {/* Installation Steps */}
            <div className="space-y-5">
              {/* Step 1 */}
              <div className="flex items-start gap-4">
                <div
                  className="
                    flex-shrink-0 w-10 h-10 rounded-full
                    flex items-center justify-center
                    font-bold text-white text-sm
                  "
                  style={{ backgroundColor: COLORS.PRIMARY.BLUE }}
                >
                  1
                </div>
                <div className="flex-1 pt-1">
                  <p className="font-medium text-gray-900 mb-1">
                    Tap the Share button
                  </p>
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <div
                      className="p-1.5 rounded-md bg-blue-50"
                      style={{ borderColor: COLORS.PRIMARY.BLUE_LIGHT, borderWidth: 1 }}
                    >
                      <Share size={18} style={{ color: COLORS.PRIMARY.BLUE }} />
                    </div>
                    <span>Located at the bottom of the screen</span>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-4">
                <div
                  className="
                    flex-shrink-0 w-10 h-10 rounded-full
                    flex items-center justify-center
                    font-bold text-white text-sm
                  "
                  style={{ backgroundColor: COLORS.PRIMARY.BLUE }}
                >
                  2
                </div>
                <div className="flex-1 pt-1">
                  <p className="font-medium text-gray-900 mb-1">
                    Select "Add to Home Screen"
                  </p>
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <div className="p-1.5 rounded-md bg-blue-50">
                      <Plus size={18} style={{ color: COLORS.PRIMARY.BLUE }} />
                    </div>
                    <span>Scroll down if you don't see it</span>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-4">
                <div
                  className="
                    flex-shrink-0 w-10 h-10 rounded-full
                    flex items-center justify-center
                    font-bold text-white text-sm
                  "
                  style={{ backgroundColor: COLORS.PRIMARY.BLUE }}
                >
                  3
                </div>
                <div className="flex-1 pt-1">
                  <p className="font-medium text-gray-900 mb-1">
                    Tap "Add" to confirm
                  </p>
                  <p className="text-gray-600 text-sm">
                    The app will appear on your home screen
                  </p>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <p className="font-medium text-gray-900 text-sm mb-2">
                Why install?
              </p>
              <ul className="space-y-1.5 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: COLORS.PRIMARY.BLUE }}
                  />
                  One-tap access from your home screen
                </li>
                <li className="flex items-center gap-2">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: COLORS.PRIMARY.BLUE }}
                  />
                  Works offline for previously viewed jobs
                </li>
                <li className="flex items-center gap-2">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: COLORS.PRIMARY.BLUE }}
                  />
                  Faster loading with cached content
                </li>
                <li className="flex items-center gap-2">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: COLORS.PRIMARY.BLUE }}
                  />
                  Full-screen experience
                </li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <button
              onClick={handleClose}
              className="
                w-full py-2.5 px-4 rounded-lg
                font-medium text-white
                transition-all duration-200
                hover:scale-105 active:scale-95
                focus:outline-none focus:ring-2 focus:ring-offset-2
              "
              style={{
                backgroundColor: COLORS.PRIMARY.BLUE,
                focusRingColor: COLORS.PRIMARY.BLUE,
              }}
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
