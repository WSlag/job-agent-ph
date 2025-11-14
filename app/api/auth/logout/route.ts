import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

/**
 * POST /api/auth/logout
 * Clears the session cookie and revokes the user's refresh tokens
 *
 * This endpoint is called when a user logs out to properly clean up
 * their server-side session and invalidate their tokens.
 */
export async function POST(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('session')?.value;

    if (sessionCookie) {
      try {
        // Verify the session cookie to get the user ID
        const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie);

        // Revoke all refresh tokens for the user
        // This ensures they can't create new session cookies with old tokens
        await adminAuth.revokeRefreshTokens(decodedClaims.uid);

        console.log('[Logout API] Revoked refresh tokens for user:', decodedClaims.uid);
      } catch (error) {
        // If session verification fails, we still want to clear the cookie
        console.warn('[Logout API] Could not verify session cookie during logout:', error);
      }
    }

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        message: 'Logged out successfully',
      },
      { status: 200 }
    );

    // Clear the session cookie by setting it with maxAge: 0
    response.cookies.set('session', '', {
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    console.log('[Logout API] Session cookie cleared successfully');

    return response;
  } catch (error) {
    console.error('[Logout API] Error during logout:', error);

    // Even if there's an error, try to clear the cookie
    const response = NextResponse.json(
      {
        error: 'Error during logout, but session cleared',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );

    response.cookies.set('session', '', {
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return response;
  }
}

/**
 * GET /api/auth/logout
 * Alternative GET endpoint for logout (for simple link-based logout)
 */
export async function GET(request: NextRequest) {
  // Just call the POST handler
  return POST(request);
}
