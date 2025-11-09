'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Header from './Header';
import AgencyDashboardHeader from './AgencyDashboardHeader';
import UserDashboardHeader from './UserDashboardHeader';
import MarketingHeader from './MarketingHeader';

export default function ConditionalHeader() {
  const pathname = usePathname();
  const { userType } = useAuth();

  // Pages with no header (use their own custom headers or LandingNav)
  const noHeaderPaths = [
    '/',                          // Homepage uses LandingNav3Enhanced
    '/auth/login',                // Auth pages - no header
    '/auth/signup',
    '/auth/forgot-password',
  ];

  // Admin pages use AdminLayout (no header needed here)
  if (pathname.startsWith('/admin')) {
    return null;
  }

  // Pages that don't need a header
  if (noHeaderPaths.includes(pathname)) {
    return null;
  }

  // Job details and conversation pages handle their own headers
  if (pathname.match(/^\/jobs\/[^\/]+$/) || pathname.match(/^\/messages\/[^\/]+$/)) {
    return null;
  }

  // AGENCY DASHBOARD PAGES
  if (userType === 'agency') {
    if (
      pathname.startsWith('/agency') ||
      pathname === '/jobs/post' ||
      pathname.startsWith('/jobs/edit') ||
      pathname.match(/^\/jobs\/[^\/]+\/applicants$/)
    ) {
      // These pages will use AgencyDashboardHeader directly in their page components
      // Return null here to avoid double headers
      return null;
    }
  }

  // USER DASHBOARD PAGES (Job Hunters)
  if (userType === 'job-hunter') {
    if (
      pathname.startsWith('/profile') ||
      pathname === '/saved-jobs' ||
      pathname === '/messages' ||
      pathname === '/notifications'
    ) {
      // UserDashboardHeader will be used directly in page components
      return null;
    }
  }

  // MARKETING PAGES (About, Contact, Privacy, FAQ, Resources)
  const marketingPages = ['/about', '/contact', '/privacy', '/faq', '/resources'];
  if (marketingPages.includes(pathname)) {
    return <MarketingHeader />;
  }

  // LISTING PAGES (Jobs, Companies, Search) - handled in page components
  if (pathname === '/jobs' || pathname === '/companies' || pathname === '/search') {
    return null;
  }

  // DEFAULT: Use simple Header for all other pages
  return <Header />;
}
