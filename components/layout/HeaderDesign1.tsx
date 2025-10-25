'use client';

import Link from 'next/link';
import { Search, Bell, Menu, X } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { useState } from 'react';

/**
 * DESIGN 1: Glassmorphism Modern Header
 * Features:
 * - Frosted glass effect with backdrop blur
 * - Floating search bar
 * - Clean minimal icons
 * - Smooth transitions
 * - Perfect for modern, elegant apps
 */

export default function HeaderDesign1() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Glassmorphism Header */}
      <nav className="bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Logo size="sm" showText={true} />
            </Link>

            {/* Center Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search jobs, companies..."
                  className="w-full pl-12 pr-4 py-2.5 bg-white/60 backdrop-blur-md border border-white/40 rounded-full focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-sm placeholder-gray-500 shadow-sm"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Search Icon - Mobile */}
              <button className="md:hidden p-2 hover:bg-white/50 rounded-full transition-colors">
                <Search className="w-5 h-5 text-gray-700" />
              </button>

              {/* Notifications */}
              <button className="relative p-2 hover:bg-white/50 rounded-full transition-colors">
                <Bell className="w-5 h-5 text-gray-700" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full border-2 border-white"></span>
              </button>

              {/* User Avatar */}
              <Link
                href="/profile"
                className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-semibold hover:shadow-lg transition-shadow"
              >
                U
              </Link>

              {/* Menu Toggle - Mobile */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 hover:bg-white/50 rounded-full transition-colors"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5 text-gray-700" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-700" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden pb-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search jobs..."
                className="w-full pl-11 pr-4 py-2 bg-white/60 backdrop-blur-md border border-white/40 rounded-full focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-sm placeholder-gray-500"
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-white/95 backdrop-blur-xl z-40 animate-fadeIn">
          <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
            <Link
              href="/jobs"
              className="block px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-xl transition-colors font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Find Jobs
            </Link>
            <Link
              href="/companies"
              className="block px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-xl transition-colors font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Companies
            </Link>
            <Link
              href="/resources"
              className="block px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-xl transition-colors font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Resources
            </Link>
            <div className="pt-4 border-t border-gray-200">
              <Link
                href="/post-job"
                className="block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl text-center font-semibold hover:shadow-lg transition-shadow"
                onClick={() => setIsMenuOpen(false)}
              >
                Post a Job
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
