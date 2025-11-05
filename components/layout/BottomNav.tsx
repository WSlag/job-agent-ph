'use client'

import { Home, Briefcase, Grid, BookOpen, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function BottomNav() {
  const pathname = usePathname()
  const { user, userType } = useAuth()

  // Don't show bottom nav on auth pages, job details pages, or conversation pages
  if (pathname.startsWith('/auth') || pathname.match(/^\/jobs\/[^\/]+$/) || pathname.match(/^\/messages\/[^\/]+$/)) {
    return null
  }

  // Different nav items based on user type
  const jobHunterNavItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/jobs', icon: Briefcase, label: 'Jobs' },
    { href: '/companies', icon: Grid, label: 'Companies' },
    { href: '/saved-jobs', icon: BookOpen, label: 'Saved' },
    { href: '/profile', icon: User, label: 'Profile' },
  ]

  const agencyNavItems = [
    { href: '/agency/dashboard', icon: Home, label: 'Home' },
    { href: '/jobs/post', icon: Briefcase, label: 'Post Job' },
    { href: '/jobs', icon: Grid, label: 'My Jobs' },
    { href: '/messages', icon: BookOpen, label: 'Messages' },
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

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-screen-xl mx-auto px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors relative group ${
                active ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              {/* Active indicator line at top */}
              {active && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-blue-600 rounded-b-full" />
              )}

              {/* Icon with background on active */}
              <div className={`relative transition-all ${active ? 'scale-110' : 'group-active:scale-95'}`}>
                <Icon
                  className={`w-6 h-6 transition-colors ${
                    active ? 'text-blue-600' : 'text-gray-500 group-active:text-blue-500'
                  }`}
                  strokeWidth={active ? 2.5 : 2}
                />
              </div>

              {/* Label */}
              <span className={`text-[10px] font-medium transition-colors ${
                active ? 'text-blue-600' : 'text-gray-500'
              }`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
