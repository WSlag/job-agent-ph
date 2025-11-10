'use client';

import { Search, Filter, Home, ChevronRight, ChevronDown, X } from 'lucide-react';
import Link from 'next/link';
import { useOptionalAuth } from '@/contexts/AuthContext';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/ui/Logo';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface ListingHeaderProps {
  breadcrumbs?: Breadcrumb[];
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearchSubmit?: (query: string) => void;
  onFilterClick?: () => void;
  showFilters?: boolean;
  showSearchButton?: boolean;
}

export default function ListingHeader({
  breadcrumbs = [],
  searchPlaceholder = 'Search jobs, companies, skills...',
  searchValue = '',
  onSearchChange,
  onSearchSubmit,
  onFilterClick,
  showFilters = false,
  showSearchButton = true,
}: ListingHeaderProps) {
  const { user } = useOptionalAuth();
  const router = useRouter();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [mobileSearchExpanded, setMobileSearchExpanded] = useState(false);

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchValue.trim() && onSearchSubmit) {
      onSearchSubmit(searchValue.trim());
    }
  };

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo */}
            <Link href="/">
              <Logo size="sm" showText={true} />
            </Link>

            {/* Center: Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Filter Button */}
                {onFilterClick && (
                  <button
                    type="button"
                    onClick={onFilterClick}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-colors ${
                      showFilters
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Filter className="w-4 h-4" />
                    <span className="text-sm font-medium">Filters</span>
                  </button>
                )}

                {/* Search Button */}
                {showSearchButton && searchValue && (
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Search
                  </button>
                )}
              </form>
            </div>

            {/* Right: User Profile or Login */}
            <div className="flex items-center gap-3">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {user?.displayName?.[0] || 'U'}
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  </button>

                  {showUserDropdown && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowUserDropdown(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">{user?.displayName}</p>
                          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                        <Link
                          href="/profile"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          Profile
                        </Link>
                        <Link
                          href="/saved-jobs"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          Saved Jobs
                        </Link>
                        <button
                          onClick={() => {
                            setShowUserDropdown(false);
                            router.push('/auth/login');
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                        >
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/auth/login"
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Breadcrumbs (if provided) */}
          {breadcrumbs.length > 0 && (
            <div className="flex items-center gap-2 pb-3 text-sm">
              <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                <Home className="w-4 h-4" />
              </Link>
              {breadcrumbs.map((crumb, index) => (
                <div key={index} className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-gray-900 font-medium">{crumb.label}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Mobile Search Bar - Expandable & Sticky */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 py-3">
          {!mobileSearchExpanded ? (
            // Collapsed state - Shows placeholder button
            <button
              onClick={() => setMobileSearchExpanded(true)}
              className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-left active:bg-gray-100 transition-colors"
            >
              <Search className="text-gray-400 w-5 h-5 flex-shrink-0" />
              <span className="text-gray-500">{searchPlaceholder}</span>
            </button>
          ) : (
            // Expanded state - Shows actual input with close button
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                    placeholder={searchPlaceholder}
                    autoFocus
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={() => {
                    setMobileSearchExpanded(false);
                    onSearchChange?.('');
                  }}
                  className="p-3 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Close search"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Quick action buttons */}
              <div className="flex gap-2">
                {onFilterClick && (
                  <button
                    onClick={onFilterClick}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                      showFilters
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Filter className="w-4 h-4" />
                    <span className="text-sm font-medium">Filters</span>
                  </button>
                )}
                {showSearchButton && searchValue && (
                  <button
                    onClick={() => onSearchSubmit?.(searchValue)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Search
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
