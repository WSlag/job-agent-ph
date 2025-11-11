'use client';

import Link from 'next/link';
import { Menu, X, Search, Bell, Heart, User2 } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { useState } from 'react';

/**
 * LANDING NAV 3: App-Style Navigation with Quick Actions
 * Features:
 * - App-like interface with icon quick actions
 * - Inline search bar on mobile
 * - Save/bookmark functionality visible
 * - User-friendly notification bell
 * - Perfect for: PWA app-like experience
 */

export default function LandingNav3() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Main Navigation */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-3">
          <div className="flex justify-between items-center h-14">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Logo size="sm" showText={true} />
            </Link>

            {/* Desktop Search Bar */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search jobs, companies, skills..."
                  className="w-full pl-11 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-sm"
                />
              </div>
            </div>

            {/* Quick Action Icons */}
            <div className="flex items-center gap-2">
              {/* Search - Mobile */}
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Search className="w-5 h-5 text-gray-600" />
              </button>

              {/* Saved Jobs */}
              <Link
                href="/saved-jobs"
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Heart className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                  3
                </span>
              </Link>

              {/* Notifications */}
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full"></span>
              </button>

              {/* User Profile/Login */}
              <Link
                href="/auth/login"
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-all"
              >
                <User2 className="w-4 h-4" />
                <span>Login</span>
              </Link>

              {/* Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5 text-gray-700" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-700" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar - Expandable */}
          {showSearch && (
            <div className="md:hidden pb-3 animate-fadeIn">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search jobs..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-sm"
                  autoFocus
                />
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Category Pills Navigation */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide py-2.5">
            <Link
              href="/jobs?location=remote"
              className="px-4 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-medium whitespace-nowrap hover:bg-blue-100 transition-colors"
            >
              🌏 Remote Jobs
            </Link>
            <Link
              href="/jobs?type=full-time"
              className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium whitespace-nowrap hover:bg-gray-200 transition-colors"
            >
              💼 Full-time
            </Link>
            <Link
              href="/jobs?location=dubai"
              className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium whitespace-nowrap hover:bg-gray-200 transition-colors"
            >
              🇦🇪 Dubai
            </Link>
            <Link
              href="/jobs?location=singapore"
              className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium whitespace-nowrap hover:bg-gray-200 transition-colors"
            >
              🇸🇬 Singapore
            </Link>
            <Link
              href="/jobs?featured=true"
              className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium whitespace-nowrap hover:bg-gray-200 transition-colors"
            >
              ⭐ Featured
            </Link>
            <Link
              href="/jobs?salary=high"
              className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium whitespace-nowrap hover:bg-gray-200 transition-colors"
            >
              💰 High Salary
            </Link>
          </div>
        </div>
      </div>

      {/* Slide-in Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-14 bg-white z-[60] animate-slideInRight overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
            {/* User Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <User2 className="w-8 h-8" />
                </div>
                <div>
                  <p className="font-bold text-lg">Welcome!</p>
                  <p className="text-sm text-blue-100">Start your career journey</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/auth/login?type=jobseeker"
                  className="px-4 py-2 bg-white text-blue-600 rounded-lg text-sm font-semibold text-center hover:bg-blue-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Find Jobs
                </Link>
                <Link
                  href="/auth/login?type=employer"
                  className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm font-semibold text-center hover:bg-white/30 transition-colors backdrop-blur-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Post Job
                </Link>
              </div>
            </div>

            {/* Main Menu Items */}
            <div className="space-y-2">
              <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Explore
              </p>
              <Link
                href="/jobs"
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Search className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Browse All Jobs</p>
                  <p className="text-xs text-gray-500">300,000+ opportunities</p>
                </div>
              </Link>
              <Link
                href="/companies"
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <User2 className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Top Companies</p>
                  <p className="text-xs text-gray-500">Explore employers</p>
                </div>
              </Link>
              <Link
                href="/saved-jobs"
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Saved Jobs</p>
                  <p className="text-xs text-gray-500">3 jobs saved</p>
                </div>
              </Link>
            </div>

            {/* Help Section */}
            <div className="pt-4 border-t border-gray-200">
              <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Help & Support
              </p>
              <Link
                href="/resources"
                className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Career Resources
              </Link>
              <Link
                href="/faq"
                className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQs
              </Link>
              <Link
                href="/contact"
                className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
