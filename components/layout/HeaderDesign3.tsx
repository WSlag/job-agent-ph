'use client';

import Link from 'next/link';
import { Search, Bell, Menu, X, MapPin } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { useState } from 'react';

/**
 * DESIGN 3: Minimalist Clean Header
 * Features:
 * - Ultra-minimal design with rounded edges
 * - Soft shadows and spacing
 * - Location-based quick filter
 * - Subtle animations
 * - Perfect for professional, clean apps
 */

export default function HeaderDesign3() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Clean Minimal Header */}
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Logo size="sm" showText={true} />
            </Link>

            {/* Center Actions - Desktop */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/jobs"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
              >
                Find Jobs
              </Link>
              <Link
                href="/companies"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
              >
                Companies
              </Link>
              <Link
                href="/resources"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
              >
                Resources
              </Link>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Location Badge - Mobile */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-200">
                <MapPin className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-xs font-medium text-gray-700 hidden sm:inline">
                  Philippines
                </span>
              </div>

              {/* Search Button */}
              <Link
                href="/jobs"
                className="p-2 hover:bg-gray-50 rounded-full transition-colors"
              >
                <Search className="w-5 h-5 text-gray-600" />
              </Link>

              {/* Notifications */}
              <button className="relative p-2 hover:bg-gray-50 rounded-full transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full"></span>
              </button>

              {/* CTA Button - Desktop */}
              <Link
                href="/post-job"
                className="hidden md:inline-flex px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
              >
                Post Job
              </Link>

              {/* User Avatar */}
              <Link
                href="/profile"
                className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 text-sm font-bold hover:shadow-md transition-shadow border-2 border-blue-300"
              >
                U
              </Link>

              {/* Menu Toggle - Mobile */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 hover:bg-gray-50 rounded-full transition-colors"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5 text-gray-700" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Slide-in */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-white z-40 animate-slideInRight">
          <div className="h-full overflow-y-auto">
            <div className="max-w-7xl mx-auto px-4 py-6 space-y-2">
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search jobs..."
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-sm"
                  />
                </div>
              </div>

              {/* Menu Items */}
              <Link
                href="/jobs"
                className="block px-4 py-3.5 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Find Jobs
              </Link>
              <Link
                href="/companies"
                className="block px-4 py-3.5 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Companies
              </Link>
              <Link
                href="/resources"
                className="block px-4 py-3.5 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Resources
              </Link>
              <Link
                href="/saved-jobs"
                className="block px-4 py-3.5 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Saved Jobs
              </Link>

              {/* CTA */}
              <div className="pt-6">
                <Link
                  href="/post-job"
                  className="block bg-blue-600 text-white px-6 py-3.5 rounded-xl text-center font-semibold hover:bg-blue-700 transition-all shadow-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Post a Job
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
