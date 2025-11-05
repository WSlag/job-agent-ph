'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, AlertCircle } from 'lucide-react';
import { ProgressBar } from '@/components/ui';
import { motion, AnimatePresence } from 'framer-motion';

interface ProfileCompletionBannerProps {
  percentage: number;
  onDismiss?: () => void;
}

/**
 * ProfileCompletionBanner Component
 *
 * Displays profile completion progress with CTA to complete
 * Only shown to authenticated users with incomplete profiles
 * Dismissible (saved to localStorage)
 */
export default function ProfileCompletionBanner({
  percentage,
  onDismiss,
}: ProfileCompletionBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('profileCompletionBannerDismissed', 'true');
    onDismiss?.();
  };

  // Don't show if completed or dismissed
  if (percentage >= 100 || isDismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-r from-warning-50 to-warning-100 border border-warning-200 rounded-2xl p-4 md:p-6 relative overflow-hidden"
      >
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-warning-200/30 rounded-full blur-2xl"></div>

        <div className="relative z-10">
          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-0 right-0 p-2 text-warning-600 hover:text-warning-700 hover:bg-warning-200/50 rounded-lg transition-colors"
            aria-label="Dismiss"
          >
            <X size={20} />
          </button>

          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="flex-shrink-0 w-12 h-12 bg-warning-500 rounded-full flex items-center justify-center text-white">
              <AlertCircle size={24} />
            </div>

            {/* Content */}
            <div className="flex-1 pt-1">
              <h3 className="text-lg font-bold text-warning-900 mb-1">
                Complete Your Profile
              </h3>
              <p className="text-sm text-warning-700 mb-4">
                A complete profile gets 3x more interview invitations. Stand out to top agencies!
              </p>

              {/* Progress bar */}
              <div className="mb-4">
                <ProgressBar
                  value={percentage}
                  variant="warning"
                  size="md"
                  showPercentage
                  label={`${percentage}% Complete`}
                />
              </div>

              {/* CTA */}
              <div className="flex items-center gap-3">
                <Link
                  href="/profile/setup"
                  className="bg-warning-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-warning-700 transition-colors shadow-md hover:shadow-lg"
                >
                  Complete Now
                </Link>
                <button
                  onClick={handleDismiss}
                  className="text-sm text-warning-700 hover:text-warning-800 font-medium"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
