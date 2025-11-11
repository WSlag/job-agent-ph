'use client';

import Link from 'next/link';
import { Menu, X, Sparkles, Rocket, Phone, Mail } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { useState } from 'react';

/**
 * LANDING NAV 2: Split CTA Navigation with Top Banner
 * Features:
 * - Promotional banner at the top
 * - Dual prominent CTAs (Job Seekers vs Employers)
 * - Social proof badges
 * - Contact info visible
 * - Perfect for: Conversion-focused landing pages
 */

export default function LandingNav2() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top Promotional Banner */}
      {showBanner && (
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-10 text-sm">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">
                  <strong>300,000+</strong> Jobs Available Now! Start Your Career Abroad 🚀
                </span>
                <span className="sm:hidden">
                  <strong>300k+</strong> Jobs Now!
                </span>
              </div>
              <button
                onClick={() => setShowBanner(false)}
                className="hover:bg-white/20 p-1 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="bg-white border-b border-gray-200 shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo with Badge */}
            <Link href="/" className="flex items-center gap-3">
              <Logo size="sm" showText={true} />
              <div className="hidden md:flex items-center gap-2">
                <div className="h-4 w-px bg-gray-300"></div>
                <span className="text-xs text-gray-600 font-medium">
                  Made for Filipinos 🇵🇭
                </span>
              </div>
            </Link>

            {/* Desktop Contact Info */}
            <div className="hidden lg:flex items-center gap-6 text-sm text-gray-600">
              <a
                href="tel:+1234567890"
                className="flex items-center gap-2 hover:text-blue-600 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>+63 XXX XXXX</span>
              </a>
              <a
                href="mailto:support@jobagentph.com"
                className="flex items-center gap-2 hover:text-blue-600 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span className="hidden xl:inline">support@jobagentph.com</span>
                <span className="xl:hidden">Email Us</span>
              </a>
            </div>

            {/* CTA Buttons - Desktop */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/auth/login?type=jobseeker"
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg"
              >
                <Rocket className="w-4 h-4" />
                Find My Dream Job
              </Link>
              <Link
                href="/auth/login?type=employer"
                className="flex items-center gap-2 px-5 py-2.5 border-2 border-purple-600 text-purple-600 hover:bg-purple-50 rounded-lg text-sm font-semibold transition-all"
              >
                <Sparkles className="w-4 h-4" />
                Hire Top Talent
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Secondary Navigation Bar */}
        <div className="border-t border-gray-100 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-center gap-6 py-2 text-sm">
              <Link
                href="/jobs"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Browse Jobs
              </Link>
              <div className="h-4 w-px bg-gray-300"></div>
              <Link
                href="/companies"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Top Companies
              </Link>
              <div className="h-4 w-px bg-gray-300 hidden sm:block"></div>
              <Link
                href="/resources"
                className="hidden sm:inline text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Career Resources
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[105px] bg-white z-[60] animate-fadeIn">
          <div className="h-full overflow-y-auto">
            <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
              {/* Contact Info */}
              <div className="space-y-2 pb-4 border-b border-gray-200">
                <a
                  href="tel:+1234567890"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Phone className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">+63 XXX XXXX</span>
                </a>
                <a
                  href="mailto:support@jobagentph.com"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">support@jobagentph.com</span>
                </a>
              </div>

              {/* CTA Buttons */}
              <Link
                href="/auth/login?type=jobseeker"
                className="flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <Rocket className="w-5 h-5" />
                Find My Dream Job
              </Link>
              <Link
                href="/auth/login?type=employer"
                className="flex items-center justify-center gap-2 px-6 py-4 border-2 border-purple-600 text-purple-600 rounded-xl font-bold text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <Sparkles className="w-5 h-5" />
                Hire Top Talent
              </Link>

              {/* Quick Links */}
              <div className="pt-4 space-y-2">
                <Link
                  href="/jobs"
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Browse All Jobs
                </Link>
                <Link
                  href="/companies"
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Top Companies
                </Link>
                <Link
                  href="/resources"
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Career Resources
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
