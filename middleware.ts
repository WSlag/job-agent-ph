import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for server-side route protection
 *
 * This middleware runs on every request and protects routes that require authentication.
 * It checks for the presence of Firebase auth session cookies and redirects unauthorized users.
 *
 * Protected routes:
 * - /profile/* - User profile and settings
 * - /agency/* - Agency dashboard and features
 * - /admin/* - Admin panel
 * - /messages/* - Messaging system
 * - /notifications - Notifications page
 * - /saved-jobs - Saved jobs page
 * - /applications - Applications tracking (also in (authenticated) group)
 *
 * Public routes (no auth required):
 * - / - Homepage
 * - /jobs/* - Job listings and details
 * - /companies - Company directory
 * - /about - About page
 * - /auth/* - Auth pages (login, signup, etc.)
 * - /api/* - API routes (handle their own auth)
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define protected route patterns
  const protectedRoutes = [
    '/profile',
    '/agency',
    '/admin',
    '/messages',
    '/notifications',
    '/saved-jobs',
    '/applications',
  ];

  // Check if current path matches any protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // If not a protected route, allow access
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Check for Firebase auth session cookie
  // This cookie is set by /api/auth/session after successful login
  const sessionCookie = request.cookies.get('session')?.value;

  // If no session cookie, redirect to login with return URL
  if (!sessionCookie) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    const response = NextResponse.redirect(loginUrl);

    // Disable middleware cache to ensure fresh cookie reads
    response.headers.set('x-middleware-cache', 'no-cache');
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');

    return response;
  }

  // User is authenticated, allow access
  const response = NextResponse.next();

  // Disable middleware cache to ensure fresh cookie reads on subsequent requests
  response.headers.set('x-middleware-cache', 'no-cache');
  response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');

  return response;
}

/**
 * Middleware configuration
 *
 * Specify which routes this middleware should run on.
 * Using a matcher is more efficient than checking every route.
 *
 * IMPORTANT: Excludes /auth and /api routes to prevent redirect loops
 * and unnecessary middleware execution on API routes.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     * - auth routes (/auth/*)
     * - api routes (/api/*)
     */
    '/((?!_next/static|_next/image|favicon.ico|auth|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
