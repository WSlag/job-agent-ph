'use client'

import { Home, Briefcase, MessageCircle, BookOpen, User, Grid, Search } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useUnreadMessages } from '@/hooks/useUnreadMessages'
import MessageBadge from '@/components/common/MessageBadge'
import Logo from '@/components/ui/Logo'
import { useState, FormEvent } from 'react'

export default function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, userType } = useAuth()
  const { unreadCount } = useUnreadMessages()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')

  // Don't show bottom nav on auth pages, job details pages, or conversation pages
  if (pathname.startsWith('/auth') || pathname.match(/^\/jobs\/[^\/]+$/) || pathname.match(/^\/messages\/[^\/]+$/)) {
    return null
  }

  // Different nav items based on user type
  const jobHunterNavItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/jobs', icon: Briefcase, label: 'Jobs' },
    { href: '/messages', icon: MessageCircle, label: 'Messages' },
    { href: '/saved-jobs', icon: BookOpen, label: 'Saved' },
    { href: '/profile', icon: User, label: 'Profile' },
  ]

  const agencyNavItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/agency/dashboard', icon: Grid, label: 'Dashboard' },
    { href: '/jobs/post', icon: Briefcase, label: 'Post Job' },
    { href: '/messages', icon: MessageCircle, label: 'Messages' },
    { href: '/profile', icon: User, label: 'Profile' },
  ]

  const guestNavItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/jobs', icon: Briefcase, label: 'Jobs' },
    { href: '/companies', icon: Grid, label: 'Companies' },
    { href: '/about', icon: BookOpen, label: 'About' },
    { href: '/auth/login', icon: User, label: 'Login' },
  ]

  // Determine which nav items to show
  const navItems = !user
    ? guestNavItems
    : userType === 'agency'
    ? agencyNavItems
    : jobHunterNavItems

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // For agency users, navigate to dashboard with search query
      if (userType === 'agency') {
        router.push(`/agency/dashboard?search=${encodeURIComponent(searchQuery.trim())}`)
      }
    }
  }

  // Hide on desktop for pages with specialized headers (keep visible on mobile)
  const pagesWithOwnHeaders = [
    '/',                     // Homepage has LandingNav3Enhanced
    '/jobs',                 // Jobs listing has ListingHeader
    '/companies',            // Companies has ListingHeader
    '/profile',              // Profile has UserDashboardHeader
    '/saved-jobs',           // Saved jobs has UserDashboardHeader
    '/messages',             // Messages has MessagesHeader
    '/notifications',        // Notifications has UserDashboardHeader
    '/about',                // Marketing pages have MarketingHeader
    '/contact',
    '/privacy',
    '/faq',
    '/resources',
  ];

  const hideOnDesktop = pagesWithOwnHeaders.some(path =>
    path === '/' ? pathname === '/' : pathname.startsWith(path)
  ) || pathname.startsWith('/agency'); // Agency pages have AgencyDashboardHeader

  const navClassName = `fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-area-bottom md:top-0 md:bottom-auto md:border-t-0 md:border-b md:shadow-sm ${hideOnDesktop ? 'md:hidden' : ''}`;

  return (
    <nav className={navClassName}>
      <div className="flex items-center justify-around h-14 md:h-16 max-w-screen-xl mx-auto px-2 md:px-4 md:justify-between md:gap-4">
        {/* Logo - Only show on desktop for agency users */}
        {userType === 'agency' && (
          <div className="hidden md:block flex-shrink-0">
            <Link href="/">
              <Logo size="sm" showText={true} />
            </Link>
          </div>
        )}

        {/* Search Bar - Only show on desktop for agency users (except homepage) */}
        {userType === 'agency' && pathname !== '/' && (
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jobs..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </form>
        )}

        {/* Navigation Items */}
        <div className="flex items-center justify-around md:justify-end flex-1 md:flex-initial md:gap-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 md:flex-initial h-full gap-1 transition-colors relative group md:px-4 md:flex-row md:gap-2 ${
                active ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              {/* Active indicator line at top for mobile, bottom for desktop */}
              {active && (
                <div className="absolute top-0 md:bottom-0 md:top-auto left-1/2 -translate-x-1/2 w-12 h-1 bg-blue-600 rounded-b-full md:rounded-t-full md:rounded-b-none" />
              )}

              {/* Icon with background on active */}
              <div className={`relative transition-all ${active ? 'scale-110' : 'group-active:scale-95'}`}>
                <Icon
                  className={`w-6 h-6 transition-colors ${
                    active ? 'text-blue-600' : 'text-gray-500 group-active:text-blue-500'
                  }`}
                  strokeWidth={active ? 2.5 : 2}
                />
                {/* Show unread badge for Messages link */}
                {item.label === 'Messages' && unreadCount > 0 && (
                  <MessageBadge count={unreadCount} size="sm" />
                )}
              </div>

              {/* Label */}
              <span className={`text-xs md:text-sm font-medium transition-colors ${
                active ? 'text-blue-600' : 'text-gray-500'
              }`}>
                {item.label}
              </span>
            </Link>
          )
        })}
        </div>
      </div>
    </nav>
  )
}
