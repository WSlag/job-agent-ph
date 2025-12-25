'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import AgencyFooter from './AgencyFooter';

const Footer = dynamic(() => import('./Footer'), {
  ssr: false
});

export default function ClientFooter() {
  const pathname = usePathname();

  // Hide footer on specific pages for better UX based on 2025 mobile best practices
  const hideFooter =
    // Messaging pages (immersive chat experience)
    pathname?.startsWith('/messages/') ||
    pathname === '/messages' ||
    pathname?.startsWith('/admin/messages/conversation/') ||

    // Authentication pages (focused, distraction-free experience)
    pathname?.startsWith('/auth/') ||

    // Job details page (has fixed bottom action bar)
    pathname?.match(/^\/jobs\/[^\/]+$/) ||

    // Job workflows (form-heavy tasks)
    pathname === '/jobs/post' ||
    pathname?.startsWith('/jobs/edit/') ||
    pathname?.match(/^\/jobs\/[^\/]+\/applicants$/) ||

    // Profile editing (form-heavy task)
    pathname === '/agency/profile/edit' ||

    // Splash screen (full-screen branded experience)
    pathname === '/splash' ||

    // Admin message workflows (focused tasks)
    pathname?.startsWith('/admin/messages/compose') ||
    pathname?.startsWith('/admin/messages/bulk/');

  // Check if current page is agency detail page
  const isAgencyDetailPage = pathname?.match(/^\/agencies\/[^\/]+$/);

  if (hideFooter) {
    return null;
  }

  if (isAgencyDetailPage) {
    return <AgencyFooter />;
  }

  return <Footer />;
}
