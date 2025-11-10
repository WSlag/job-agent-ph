import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * POST /api/auth/logout
 *
 * Clears the session cookie to log the user out
 *
 * Response: { success: boolean, message?: string }
 */
export async function POST() {
  try {
    const cookieStore = await cookies();

    // Clear the session cookie
    cookieStore.delete('session');

    return NextResponse.json(
      { success: true, message: 'Logged out successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error during logout:', error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to logout',
      },
      { status: 500 }
    );
  }
}
