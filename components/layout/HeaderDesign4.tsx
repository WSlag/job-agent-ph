'use client';

import Link from 'next/link';
import { Search, Bell, Zap, TrendingUp, Star } from 'lucide-react';
import Logo from '@/components/ui/Logo';

/**
 * DESIGN 4: Dark Mode Premium Header
 * Features:
 * - Dark theme with neon accents
 * - Floating elements with glow effects
 * - Premium feel with badges
 * - Animated highlights
 * - Perfect for modern, premium apps
 */

export default function HeaderDesign4() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Dark Premium Header */}
      <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700/50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-3">
          <div className="flex justify-between items-center h-14">
            {/* Logo with Glow */}
            <Link href="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 blur-lg opacity-50 rounded-full"></div>
                <Logo size="sm" showText={false} />
              </div>
              <span className="text-white font-bold text-lg hidden sm:inline bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Job Agent
              </span>
              <span className="px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 text-[10px] font-bold rounded-full hidden md:inline">
                PRO
              </span>
            </Link>

            {/* Center Quick Stats - Desktop */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg backdrop-blur-sm">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-gray-300">
                  <span className="font-bold text-white">1,234</span> New Jobs
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg backdrop-blur-sm">
                <Star className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-gray-300">
                  <span className="font-bold text-white">89%</span> Match Rate
                </span>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* AI Search Button */}
              <button className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg transition-all shadow-lg hover:shadow-blue-500/50">
                <Zap className="w-4 h-4 text-white" />
                <span className="text-xs font-semibold text-white hidden sm:inline">
                  AI Search
                </span>
              </button>

              {/* Notifications with Glow */}
              <button className="relative p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all border border-gray-700">
                <Bell className="w-4 h-4 text-gray-300" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold border-2 border-gray-900 shadow-lg shadow-pink-500/50">
                  5
                </span>
              </button>

              {/* Search Icon - Mobile */}
              <button className="md:hidden p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all border border-gray-700">
                <Search className="w-4 h-4 text-gray-300" />
              </button>

              {/* Premium User Avatar */}
              <Link
                href="/profile"
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 rounded-full blur-sm opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative w-9 h-9 bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold border-2 border-gray-800">
                  U
                </div>
                {/* Online Indicator */}
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900 shadow-lg shadow-green-400/50"></span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Glowing Bottom Border Effect */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>

      {/* Secondary Dark Navigation - Categories */}
      <div className="bg-gray-900/95 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide py-2">
            <button className="px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-lg text-xs font-medium whitespace-nowrap hover:bg-blue-500/30 transition-all">
              All Jobs
            </button>
            <button className="px-3 py-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg text-xs font-medium whitespace-nowrap transition-all">
              Remote
            </button>
            <button className="px-3 py-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg text-xs font-medium whitespace-nowrap transition-all">
              Hybrid
            </button>
            <button className="px-3 py-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg text-xs font-medium whitespace-nowrap transition-all">
              On-site
            </button>
            <button className="px-3 py-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Featured
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
