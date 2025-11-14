import { NextRequest, NextResponse } from 'next/server';

/**
 * Simple test endpoint to verify API routes are working
 */
export async function GET(request: NextRequest) {
  console.log('[Test API] Test endpoint called');

  return NextResponse.json(
    {
      success: true,
      message: 'API routes are working',
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}
