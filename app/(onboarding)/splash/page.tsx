'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';

/**
 * Splash Screen Component
 *
 * First screen users see when opening the app.
 * Shows logo, app name, and tagline with animations.
 * Auto-advances to home page after 1.5 seconds.
 *
 * Flow:
 * - First-time visitor → Home page (guest mode)
 * - Returning visitor → Home page (check auth silently)
 * - Never forces welcome carousel or login
 */
export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    // Set flag that user has seen splash
    localStorage.setItem('hasSeenSplash', 'true');

    // Auto-advance to home after 1.5 seconds
    const timer = setTimeout(() => {
      router.push('/');
    }, 1500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 flex items-center justify-center overflow-hidden">
      {/* Background blur circles */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-accent-500 rounded-full blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-400 rounded-full blur-3xl opacity-20 translate-x-1/2 translate-y-1/2" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6">
        {/* Logo animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20,
            duration: 0.6,
          }}
          className="mb-6"
        >
          <div className="w-24 h-24 bg-white rounded-3xl shadow-2xl flex items-center justify-center">
            <Briefcase size={48} className="text-primary-600" />
          </div>
        </motion.div>

        {/* App name animation */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-4xl font-bold text-white mb-2 text-center"
        >
          Job Agent PH
        </motion.h1>

        {/* Tagline animation */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-lg text-white/90 text-center mb-8"
        >
          Your trusted OFW job partner
        </motion.p>

        {/* Loading spinner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.3 }}
          className="flex items-center gap-2"
        >
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </motion.div>

        {/* Version number */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.3 }}
          className="absolute bottom-8 text-white/60 text-sm"
        >
          Version 1.0.0
        </motion.p>
      </div>
    </div>
  );
}
