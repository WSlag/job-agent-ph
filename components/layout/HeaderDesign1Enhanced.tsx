'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  Search,
  Menu,
  X,
  MessageCircle,
  Briefcase,
  FileText,
  User,
  LogOut,
  Bookmark,
  LayoutDashboard,
  Filter
} from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { useState, useEffect } from 'react';
import { subscribeToConversations } from '@/lib/messaging-helpers';
import { subscribeToJobHunterApplications } from '@/lib/application-helpers';

/**
 * ENHANCED DESIGN 1: Glassmorphism Modern Header
 * Features:
 * - Frosted glass effect with backdrop blur
 * - Floating search bar with functional navigation
 * - Real-time notifications (messages & applications)
 * - Role-based dynamic navigation (Agency vs Job Hunter)
 * - Authentication integration
 * - Mobile-responsive with beautiful slide-in menu
 * - Clean minimal icons with notification badges
 */

interface HeaderDesign1EnhancedProps {
  hideSearch?: boolean;
  searchPlaceholder?: string;
  currentPage?: string;
  showBackButton?: boolean;
  backUrl?: string;
  showFiltersButton?: boolean;
  showSearchButton?: boolean;
  onFiltersClick?: () => void;
  onSearchButtonClick?: () => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  showNavigation?: boolean;
}

export default function HeaderDesign1Enhanced({
  hideSearch = false,
  searchPlaceholder = 'Search jobs, companies...',
  currentPage,
  showBackButton = false,
  backUrl = '/',
  showFiltersButton = false,
  showSearchButton = false,
  onFiltersClick,
  onSearchButtonClick,
  searchValue,
  onSearchChange,
  showNavigation = true,
}: HeaderDesign1EnhancedProps) {
  const router = useRouter();
  const { user, userType, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [internalSearchQuery, setInternalSearchQuery] = useState('');
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pendingApplications, setPendingApplications] = useState(0);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Use controlled or uncontrolled search input
  const searchQuery = searchValue !== undefined ? searchValue : internalSearchQuery;
  const setSearchQuery = onSearchChange || setInternalSearchQuery;

  // Subscribe to unread messages
  useEffect(() => {
    if (!user || !userType) {
      setUnreadCount(0);
      return;
    }

    const unsubscribe = subscribeToConversations(
      user.uid,
      userType,
      (conversations) => {
        let total = 0;
        conversations.forEach((convo) => {
          if (convo.lastMessage && convo.lastMessage.senderId !== user.uid && !convo.lastMessage.read) {
            total++;
          }
        });
        setUnreadCount(total);
      }
    );

    return () => unsubscribe();
  }, [user, userType]);

  // Subscribe to pending applications (job hunters only)
  useEffect(() => {
    if (!user || userType !== 'jobhunter') {
      setPendingApplications(0);
      return () => {};
    }

    const unsubscribe = subscribeToJobHunterApplications(user.uid, (applications) => {
      const pending = applications.filter(app => app.status === 'pending' || app.status === 'reviewing').length;
      setPendingApplications(pending);
    });

    return () => unsubscribe();
  }, [user, userType]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/jobs');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // If custom search handler provided, use it
    if (onSearchButtonClick) {
      onSearchButtonClick();
      setSearchExpanded(false);
      return;
    }

    // Otherwise, default behavior: navigate to jobs page with search
    if (searchQuery.trim()) {
      router.push(`/jobs?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchExpanded(false);
    }
  };

  const handleFiltersClick = () => {
    if (onFiltersClick) {
      onFiltersClick();
    }
  };

  const getUserInitial = () => {
    if (!user) return 'U';
    if (user.displayName) return user.displayName.charAt(0).toUpperCase();
    if (user.email) return user.email.charAt(0).toUpperCase();
    return 'U';
  };

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

            {/* Center Search Bar with Filters/Search Buttons - Desktop */}
            {!hideSearch && (
              <div className="hidden md:flex flex-1 mx-8 gap-3 items-center">
                <form onSubmit={handleSearch} className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="w-full pl-12 pr-4 py-2.5 bg-white/60 backdrop-blur-md border border-white/40 rounded-full focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-sm placeholder-gray-500 shadow-sm"
                  />
                </form>

                {/* Filters Button - Desktop */}
                {showFiltersButton && (
                  <button
                    onClick={handleFiltersClick}
                    className="flex items-center gap-2 px-6 py-2.5 bg-white/60 backdrop-blur-md border border-white/40 rounded-full hover:bg-white/80 transition-all text-sm font-medium text-gray-700 whitespace-nowrap"
                  >
                    <Filter size={16} />
                    Filters
                  </button>
                )}

                {/* Search Button - Desktop */}
                {showSearchButton && (
                  <button
                    onClick={() => handleSearch()}
                    className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:from-blue-700 hover:to-blue-800 transition-all text-sm font-semibold whitespace-nowrap shadow-md hover:shadow-lg"
                  >
                    Search
                  </button>
                )}
              </div>
            )}

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-4">
              {/* Show generic navigation only if showNavigation is true */}
              {showNavigation && (
                <Link
                  href="/jobs"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 hover:scale-105 text-sm"
                >
                  Browse Jobs
                </Link>
              )}

              {user ? (
                <>
                  {userType === 'agency' && (
                    <>
                      <Link
                        href="/jobs/post"
                        className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 hover:scale-105 flex items-center gap-1.5 text-sm"
                      >
                        <Briefcase size={16} />
                        Post Job
                      </Link>
                      <Link
                        href="/agency/dashboard"
                        className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 hover:scale-105 flex items-center gap-1.5 text-sm"
                      >
                        <LayoutDashboard size={16} />
                        Dashboard
                      </Link>
                    </>
                  )}
                  {userType === 'jobhunter' && (
                    <>
                      <Link
                        href="/profile/applications"
                        className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 hover:scale-105 relative text-sm"
                      >
                        <span className="flex items-center gap-1.5">
                          <FileText size={16} />
                          Applications
                          {pendingApplications > 0 && (
                            <span className="absolute -top-1 -right-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                              {pendingApplications > 9 ? '9+' : pendingApplications}
                            </span>
                          )}
                        </span>
                      </Link>
                      <Link
                        href="/saved-jobs"
                        className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 hover:scale-105 flex items-center gap-1.5 text-sm"
                      >
                        <Bookmark size={16} />
                        Saved
                      </Link>
                    </>
                  )}
                  <Link
                    href="/messages"
                    className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 hover:scale-105 relative text-sm"
                  >
                    <span className="flex items-center gap-1.5">
                      <MessageCircle size={16} />
                      Messages
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md animate-pulse">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </span>
                  </Link>
                </>
              ) : (
                <>
                  {showNavigation && (
                    <>
                      <Link
                        href="/companies"
                        className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 hover:scale-105 text-sm"
                      >
                        Companies
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Search Icon - Mobile */}
              {!hideSearch && (
                <button
                  onClick={() => setSearchExpanded(!searchExpanded)}
                  className="md:hidden p-2 hover:bg-white/50 rounded-full transition-colors"
                >
                  <Search className="w-5 h-5 text-gray-700" />
                </button>
              )}

              {/* Messages Icon - Mobile (for authenticated users) */}
              {user && (
                <Link
                  href="/messages"
                  className="md:hidden relative p-2 hover:bg-white/50 rounded-full transition-colors"
                >
                  <MessageCircle className="w-5 h-5 text-gray-700" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-2 h-2 bg-gradient-to-r from-red-500 to-red-600 rounded-full border-2 border-white animate-pulse"></span>
                  )}
                </Link>
              )}

              {/* User Avatar or Login */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold hover:shadow-lg transition-shadow"
                  >
                    {getUserInitial()}
                  </button>

                  {/* Dropdown Menu */}
                  {showUserDropdown && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowUserDropdown(false)}
                      />
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-20">
                        {userType === 'admin' ? (
                          <Link
                            href="/admin/dashboard"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                            onClick={() => setShowUserDropdown(false)}
                          >
                            <LayoutDashboard className="inline w-4 h-4 mr-2" />
                            Admin Dashboard
                          </Link>
                        ) : (
                          <Link
                            href="/profile"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                            onClick={() => setShowUserDropdown(false)}
                          >
                            <User className="inline w-4 h-4 mr-2" />
                            Profile
                          </Link>
                        )}
                        <div className="border-t border-gray-200 my-1"></div>
                        <button
                          onClick={() => {
                            handleSignOut();
                            setShowUserDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="inline w-4 h-4 mr-2" />
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <>
                  {showNavigation && (
                    <>
                      <Link
                        href="/auth/login"
                        className="hidden md:block text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 hover:scale-105 text-sm"
                      >
                        Login
                      </Link>
                      <Link
                        href="/auth/signup"
                        className="hidden md:block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:scale-105 hover:shadow-lg font-semibold text-sm"
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </>
              )}

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

          {/* Mobile Search Bar - Expanded */}
          {!hideSearch && searchExpanded && (
            <div className="md:hidden pb-3 animate-fadeIn">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={searchPlaceholder}
                    autoFocus
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSearch();
                      }
                    }}
                    className="w-full pl-11 pr-4 py-2 bg-white/60 backdrop-blur-md border border-white/40 rounded-full focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-sm placeholder-gray-500"
                  />
                </div>

                {/* Filters Button - Mobile */}
                {showFiltersButton && (
                  <button
                    onClick={handleFiltersClick}
                    className="p-2 bg-white/60 backdrop-blur-md border border-white/40 rounded-full hover:bg-white/80 transition-all"
                    aria-label="Filters"
                  >
                    <Filter size={18} />
                  </button>
                )}

                {/* Search Button - Mobile */}
                {showSearchButton && (
                  <button
                    onClick={() => handleSearch()}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:from-blue-700 hover:to-blue-800 transition-all text-sm font-semibold whitespace-nowrap"
                  >
                    Search
                  </button>
                )}
              </div>
            </div>
          )}
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
              Browse Jobs
            </Link>

            {user ? (
              <>
                {userType === 'agency' && (
                  <>
                    <Link
                      href="/jobs/post"
                      className="block px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-xl transition-colors font-medium flex items-center gap-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Briefcase size={18} />
                      Post Job
                    </Link>
                    <Link
                      href="/agency/dashboard"
                      className="block px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-xl transition-colors font-medium flex items-center gap-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LayoutDashboard size={18} />
                      Dashboard
                    </Link>
                  </>
                )}
                {userType === 'jobhunter' && (
                  <>
                    <Link
                      href="/profile/applications"
                      className="block px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-xl transition-colors font-medium relative"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="flex items-center gap-2">
                        <FileText size={18} />
                        Applications
                        {pendingApplications > 0 && (
                          <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                            {pendingApplications > 9 ? '9+' : pendingApplications}
                          </span>
                        )}
                      </span>
                    </Link>
                    <Link
                      href="/saved-jobs"
                      className="block px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-xl transition-colors font-medium flex items-center gap-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Bookmark size={18} />
                      Saved Jobs
                    </Link>
                  </>
                )}
                <Link
                  href="/messages"
                  className="block px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-xl transition-colors font-medium relative"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="flex items-center gap-2">
                    <MessageCircle size={18} />
                    Messages
                    {unreadCount > 0 && (
                      <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </span>
                </Link>
                <Link
                  href="/profile"
                  className="block px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-xl transition-colors font-medium flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User size={18} />
                  Profile
                </Link>
                <div className="pt-2 border-t border-gray-200">
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium flex items-center gap-2"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/companies"
                  className="block px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-xl transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Companies
                </Link>
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  <Link
                    href="/auth/login"
                    className="block px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-xl transition-colors font-medium text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl text-center font-semibold hover:shadow-lg transition-shadow"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
