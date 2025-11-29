'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Menu, X, Search, Bell, Heart, User2, Sparkles, TrendingUp, Globe, MessageCircle, LayoutDashboard } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { useState, useEffect, useRef } from 'react';
import { useOptionalAuth } from '@/contexts/AuthContext';

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
  const { user, userType } = useOptionalAuth();
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
    <>
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md">
      {/* Main Navigation */}
      <nav className="border-b border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center gap-2">
              <Logo size="sm" showText={true} />
              <div className="hidden">
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
              <form onSubmit={handleSearch} className="block">
                <div className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-all shadow-sm hover:shadow-md max-w-2xl mx-auto cursor-pointer">
                  <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Job title, skills"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="text-gray-700 text-sm flex-1 bg-transparent border-none outline-none focus:ring-0 placeholder:text-gray-400"
                  />
                </div>
              </form>
            </div>
          ) : (
            /* Category Pills */
            <nav
              className="flex gap-2 overflow-x-auto scrollbar-hide py-3 snap-x snap-mandatory animate-fadeIn"
              role="navigation"
              aria-label="Job filter quick links"
            >
              <Link
                href="/jobs?salary=high"
                className={getPillClasses(
                  activeSalary === 'high',
                  'bg-gradient-to-r from-green-500 to-green-600 text-white border border-green-300',
                  'bg-white hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 text-gray-700 hover:text-green-700 border border-gray-200 hover:border-green-300'
                )}
                aria-label="Filter by high salary jobs"
                aria-current={activeSalary === 'high' ? 'page' : undefined}
              >
                <span className="text-base leading-none" aria-hidden="true">💰</span>
                <span className="leading-none">High Salary</span>
              </Link>
              <Link
                href="/jobs?featured=true"
                className={getPillClasses(
                  activeFeatured === 'true',
                  'bg-gradient-to-r from-yellow-400 to-orange-500 text-white border border-yellow-300',
                  'bg-white hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 text-gray-700 hover:text-orange-700 border border-gray-200 hover:border-yellow-300'
                )}
                aria-label="Filter by featured jobs"
                aria-current={activeFeatured === 'true' ? 'page' : undefined}
              >
                <span className="text-base leading-none" aria-hidden="true">✨</span>
                <span className="leading-none">Featured</span>
              </Link>
              <Link
                href="/jobs?location=dubai"
                className={getPillClasses(
                  activeLocation === 'dubai',
                  'bg-gradient-to-r from-orange-500 to-orange-600 text-white border border-orange-300',
                  'bg-white hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 text-gray-700 hover:text-orange-700 border border-gray-200 hover:border-orange-300'
                )}
                aria-label="Filter by jobs in Dubai"
                aria-current={activeLocation === 'dubai' ? 'page' : undefined}
              >
                <span className="text-base leading-none" aria-hidden="true">🇦🇪</span>
                <span className="leading-none">Dubai</span>
              </Link>
              <Link
                href="/jobs?location=singapore"
                className={getPillClasses(
                  activeLocation === 'singapore',
                  'bg-gradient-to-r from-red-500 to-red-600 text-white border border-red-300',
                  'bg-white hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 text-gray-700 hover:text-red-700 border border-gray-200 hover:border-red-300'
                )}
                aria-label="Filter by jobs in Singapore"
                aria-current={activeLocation === 'singapore' ? 'page' : undefined}
              >
                <span className="text-base leading-none" aria-hidden="true">🇸🇬</span>
                <span className="leading-none">Singapore</span>
              </Link>
              <Link
                href="/jobs?type=full-time"
                className={getPillClasses(
                  activeType === 'full-time',
                  'bg-gradient-to-r from-purple-500 to-purple-600 text-white border border-purple-300',
                  'bg-white hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 text-gray-700 hover:text-purple-700 border border-gray-200 hover:border-purple-300'
                )}
                aria-label="Filter by full-time jobs"
                aria-current={activeType === 'full-time' ? 'page' : undefined}
              >
                <span className="text-base leading-none" aria-hidden="true">💼</span>
                <span className="leading-none">Full</span>
              </Link>
              <Link
                href="/jobs?location=remote"
                className={getPillClasses(
                  activeLocation === 'remote',
                  'bg-gradient-to-r from-blue-500 to-blue-600 text-white border border-blue-300',
                  'bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 text-gray-700 hover:text-blue-700 border border-gray-200 hover:border-blue-300'
                )}
                aria-label="Filter by remote jobs"
                aria-current={activeLocation === 'remote' ? 'page' : undefined}
              >
                <span className="text-base leading-none" aria-hidden="true">🌏</span>
                <span className="leading-none">Remote</span>
              </Link>
            </nav>
          )}
        </div>
      </div>
    </header>

      {/* Beautiful Slide-in Menu - Outside Header */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[200] animate-fadeIn"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          ></div>

          {/* Menu Panel */}
          <div
            ref={menuRef}
            id="mobile-menu"
            role="navigation"
            aria-label="Main menu"
            className="fixed top-0 bottom-0 right-0 w-full sm:w-96 bg-white z-[210] shadow-2xl overflow-y-auto animate-slideInRight pt-20"
          >
            <div className="p-6 space-y-6">
              {/* User Section */}
              {user ? (
                <div className="pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {user.email?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{user.email}</p>
                      <p className="text-sm text-gray-500">
                        {userType === 'agency' ? 'Agency' : userType === 'admin' ? 'Admin' : 'Job Hunter'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="pb-4 border-b border-gray-200">
                  <div className="space-y-3">
                    <Link
                      href="/auth/login"
                      className="block w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="block w-full px-4 py-3 border-2 border-blue-600 text-blue-600 text-center rounded-lg font-semibold hover:bg-blue-50 transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Create Account
                    </Link>
                  </div>
                </div>
              )}

              {/* Main Navigation */}
              <div className="space-y-2">
                <p className="px-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                  Navigation
                </p>

                {/* Agency Navigation */}
                {userType === 'agency' ? (
                  <>
                    <Link
                      href="/agency/dashboard"
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LayoutDashboard className="w-5 h-5 text-gray-400" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      href="/jobs/post"
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Sparkles className="w-5 h-5 text-gray-400" />
                      <span>Post Job</span>
                    </Link>
                    <Link
                      href="/agency/dashboard"
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Search className="w-5 h-5 text-gray-400" />
                      <span>My Jobs</span>
                    </Link>
                    <Link
                      href="/messages"
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <MessageCircle className="w-5 h-5 text-gray-400" />
                      <span>Messages</span>
                    </Link>
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User2 className="w-5 h-5 text-gray-400" />
                      <span>Profile</span>
                    </Link>
                  </>
                ) : (
                  /* Job Hunter / Guest Navigation */
                  <>
                    <Link
                      href="/jobs"
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Search className="w-5 h-5 text-gray-400" />
                      <span>Browse Jobs</span>
                    </Link>
                    {user && (
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <LayoutDashboard className="w-5 h-5 text-gray-400" />
                        <span>Dashboard</span>
                      </Link>
                    )}
                    <Link
                      href="/companies"
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Globe className="w-5 h-5 text-gray-400" />
                      <span>Companies</span>
                    </Link>
                    {user && (
                      <>
                        <Link
                          href="/saved-jobs"
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Heart className="w-5 h-5 text-gray-400" />
                          <span>Saved Jobs</span>
                        </Link>
                        <Link
                          href="/messages"
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <MessageCircle className="w-5 h-5 text-gray-400" />
                          <span>Messages</span>
                        </Link>
                      </>
                    )}
                  </>
                )}
              </div>

              {/* Help Section */}
              <div className="pt-4 border-t border-gray-200">
                <p className="px-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                  Help & Support
                </p>
                <div className="space-y-2">
                  <Link
                    href="/resources"
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Career Resources
                  </Link>
                  <Link
                    href="/faq"
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    FAQs
                  </Link>
                  <Link
                    href="/contact"
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium"
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
    </>
  );
}
