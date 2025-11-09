'use client';

import { Bell, ChevronDown, User, Briefcase, BookOpen, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Logo from '@/components/ui/Logo';
import { useUnreadMessages } from '@/hooks/useUnreadMessages';

interface UserDashboardHeaderProps {
  showNotifications?: boolean;
}

export default function UserDashboardHeader({
  showNotifications = true,
}: UserDashboardHeaderProps) {
  const { user, userType } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { unreadCount } = useUnreadMessages();
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Only show for job hunter users
  if (userType !== 'job-hunter' && userType !== null) {
    return null;
  }

  const navItems = [
    { href: '/profile', icon: User, label: 'Profile' },
    { href: '/profile/applications', icon: Briefcase, label: 'Applications' },
    { href: '/saved-jobs', icon: BookOpen, label: 'Saved Jobs' },
    { href: '/messages', icon: MessageCircle, label: 'Messages', badge: unreadCount },
  ];

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo + Navigation Tabs */}
            <div className="flex items-center gap-8">
              <Link href="/">
                <Logo size="sm" showText={true} />
              </Link>

              <nav className="flex items-center gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`relative flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        active
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{item.label}</span>
                      {item.badge && item.badge > 0 && (
                        <span className="ml-1 px-2 py-0.5 bg-red-500 text-white text-xs font-medium rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right: Notifications + User Profile */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              {showNotifications && (
                <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  <Bell className="w-5 h-5" />
                  {/* Badge for unread notifications */}
                  {/* <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" /> */}
                </button>
              )}

              {/* User Profile Dropdown */}
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
                        href="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        Profile Settings
                      </Link>
                      <Link
                        href="/notifications"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        Notifications
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
            </div>
          </div>
        </div>
      </header>

      {/* Mobile: Minimal Header - BottomNav handles main navigation */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Logo size="sm" showText={true} />
          </Link>

          <div className="flex items-center gap-2">
            {/* Notifications */}
            {showNotifications && (
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
              </button>
            )}

            {/* User Avatar */}
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {user?.displayName?.[0] || 'U'}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
