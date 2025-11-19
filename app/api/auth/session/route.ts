import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { RateLimits } from '@/lib/rate-limit';

/**
 * POST /api/auth/session
 * Creates a session cookie from a Firebase ID token
 *
 * This endpoint is called after successful Firebase client-side authentication
 * to create a server-side session cookie that can be verified by middleware.
 */
export async function POST(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = await RateLimits.auth(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { idToken } = await request.json();

    if (!idToken) {
      console.error('[Session API] Missing idToken in request body');
      return NextResponse.json(
        { error: 'Missing idToken in request body' },
        { status: 400 }
      );
    }

    console.log('[Session API] Received idToken, verifying...');

    // Verify the ID token first
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    if (!decodedToken) {
      console.error('[Session API] Invalid ID token');
      return NextResponse.json(
        { error: 'Invalid ID token' },
        { status: 401 }
      );
    }

    console.log('[Session API] Token verified for user:', decodedToken.uid);

    // Set session expiration to 14 days (in milliseconds)
    const expiresIn = 60 * 60 * 24 * 14 * 1000; // 14 days

    // Create session cookie
    console.log('[Session API] Creating session cookie...');
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn,
    });

    console.log('[Session API] Session cookie created, setting in response...');

    // Create response with cookie header
    const response = NextResponse.json(
      {
        success: true,
        message: 'Session cookie created successfully',
        uid: decodedToken.uid,
      },
      { status: 200 }
    );

    // Set the session cookie using Set-Cookie header
    // This is more reliable than cookies() for API routes
    response.cookies.set('session', sessionCookie, {
      maxAge: expiresIn / 1000, // Convert to seconds for cookie maxAge
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
      sameSite: 'lax', // CSRF protection
      path: '/', // Cookie available across entire site
    });

    console.log('[Session API] Session cookie set successfully for user:', decodedToken.uid);

    return response;
  } catch (error) {
    console.error('[Session API] Error creating session cookie:', error);

    return NextResponse.json(
      {
        error: 'Failed to create session cookie',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/auth/session
 * Verifies the current session cookie
 */
export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('session')?.value;

    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'No session cookie found' },
        { status: 401 }
      );
    }

    // Verify the session cookie
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);

    return NextResponse.json(
      {
        success: true,
        uid: decodedClaims.uid,
        email: decodedClaims.email,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Session API] Error verifying session:', error);

    return NextResponse.json(
      {
        error: 'Invalid or expired session',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 401 }
    );
  }
}
