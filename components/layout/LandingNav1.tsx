'use client';

import Link from 'next/link';
import { Menu, X, ChevronRight, Globe, Users } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { useState } from 'react';

/**
 * LANDING NAV 1: Transparent Overlay Hero Navigation
 * Features:
 * - Transparent background that overlays hero
 * - Becomes solid on scroll
 * - Clean minimal design
 * - Prominent CTAs for both job seekers and employers
 * - Perfect for: Hero-focused landing pages
 */

export default function LandingNav1() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      setIsScrolled(window.scrollY > 20);
    });
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav
        className={`transition-all duration-300 ${
          isScrolled
            ? 'bg-white shadow-md border-b border-gray-200'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <div className={`transition-colors ${isScrolled ? '' : 'drop-shadow-lg'}`}>
                <Logo size="md" showText={true} />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/jobs"
                className={`text-sm font-medium transition-colors ${
                  isScrolled
                    ? 'text-gray-700 hover:text-blue-600'
                    : 'text-white hover:text-blue-200 drop-shadow-md'
                }`}
              >
                Find Jobs
              </Link>
              <Link
                href="/companies"
                className={`text-sm font-medium transition-colors ${
                  isScrolled
                    ? 'text-gray-700 hover:text-blue-600'
                    : 'text-white hover:text-blue-200 drop-shadow-md'
                }`}
              >
                Companies
              </Link>
              <Link
                href="/resources"
                className={`text-sm font-medium transition-colors ${
                  isScrolled
                    ? 'text-gray-700 hover:text-blue-600'
                    : 'text-white hover:text-blue-200 drop-shadow-md'
                }`}
              >
                Resources
              </Link>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3">
              {/* For Job Hunters */}
              <Link
                href="/auth/login?type=jobseeker"
                className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isScrolled
                    ? 'text-blue-600 hover:bg-blue-50 border border-blue-600'
                    : 'text-white bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/40'
                }`}
              >
                <Users className="w-4 h-4" />
                <span className="hidden lg:inline">For Job Hunters</span>
                <span className="lg:hidden">Login</span>
              </Link>

              {/* For Employers */}
              <Link
                href="/auth/login?type=employer"
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg text-sm font-semibold transition-all shadow-lg hover:shadow-xl"
              >
                <Globe className="w-4 h-4" />
                <span>For Employers</span>
                <ChevronRight className="w-4 h-4" />
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`md:hidden p-2 rounded-lg transition-colors ${
                  isScrolled
                    ? 'hover:bg-gray-100 text-gray-700'
                    : 'hover:bg-white/20 text-white'
                }`}
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-white z-[60] animate-fadeIn">
          <div className="max-w-7xl mx-auto px-4 py-6 space-y-3">
            <Link
              href="/jobs"
              className="block px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Find Jobs Abroad
            </Link>
            <Link
              href="/companies"
              className="block px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Browse Companies
            </Link>
            <Link
              href="/resources"
              className="block px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Resources & Guides
            </Link>

            <div className="pt-4 space-y-3 border-t border-gray-200">
              <Link
                href="/auth/login?type=jobseeker"
                className="flex items-center justify-center gap-2 px-4 py-3 text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Users className="w-5 h-5" />
                I'm Looking for Jobs
              </Link>
              <Link
                href="/auth/login?type=employer"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold shadow-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                <Globe className="w-5 h-5" />
                I'm Hiring Talent
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
