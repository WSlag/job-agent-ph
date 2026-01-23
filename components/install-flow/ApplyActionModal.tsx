'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Chrome, ExternalLink, Copy, CheckCircle, AlertTriangle } from 'lucide-react';
import { useInstallFlow } from '@/contexts/InstallFlowContext';
import { copyToClipboard, getCurrentUrlWithInstallParams, getOpenInBrowserUrl } from '@/lib/browser-detection';
import { COLORS } from '@/lib/colors';

/**
 * ApplyActionModal Component
 *
 * Bottom sheet modal shown when users try to Apply or Message in an in-app browser.
 * Gives them the option to open in external browser or continue anyway.
 */
export default function ApplyActionModal() {
  const {
    showApplyModal,
    pendingAction,
    pendingActionData,
    platform,
    cancelAction,
    continueAnyway,
  } = useInstallFlow();

  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!showApplyModal) return null;

  // Determine action text based on pending action type
  const actionText = pendingAction === 'apply'
    ? 'Apply'
    : pendingAction === 'message'
    ? 'Message'
    : pendingAction === 'signup'
    ? 'Sign Up'
    : 'Sign In';

  const isAuthAction = pendingAction === 'signup' || pendingAction === 'signin';
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

  const handleContinueAnyway = () => {
    continueAnyway();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-end justify-center"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={cancelAction}
        />

        {/* Bottom Sheet */}
        <motion.div
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-white rounded-t-3xl shadow-2xl overflow-hidden safe-area-bottom"
        >
          {/* Handle Bar */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
          </div>

          {/* Close Button */}
          <button
            onClick={cancelAction}
            className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>

          {/* Content */}
          <div className="px-6 pb-8 pt-2">
            {!showIOSInstructions ? (
              <>
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: COLORS.STATUS.WARNING + '20' }}
                  >
                    <AlertTriangle size={24} style={{ color: COLORS.STATUS.WARNING }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {isAuthAction
                        ? `${actionText} for Job Agent PH`
                        : `${actionText} to ${pendingActionData?.jobTitle || 'this job'}`}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Better experience in {recommendedBrowser}
                    </p>
                  </div>
                </div>

                {/* Warning Message */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
                  <p className="text-amber-800 text-sm">
                    {isAuthAction
                      ? `Phone and Google sign-in work better in ${recommendedBrowser}. Open the app there to create your account and save it to your home screen.`
                      : `Sign-in may not work properly in this browser. For a reliable ${actionText.toLowerCase()} process, we recommend opening in ${recommendedBrowser}.`}
                  </p>
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
                    onClick={handleContinueAnyway}
                    className="w-full py-3 px-4 rounded-xl font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    Continue Here Anyway
                  </button>

                  <button
                    onClick={cancelAction}
                    className="w-full py-2 text-gray-500 hover:text-gray-700 text-sm transition-colors"
                  >
                    Cancel
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
                  onClick={handleContinueAnyway}
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
