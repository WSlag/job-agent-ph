'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Chrome, ExternalLink, Copy, CheckCircle, Smartphone, Zap, Shield, Download } from 'lucide-react';
import Image from 'next/image';
import { useInstallFlow } from '@/contexts/InstallFlowContext';
import { copyToClipboard, getCurrentUrlWithInstallParams, getOpenInBrowserUrl } from '@/lib/browser-detection';
import { COLORS } from '@/lib/colors';

/**
 * WelcomeModal Component
 *
 * Full-screen modal shown to users in Facebook/Instagram/TikTok in-app browsers.
 * Guides them to open the app in Chrome (Android) or Safari (iOS) for better experience.
 */
export default function WelcomeModal() {
  const {
    showWelcomeModal,
    browserName,
    platform,
    isPWAInstalled,
    isAuthenticated,
    dismissWelcome,
    openInExternalBrowser,
    continueAnyway,
  } = useInstallFlow();

  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!showWelcomeModal) return null;

  const browserDisplayName = browserName === 'facebook'
    ? 'Facebook'
    : browserName === 'instagram'
    ? 'Instagram'
    : browserName === 'tiktok'
    ? 'TikTok'
    : 'this app';

  const recommendedBrowser = platform === 'ios' ? 'Safari' : 'Google';

  const handleCopyUrl = async () => {
    // Use URL with install params to trigger PWA install prompt in external browser
    const url = getCurrentUrlWithInstallParams();
    const success = await copyToClipboard(url);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpenInBrowser = () => {
    if (platform === 'android') {
      // Try Chrome intent for Android
      const intentUrl = getOpenInBrowserUrl(window.location.pathname);
      window.location.href = intentUrl;
    } else {
      // For iOS, show instructions
      setShowIOSInstructions(true);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={dismissWelcome}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={dismissWelcome}
            className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors z-10"
            aria-label="Close"
          >
            <X size={24} />
          </button>

          {/* Header with gradient */}
          <div
            className="px-6 py-8 text-center"
            style={{
              background: `linear-gradient(135deg, ${COLORS.PRIMARY.BLUE} 0%, ${COLORS.ACCENT.PURPLE} 100%)`,
            }}
          >
            {/* App Icon */}
            <div className="mx-auto mb-4 w-20 h-20 rounded-2xl overflow-hidden shadow-lg bg-white p-1">
              <Image
                src="/icons/icon-192x192.png"
                alt="Job Agent PH"
                width={72}
                height={72}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">
              {isAuthenticated ? 'Better Experience' : 'Welcome to Job Agent PH'}
            </h2>
            <p className="text-white/90 text-sm">
              {isAuthenticated
                ? `Open in ${recommendedBrowser} for the best experience`
                : `For the best experience, open in ${recommendedBrowser}`}
            </p>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {!showIOSInstructions ? (
              <>
                {/* Why message */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                  <p className="text-amber-800 text-sm">
                    {isAuthenticated
                      ? `You're viewing this in ${browserDisplayName}'s browser. For better performance and to install the app, open in ${recommendedBrowser}.`
                      : `You're viewing this in ${browserDisplayName}'s browser. Some features like signing in and installing the app work better in ${recommendedBrowser}.`}
                  </p>
                </div>

                {/* Benefits */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: COLORS.PRIMARY.BLUE + '15' }}
                    >
                      <Zap size={20} style={{ color: COLORS.PRIMARY.BLUE }} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Faster Performance</p>
                      <p className="text-sm text-gray-500">Smoother scrolling and navigation</p>
                    </div>
                  </div>

                  {!isAuthenticated && (
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: COLORS.STATUS.SUCCESS + '15' }}
                      >
                        <Shield size={20} style={{ color: COLORS.STATUS.SUCCESS }} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Secure Sign-in</p>
                        <p className="text-sm text-gray-500">Phone and Google authentication</p>
                      </div>
                    </div>
                  )}

                  {!isPWAInstalled && (
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: COLORS.ACCENT.PURPLE + '15' }}
                      >
                        <Download size={20} style={{ color: COLORS.ACCENT.PURPLE }} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Install as App</p>
                        <p className="text-sm text-gray-500">Add to home screen for quick access</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: COLORS.ACCENT.PURPLE + '15' }}
                    >
                      <Smartphone size={20} style={{ color: COLORS.ACCENT.PURPLE }} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Full App Experience</p>
                      <p className="text-sm text-gray-500">Works offline with saved content</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <button
                    onClick={handleOpenInBrowser}
                    className="w-full py-3.5 px-4 rounded-xl font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                    style={{ backgroundColor: COLORS.PRIMARY.BLUE }}
                  >
                    {platform === 'android' ? (
                      <>
                        <Chrome size={20} />
                        Open in Google
                      </>
                    ) : (
                      <>
                        <ExternalLink size={20} />
                        How to Open in Safari
                      </>
                    )}
                  </button>

                  <button
                    onClick={continueAnyway}
                    className="w-full py-3 px-4 rounded-xl font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    Continue Browsing Here
                  </button>
                </div>
              </>
            ) : (
              /* iOS Instructions */
              <>
                <button
                  onClick={() => setShowIOSInstructions(false)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-4 flex items-center gap-1"
                >
                  <span>&larr;</span> Back
                </button>

                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Open in Safari
                </h3>

                <div className="space-y-4 mb-6">
                  {/* Step 1: Copy */}
                  <div className="flex items-start gap-4">
                    <div
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm"
                      style={{ backgroundColor: COLORS.PRIMARY.BLUE }}
                    >
                      1
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-2">Copy the link</p>
                      <button
                        onClick={handleCopyUrl}
                        className={`w-full py-2.5 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                          copied
                            ? 'bg-green-100 text-green-700 border border-green-300'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                        }`}
                      >
                        {copied ? (
                          <>
                            <CheckCircle size={18} />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy size={18} />
                            Tap to Copy Link
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Step 2: Open Safari */}
                  <div className="flex items-start gap-4">
                    <div
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm"
                      style={{ backgroundColor: COLORS.PRIMARY.BLUE }}
                    >
                      2
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Open Safari</p>
                      <p className="text-sm text-gray-500">
                        Find Safari in your apps and open it
                      </p>
                    </div>
                  </div>

                  {/* Step 3: Paste */}
                  <div className="flex items-start gap-4">
                    <div
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm"
                      style={{ backgroundColor: COLORS.PRIMARY.BLUE }}
                    >
                      3
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Paste and Go</p>
                      <p className="text-sm text-gray-500">
                        Tap the address bar and paste the link
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={continueAnyway}
                  className="w-full py-3 px-4 rounded-xl font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Continue Here Instead
                </button>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
