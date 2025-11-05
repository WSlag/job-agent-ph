'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GuestBannerProps {
  onSignup?: () => void;
}

/**
 * GuestBanner Component
 *
 * Subtle banner encouraging guest users to sign up
 * Dismissible and saved to localStorage
 * Shows benefits of creating an account
 */
export default function GuestBanner({ onSignup }: GuestBannerProps) {
  const [isDismissed, setIsDismissed] = useState(
    typeof window !== 'undefined'
      ? localStorage.getItem('guestBannerDismissed') === 'true'
      : false
  );

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('guestBannerDismissed', 'true');
  };

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-2xl p-4 md:p-6 relative overflow-hidden mb-8"
      >
        {/* Decorative background */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl"></div>

        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors z-10"
          aria-label="Dismiss"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="flex-shrink-0 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Sparkles size={24} />
            </div>

            {/* Text */}
            <div className="flex-1 pt-1">
              <h3 className="text-lg md:text-xl font-bold mb-2">
                Get the Full Experience
              </h3>
              <p className="text-sm md:text-base text-white/90 mb-4">
                Create a free account to unlock personalized job matches, save your favorite jobs,
                and connect directly with agencies.
              </p>

              {/* Benefits */}
              <ul className="space-y-2 mb-6 text-sm text-white/90">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  <span>AI-powered job recommendations with match scores</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  <span>Save jobs and track your applications</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  <span>Direct messaging with recruitment agencies</span>
                </li>
              </ul>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3">
                {onSignup ? (
                  <button
                    onClick={onSignup}
                    className="bg-white text-primary-600 px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-md inline-flex items-center justify-center gap-2"
                  >
                    Sign Up Free
                    <ArrowRight size={18} />
                  </button>
                ) : (
                  <Link
                    href="/auth/signup"
                    className="bg-white text-primary-600 px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-md inline-flex items-center justify-center gap-2"
                  >
                    Sign Up Free
                    <ArrowRight size={18} />
                  </Link>
                )}
                <Link
                  href="/auth/login"
                  className="border-2 border-white text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-white/10 transition-colors inline-flex items-center justify-center"
                >
                  Log In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
