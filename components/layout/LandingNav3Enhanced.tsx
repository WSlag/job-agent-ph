'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Menu, X, Search, Bell, Heart, User2, Sparkles, TrendingUp } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchBar, setShowSearchBar] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Get active filters from URL
  const activeLocation = searchParams?.get('location');
  const activeType = searchParams?.get('type');
  const activeFeatured = searchParams?.get('featured');
  const activeSalary = searchParams?.get('salary');

  // Helper to get pill classes based on active state
  const getPillClasses = (isActive: boolean, activeClasses: string, inactiveClasses: string) => {
    const baseClasses = "flex items-center justify-center gap-1.5 px-4 py-2 h-9 rounded-full text-xs font-medium whitespace-nowrap transition-all shadow-sm snap-start flex-shrink-0";
    if (isActive) {
      return `${baseClasses} ${activeClasses} shadow-lg transform -translate-y-0.5`;
    }
    return `${baseClasses} ${inactiveClasses} hover:shadow-md transform hover:-translate-y-0.5`;
  };

  useEffect(() => {
    const handleScroll = () => {
      // Only show search bar on scroll for mobile devices (screen width < 768px)
      const isMobile = window.innerWidth < 768;
      setShowSearchBar(isMobile && window.scrollY > 50);
    };

    handleScroll(); // Check on mount
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/jobs?q=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push('/jobs');
    }
  };

  // Handle menu open/close with accessibility features
  useEffect(() => {
    if (isMenuOpen) {
      // Prevent body scroll
      document.body.style.overflow = 'hidden';

      // Focus first focusable element in menu
      const firstFocusable = menuRef.current?.querySelector<HTMLElement>(
        'a, button, input, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable?.focus();

      // Handle keyboard navigation
      const handleKeyDown = (e: KeyboardEvent) => {
        // Close menu on Escape
        if (e.key === 'Escape') {
          setIsMenuOpen(false);
          menuButtonRef.current?.focus();
          return;
        }

        // Tab trap
        if (e.key === 'Tab') {
          const focusableElements = menuRef.current?.querySelectorAll<HTMLElement>(
            'a, button, input, [tabindex]:not([tabindex="-1"])'
          );
          if (!focusableElements || focusableElements.length === 0) return;

          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
      };
    } else {
      // Restore body scroll when menu closes
      document.body.style.overflow = '';
    }
  }, [isMenuOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md">
      {/* Main Navigation */}
      <nav className="border-b border-gray-200 shadow-lg">
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
              {/* Notifications */}
              <Link
                href="/notifications"
                className="relative p-2 hover:bg-purple-50 rounded-xl transition-colors group"
                aria-label="Notifications - You have new notifications"
              >
                <Bell className="w-5 h-5 text-gray-600 group-hover:text-purple-600 transition-colors" aria-hidden="true" />
                <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse shadow-lg" aria-hidden="true"></span>
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
                ref={menuButtonRef}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors flex items-center gap-2"
                aria-label={isMenuOpen ? 'Close menu' : 'Open main menu'}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
                aria-haspopup="true"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5 text-gray-700" aria-hidden="true" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-700" aria-hidden="true" />
                )}
                <span className="text-sm font-medium text-gray-700 hidden sm:inline">Menu</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Category Pills Navigation / Search Bar */}
      <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-b border-gray-100 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          {showSearchBar ? (
            /* Search Bar on Scroll */
            <div className="py-3 animate-fadeIn">
              <Link href="/search" className="block">
                <div className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-all shadow-sm hover:shadow-md max-w-2xl mx-auto">
                  <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-400 text-sm flex-1">Job title, skills</span>
                </div>
              </Link>
            </div>
          ) : (
            /* Category Pills */
            <div className="flex gap-2 overflow-x-auto scrollbar-hide py-3 snap-x snap-mandatory animate-fadeIn">
              <Link
                href="/jobs?location=remote"
                className={getPillClasses(
                  activeLocation === 'remote',
                  'bg-gradient-to-r from-blue-500 to-blue-600 text-white border border-blue-300',
                  'bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 text-gray-700 hover:text-blue-700 border border-gray-200 hover:border-blue-300'
                )}
              >
                <span className="text-base leading-none">🌏</span>
                <span className="leading-none">Remote</span>
              </Link>
              <Link
                href="/jobs?type=full-time"
                className={getPillClasses(
                  activeType === 'full-time',
                  'bg-gradient-to-r from-purple-500 to-purple-600 text-white border border-purple-300',
                  'bg-white hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 text-gray-700 hover:text-purple-700 border border-gray-200 hover:border-purple-300'
                )}
              >
                <span className="text-base leading-none">💼</span>
                <span className="leading-none">Full</span>
              </Link>
              <Link
                href="/jobs?location=dubai"
                className={getPillClasses(
                  activeLocation === 'dubai',
                  'bg-gradient-to-r from-orange-500 to-orange-600 text-white border border-orange-300',
                  'bg-white hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 text-gray-700 hover:text-orange-700 border border-gray-200 hover:border-orange-300'
                )}
              >
                <span className="text-base leading-none">🇦🇪</span>
                <span className="leading-none">Dubai</span>
              </Link>
              <Link
                href="/jobs?location=singapore"
                className={getPillClasses(
                  activeLocation === 'singapore',
                  'bg-gradient-to-r from-red-500 to-red-600 text-white border border-red-300',
                  'bg-white hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 text-gray-700 hover:text-red-700 border border-gray-200 hover:border-red-300'
                )}
              >
                <span className="text-base leading-none">🇸🇬</span>
                <span className="leading-none">Singapore</span>
              </Link>
              <Link
                href="/jobs?featured=true"
                className={getPillClasses(
                  activeFeatured === 'true',
                  'bg-gradient-to-r from-yellow-400 to-orange-500 text-white border border-yellow-300',
                  'bg-white hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 text-gray-700 hover:text-orange-700 border border-gray-200 hover:border-yellow-300'
                )}
              >
                <span className="text-base leading-none">✨</span>
                <span className="leading-none">Featured</span>
              </Link>
              <Link
                href="/jobs?salary=high"
                className={getPillClasses(
                  activeSalary === 'high',
                  'bg-gradient-to-r from-green-500 to-green-600 text-white border border-green-300',
                  'bg-white hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 text-gray-700 hover:text-green-700 border border-gray-200 hover:border-green-300'
                )}
              >
                <span className="text-base leading-none">💰</span>
                <span className="leading-none">High Salary</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Beautiful Slide-in Menu */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 animate-fadeIn"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          ></div>

          {/* Menu Panel */}
          <div
            ref={menuRef}
            id="mobile-menu"
            role="navigation"
            aria-label="Main menu"
            className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white z-50 shadow-2xl overflow-y-auto animate-slideInRight"
          >
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
