import Link from 'next/link';
import { Home, Search, ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';

/**
 * 404 Not Found Page
 *
 * Custom error page for when users navigate to a page that doesn't exist.
 * Provides helpful navigation options to get back on track.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600">
            404
          </div>
          <div className="text-6xl mt-4">🔍</div>
        </div>

        {/* Content */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/">
            <Button variant="primary" size="lg" icon={<Home size={20} />}>
              Go to Homepage
            </Button>
          </Link>
          <Link href="/jobs">
            <Button variant="outline" size="lg" icon={<Search size={20} />}>
              Browse Jobs
            </Button>
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-4">
            Looking for something? Try these popular pages:
          </p>
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <Link href="/jobs" className="text-primary-600 hover:text-primary-700 hover:underline">
              Browse Jobs
            </Link>
            <Link href="/about" className="text-primary-600 hover:text-primary-700 hover:underline">
              About Us
            </Link>
            <Link href="/contact" className="text-primary-600 hover:text-primary-700 hover:underline">
              Contact Support
            </Link>
            <Link href="/faq" className="text-primary-600 hover:text-primary-700 hover:underline">
              FAQ
            </Link>
            <Link href="/resources" className="text-primary-600 hover:text-primary-700 hover:underline">
              Resources
            </Link>
          </div>
        </div>

        {/* Error Code */}
        <div className="mt-8 text-xs text-gray-400">
          Error Code: 404 - Page Not Found
        </div>
      </div>
    </div>
  );
}
