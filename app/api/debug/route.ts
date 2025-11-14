import { NextRequest, NextResponse } from 'next/server';

/**
 * Debug endpoint to check Firebase Admin initialization
 */
export async function GET(request: NextRequest) {
  console.log('[Debug API] Debug endpoint called');

  try {
    // Try to import Firebase Admin
    const { adminAuth } = await import('@/lib/firebase-admin');

    console.log('[Debug API] Firebase Admin imported successfully');
    console.log('[Debug API] adminAuth exists:', !!adminAuth);

    // Check environment variables
    const hasProjectId = !!process.env.FIREBASE_PROJECT_ID;
    const hasClientEmail = !!process.env.FIREBASE_CLIENT_EMAIL;
    const hasPrivateKey = !!process.env.FIREBASE_PRIVATE_KEY;

    return NextResponse.json(
      {
        success: true,
        message: 'Firebase Admin check',
        adminAuthExists: !!adminAuth,
        environment: {
          hasProjectId,
          hasClientEmail,
          hasPrivateKey,
          projectId: process.env.FIREBASE_PROJECT_ID,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Debug API] Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to initialize Firebase Admin',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
