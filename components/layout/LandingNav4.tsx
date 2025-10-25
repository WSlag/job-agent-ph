'use client';

import Link from 'next/link';
import { Menu, X, Zap, TrendingUp, Award, Target, ChevronDown } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { useState } from 'react';

/**
 * LANDING NAV 4: Premium Dashboard-Style Navigation
 * Features:
 * - Stats dashboard integrated into header
 * - Premium feel with badges and metrics
 * - Mega menu for comprehensive navigation
 * - Trust indicators visible
 * - Perfect for: Data-driven, premium landing pages
 */

export default function LandingNav4() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Stats Bar */}
      <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-9 text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-green-400" />
                <span className="hidden sm:inline">
                  <strong className="text-green-400">2,345</strong> jobs added today
                </span>
                <span className="sm:hidden">
                  <strong className="text-green-400">2.3k</strong> new
                </span>
              </div>
              <div className="hidden md:flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-yellow-400" />
                <span>
                  <strong className="text-yellow-400">89%</strong> success rate
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="hidden sm:inline text-gray-300">
                🇵🇭 Trusted by 100,000+ Filipinos
              </span>
              <Link
                href="/about"
                className="text-blue-300 hover:text-white transition-colors underline"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-white border-b border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo with Premium Badge */}
            <Link href="/" className="flex items-center gap-3">
              <Logo size="md" showText={true} />
              <div className="hidden lg:flex items-center gap-2">
                <div className="px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 text-[10px] font-bold rounded-full">
                  VERIFIED
                </div>
                <div className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full">
                  POEA LICENSED
                </div>
              </div>
            </Link>

            {/* Desktop Navigation with Mega Menu */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/jobs"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                Browse Jobs
              </Link>

              {/* Resources Dropdown */}
              <div className="relative">
                <button
                  onMouseEnter={() => setShowMegaMenu(true)}
                  onMouseLeave={() => setShowMegaMenu(false)}
                  className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Resources
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Mega Menu Dropdown */}
                {showMegaMenu && (
                  <div
                    onMouseEnter={() => setShowMegaMenu(true)}
                    onMouseLeave={() => setShowMegaMenu(false)}
                    className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 p-4 animate-fadeIn"
                  >
                    <div className="space-y-3">
                      <Link
                        href="/resources/guides"
                        className="block p-3 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <p className="font-semibold text-gray-900 text-sm">Career Guides</p>
                        <p className="text-xs text-gray-500">Tips for job hunting abroad</p>
                      </Link>
                      <Link
                        href="/resources/visa"
                        className="block p-3 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <p className="font-semibold text-gray-900 text-sm">Visa Information</p>
                        <p className="text-xs text-gray-500">Work permit requirements</p>
                      </Link>
                      <Link
                        href="/resources/interview"
                        className="block p-3 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <p className="font-semibold text-gray-900 text-sm">Interview Prep</p>
                        <p className="text-xs text-gray-500">Ace your interviews</p>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/companies"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                Companies
              </Link>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3">
              {/* AI Job Match - Desktop */}
              <Link
                href="/jobs?ai=true"
                className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg text-sm font-semibold transition-all shadow-md"
              >
                <Zap className="w-4 h-4" />
                AI Job Match
              </Link>

              {/* For Employers */}
              <Link
                href="/auth/login?type=employer"
                className="hidden sm:flex items-center gap-2 px-4 py-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-semibold transition-all"
              >
                <Target className="w-4 h-4" />
                <span>For Employers</span>
              </Link>

              {/* Sign Up */}
              <Link
                href="/auth/signup"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg"
              >
                Sign Up Free
              </Link>

              {/* Menu Toggle - Mobile */}
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
        </div>
      </nav>

      {/* Trust Badges Bar - Desktop */}
      <div className="hidden md:block bg-blue-50 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-8 py-2 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>POEA Verified</span>
            </div>
            <div className="h-4 w-px bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-yellow-500" />
              <span>Top Rated Platform</span>
            </div>
            <div className="h-4 w-px bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              <span>100k+ Success Stories</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[100px] bg-white z-40 overflow-y-auto animate-fadeIn">
          <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
            {/* Premium Features */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 text-white mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-6 h-6" />
                <h3 className="font-bold text-lg">AI-Powered Job Matching</h3>
              </div>
              <p className="text-sm text-purple-100 mb-4">
                Get matched with your dream job using our advanced AI technology
              </p>
              <Link
                href="/jobs?ai=true"
                className="block w-full px-4 py-3 bg-white text-purple-600 rounded-lg text-center font-bold hover:bg-purple-50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Try AI Match Now
              </Link>
            </div>

            {/* Main Menu */}
            <div className="space-y-2">
              <Link
                href="/jobs"
                className="block px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Browse All Jobs
              </Link>
              <Link
                href="/companies"
                className="block px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Top Companies
              </Link>
              <Link
                href="/resources"
                className="block px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Career Resources
              </Link>
            </div>

            {/* For Employers CTA */}
            <div className="pt-4 border-t border-gray-200">
              <Link
                href="/auth/login?type=employer"
                className="flex items-center justify-center gap-2 px-6 py-4 border-2 border-blue-600 text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Target className="w-5 h-5" />
                Hire Top Filipino Talent
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3 pt-4">
              <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs font-medium text-gray-700">POEA Verified</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
                <Award className="w-4 h-4 text-yellow-500" />
                <span className="text-xs font-medium text-gray-700">Top Rated</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
