'use client';

import { Search, Plus, Bell, ChevronDown, Home, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/ui/Logo';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface AgencyDashboardHeaderProps {
  breadcrumbs?: Breadcrumb[];
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  showPostJobButton?: boolean;
}

export default function AgencyDashboardHeader({
  breadcrumbs = [],
  searchPlaceholder = 'Search your jobs...',
  onSearch,
  showPostJobButton = true,
}: AgencyDashboardHeaderProps) {
  const { user, userType, signOut } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery.trim());
    }
  };

  // Only show for agency users
  if (userType !== 'agency') {
    return null;
  }

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4">
          {/* Main Header Row */}
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo */}
            <div className="flex items-center gap-4">
              <Link href="/">
                <Logo size="sm" showText={true} />
              </Link>
            </div>

            {/* Center: Search Bar */}
            <div className="flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </form>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              {/* Post Job Button */}
              {showPostJobButton && (
                <Link
                  href="/jobs/post"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  <span>Post Job</span>
                </Link>
              )}

              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                {/* Badge for unread notifications */}
                {/* <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" /> */}
              </button>

              {/* User Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user?.displayName?.[0] || 'A'}
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </button>

                {/* Dropdown Menu */}
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
                        href="/agency/dashboard"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={async () => {
                          setShowUserDropdown(false);
                          try {
                            await signOut();
                            router.push('/auth/login');
                          } catch (error) {
                            console.error('Logout error:', error);
                          }
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Breadcrumbs Row (if provided) */}
          {breadcrumbs.length > 0 && (
            <div className="flex items-center gap-2 pb-3 text-sm">
              <Home className="w-4 h-4 text-gray-400" />
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

      {/* Mobile Breadcrumbs Only */}
      {breadcrumbs.length > 0 && (
        <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center gap-2 text-sm">
            <Home className="w-4 h-4 text-gray-400" />
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-gray-400" />
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="text-gray-600 hover:text-gray-900 transition-colors truncate"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-gray-900 font-medium truncate">{crumb.label}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
