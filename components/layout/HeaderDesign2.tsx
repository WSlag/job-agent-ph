'use client';

import Link from 'next/link';
import { Briefcase, Building2, Bookmark, User, ChevronDown } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { useState } from 'react';

/**
 * DESIGN 2: Bold Gradient Header with Icon Navigation
 * Features:
 * - Vibrant gradient background
 * - Icon-based quick navigation
 * - Compact and colorful
 * - Material Design inspired
 * - Perfect for dynamic, engaging apps
 */

export default function HeaderDesign2() {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Gradient Header */}
      <nav className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 shadow-xl">
        <div className="max-w-7xl mx-auto px-3">
          {/* Top Row */}
          <div className="flex justify-between items-center h-14">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-white font-bold text-lg hidden sm:inline">
                  Job Agent
                </span>
              </div>
            </Link>

            {/* Quick Action Icons - Mobile Centered */}
            <div className="flex items-center gap-2">
              <Link
                href="/jobs"
                className="p-2.5 bg-white/20 hover:bg-white/30 rounded-lg transition-all backdrop-blur-sm"
                title="Find Jobs"
              >
                <Briefcase className="w-5 h-5 text-white" />
              </Link>
              <Link
                href="/companies"
                className="p-2.5 bg-white/20 hover:bg-white/30 rounded-lg transition-all backdrop-blur-sm"
                title="Companies"
              >
                <Building2 className="w-5 h-5 text-white" />
              </Link>
              <Link
                href="/saved-jobs"
                className="p-2.5 bg-white/20 hover:bg-white/30 rounded-lg transition-all backdrop-blur-sm relative"
                title="Saved Jobs"
              >
                <Bookmark className="w-5 h-5 text-white" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold border-2 border-purple-600">
                  3
                </span>
              </Link>
            </div>

            {/* User Profile */}
            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center gap-2 p-1.5 bg-white/20 hover:bg-white/30 rounded-full transition-all backdrop-blur-sm"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold border-2 border-white/50">
                  U
                </div>
                <ChevronDown className="w-4 h-4 text-white mr-1 hidden sm:block" />
              </button>

              {/* Dropdown Menu */}
              {showProfile && (
                <div className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 animate-fadeIn">
                  <Link
                    href="/profile"
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                    onClick={() => setShowProfile(false)}
                  >
                    My Profile
                  </Link>
                  <Link
                    href="/applications"
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                    onClick={() => setShowProfile(false)}
                  >
                    My Applications
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                    onClick={() => setShowProfile(false)}
                  >
                    Settings
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Secondary Navigation Bar - Categories */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-3">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide py-2">
            <button className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium whitespace-nowrap">
              All Jobs
            </button>
            <button className="px-3 py-1.5 text-gray-600 hover:bg-gray-50 rounded-full text-xs font-medium whitespace-nowrap">
              Remote
            </button>
            <button className="px-3 py-1.5 text-gray-600 hover:bg-gray-50 rounded-full text-xs font-medium whitespace-nowrap">
              Full-time
            </button>
            <button className="px-3 py-1.5 text-gray-600 hover:bg-gray-50 rounded-full text-xs font-medium whitespace-nowrap">
              Part-time
            </button>
            <button className="px-3 py-1.5 text-gray-600 hover:bg-gray-50 rounded-full text-xs font-medium whitespace-nowrap">
              Contract
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
