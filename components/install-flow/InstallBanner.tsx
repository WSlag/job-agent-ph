'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
import { useInstallFlow } from '@/contexts/InstallFlowContext';
import { COLORS } from '@/lib/colors';

/**
 * InstallBanner Component
 *
 * Subtle banner at the bottom of the screen reminding users
 * they can open in Chrome/Safari for a better experience.
 * Shows after the WelcomeModal is dismissed.
 */
export default function InstallBanner() {
  const {
    showBanner,
    platform,
    dismissBanner,
    openInExternalBrowser,
    continueAnyway,
  } = useInstallFlow();

  if (!showBanner) return null;

  const recommendedBrowser = platform === 'ios' ? 'Safari' : 'Chrome';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-16 md:bottom-4 left-4 right-4 z-50 max-w-lg mx-auto"
      >
        <div
          className="rounded-2xl shadow-lg overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${COLORS.PRIMARY.BLUE} 0%, ${COLORS.ACCENT.PURPLE} 100%)`,
          }}
        >
          <div className="px-4 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <ExternalLink size={16} className="text-white" />
              </div>
              <p className="text-white text-sm font-medium truncate">
                Open in {recommendedBrowser} for best experience
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={openInExternalBrowser}
                className="px-3 py-1.5 rounded-lg bg-white text-sm font-semibold transition-colors hover:bg-gray-100"
                style={{ color: COLORS.PRIMARY.BLUE }}
              >
                Open
              </button>

              <button
                onClick={dismissBanner}
                className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Dismiss"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
