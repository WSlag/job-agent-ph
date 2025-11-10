import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { cookies } from 'next/headers';

/**
 * POST /api/auth/session
 *
 * Creates a session cookie from a Firebase ID token
 * This enables server-side authentication via middleware
 *
 * Request body: { idToken: string }
 * Response: { success: boolean, message?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json(
        { success: false, message: 'ID token is required' },
        { status: 400 }
      );
    }

    // Verify the ID token
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    if (!decodedToken) {
      return NextResponse.json(
        { success: false, message: 'Invalid ID token' },
        { status: 401 }
      );
    }

    // Create session cookie (expires in 14 days)
    const expiresIn = 60 * 60 * 24 * 14 * 1000; // 14 days in milliseconds
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn,
    });

    // Set the session cookie
    const cookieStore = await cookies();
    cookieStore.set('session', sessionCookie, {
      maxAge: expiresIn / 1000, // Convert to seconds
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return NextResponse.json(
      { success: true, message: 'Session created successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error creating session cookie:', error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to create session',
      },
      { status: 500 }
    );
  }
}
