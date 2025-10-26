'use client';

import Link from 'next/link';
import { Menu, X, Search, Bell, Heart, User2, Sparkles, TrendingUp } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * LANDING NAV 3 ENHANCED: Beautiful App-Style Navigation
 * Optimized for mobile with gorgeous UI
 * Features:
 * - Beautiful mobile-first design
 * - Smooth animations and transitions
 * - App-like interface with quick actions
 * - Gradient accents and modern styling
 * - Category pills with emojis
 * - Perfect for: Mobile PWA landing page
 */

export default function LandingNav3Enhanced() {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [savedJobsCount, setSavedJobsCount] = useState(0);

  useEffect(() => {
    if (user) {
      loadSavedJobsCount();
    } else {
      setSavedJobsCount(0);
    }
  }, [user]);

  const loadSavedJobsCount = async () => {
    if (!user) return;

    try {
      const savedJobsRef = collection(db, 'savedJobs', user.uid, 'jobs');
      const savedJobsSnapshot = await getDocs(query(savedJobsRef));
      setSavedJobsCount(savedJobsSnapshot.size);
    } catch (error) {
      console.error('Error loading saved jobs count:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/jobs?q=${encodeURIComponent(searchQuery)}`;
    } else {
      window.location.href = '/jobs';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Main Navigation */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center gap-2">
              <Logo size="sm" showText={true} />
              <div className="hidden md:flex items-center gap-2 ml-2">
                <div className="h-4 w-px bg-gray-300"></div>
                <span className="text-[10px] font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  300K+ JOBS
                </span>
              </div>
            </Link>

            {/* Desktop Search Bar */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <form onSubmit={handleSearch} className="relative w-full group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search jobs, companies, skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:bg-white transition-all text-sm placeholder:text-gray-400"
                />
              </form>
            </div>

            {/* Quick Action Icons */}
            <div className="flex items-center gap-2">
              {/* Search - Mobile */}
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="md:hidden p-2 hover:bg-blue-50 rounded-xl transition-colors group"
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
              </button>

              {/* Saved Jobs */}
              <Link
                href="/saved-jobs"
                className="relative p-2 hover:bg-red-50 rounded-xl transition-colors group"
                aria-label="Saved Jobs"
              >
                <Heart className="w-5 h-5 text-gray-600 group-hover:text-red-500 group-hover:fill-red-100 transition-all" />
                {savedJobsCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-gradient-to-r from-red-500 to-pink-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold shadow-lg">
                    {savedJobsCount}
                  </span>
                )}
              </Link>

              {/* Notifications */}
              <Link
                href="/notifications"
                className="relative p-2 hover:bg-purple-50 rounded-xl transition-colors group"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 text-gray-600 group-hover:text-purple-600 transition-colors" />
                <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse shadow-lg"></span>
              </Link>

              {/* Login/Profile - Desktop */}
              <Link
                href="/auth/login"
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-lg"
              >
                <User2 className="w-4 h-4" />
                <span className="hidden lg:inline">Login</span>
              </Link>

              {/* Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                aria-label="Menu"
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
              <form onSubmit={handleSearch} className="relative group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:bg-white transition-all text-sm"
                  autoFocus
                />
              </form>
            </div>
          )}
        </div>
      </nav>

      {/* Beautiful Category Pills Navigation */}
      <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="flex gap-1.5 sm:gap-2 overflow-x-auto scrollbar-hide py-2 sm:py-3">
            <Link
              href="/jobs?location=remote"
              className="flex items-center gap-0.5 sm:gap-1.5 px-2 sm:px-4 py-0.5 sm:py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border border-blue-300 rounded-full text-[10px] sm:text-xs font-semibold whitespace-nowrap transition-all shadow-sm hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <span className="text-[11px] sm:text-sm">🌏</span>
              <span>Remote</span>
            </Link>
            <Link
              href="/jobs?type=full-time"
              className="flex items-center gap-0.5 sm:gap-1.5 px-2 sm:px-4 py-0.5 sm:py-2 bg-white hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 text-gray-700 hover:text-purple-700 border border-gray-200 hover:border-purple-300 rounded-full text-[10px] sm:text-xs font-semibold whitespace-nowrap transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
            >
              <span className="text-[11px] sm:text-sm">💼</span>
              <span>Full</span>
            </Link>
            <Link
              href="/jobs?location=dubai"
              className="flex items-center gap-0.5 sm:gap-1.5 px-2 sm:px-4 py-0.5 sm:py-2 bg-white hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 text-gray-700 hover:text-orange-700 border border-gray-200 hover:border-orange-300 rounded-full text-[10px] sm:text-xs font-semibold whitespace-nowrap transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
            >
              <span className="text-[11px] sm:text-sm">🇦🇪</span>
              <span>Dub</span>
            </Link>
            <Link
              href="/jobs?location=singapore"
              className="flex items-center gap-0.5 sm:gap-1.5 px-2 sm:px-4 py-0.5 sm:py-2 bg-white hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 text-gray-700 hover:text-red-700 border border-gray-200 hover:border-red-300 rounded-full text-[10px] sm:text-xs font-semibold whitespace-nowrap transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
            >
              <span className="text-[11px] sm:text-sm">🇸🇬</span>
              <span>Sing</span>
            </Link>
            <Link
              href="/jobs?featured=true"
              className="flex items-center gap-0.5 sm:gap-1.5 px-2 sm:px-4 py-0.5 sm:py-2 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white border border-yellow-300 rounded-full text-[10px] sm:text-xs font-semibold whitespace-nowrap transition-all shadow-sm hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-2 h-2 sm:w-3 sm:h-3" />
              <span>Feat</span>
            </Link>
            <Link
              href="/jobs?salary=high"
              className="flex items-center gap-0.5 sm:gap-1.5 px-2 sm:px-4 py-0.5 sm:py-2 bg-white hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 text-gray-700 hover:text-green-700 border border-gray-200 hover:border-green-300 rounded-full text-[10px] sm:text-xs font-semibold whitespace-nowrap transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
            >
              <span className="text-[11px] sm:text-sm">💰</span>
              <span>High</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Beautiful Slide-in Menu */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 animate-fadeIn"
            onClick={() => setIsMenuOpen(false)}
          ></div>

          {/* Menu Panel */}
          <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white z-50 shadow-2xl overflow-y-auto animate-slideInRight">
            <div className="p-6 space-y-6">
              {/* User Section - Beautiful Gradient Card */}
              <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border-2 border-white/30 shadow-lg">
                    <User2 className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">Welcome Back!</p>
                    <p className="text-sm text-blue-100">Start your career journey today</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/auth/login?type=jobseeker"
                    className="px-4 py-3 bg-white text-blue-600 rounded-xl text-sm font-bold text-center hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Find Jobs
                  </Link>
                  <Link
                    href="/auth/login?type=employer"
                    className="px-4 py-3 bg-white/20 text-white rounded-xl text-sm font-bold text-center hover:bg-white/30 transition-all backdrop-blur-sm border border-white/30 transform hover:-translate-y-0.5"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Post Job
                  </Link>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <span className="text-xs font-semibold text-blue-900">NEW TODAY</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">2,345</p>
                  <p className="text-xs text-blue-700">Fresh Jobs</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    <span className="text-xs font-semibold text-purple-900">FEATURED</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-600">500+</p>
                  <p className="text-xs text-purple-700">Top Jobs</p>
                </div>
              </div>

              {/* Main Menu Items - Beautiful Cards */}
              <div className="space-y-3">
                <p className="px-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
                  Explore Jobs
                </p>
                <Link
                  href="/jobs"
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 rounded-xl transition-all border border-blue-100 hover:border-blue-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
                    <Search className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">Browse All Jobs</p>
                    <p className="text-xs text-gray-600">300,000+ opportunities worldwide</p>
                  </div>
                </Link>

                <Link
                  href="/companies"
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 rounded-xl transition-all border border-purple-100 hover:border-purple-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
                    <User2 className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">Top Companies</p>
                    <p className="text-xs text-gray-600">Explore leading employers</p>
                  </div>
                </Link>

                <Link
                  href="/saved-jobs"
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 rounded-xl transition-all border border-red-100 hover:border-red-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md relative">
                    <Heart className="w-6 h-6 text-white" />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-red-600 rounded-full text-[10px] flex items-center justify-center font-bold">
                      3
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">Saved Jobs</p>
                    <p className="text-xs text-gray-600">Your bookmarked opportunities</p>
                  </div>
                </Link>
              </div>

              {/* Help Section */}
              <div className="pt-4 border-t border-gray-200">
                <p className="px-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                  Help & Support
                </p>
                <div className="space-y-2">
                  <Link
                    href="/resources"
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Career Resources
                  </Link>
                  <Link
                    href="/faq"
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    FAQs
                  </Link>
                  <Link
                    href="/contact"
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Contact Support
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
