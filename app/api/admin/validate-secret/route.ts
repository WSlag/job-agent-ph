import { NextRequest, NextResponse } from 'next/server';
import { validateAdminSecretKey } from '@/lib/admin-helpers';
import { RateLimits } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  // Apply strict rate limiting for admin secret validation
  const rateLimitResponse = await RateLimits.auth(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { secretKey } = await request.json();

    if (!secretKey) {
      return NextResponse.json(
        { valid: false, error: 'Secret key is required' },
        { status: 400 }
      );
    }

    // Validate server-side using the environment variable
    const isValid = validateAdminSecretKey(secretKey);

    if (!isValid) {
      // Log failed attempt for security monitoring
      console.warn(`Failed admin secret validation attempt at ${new Date().toISOString()}`);

      return NextResponse.json(
        { valid: false, error: 'Invalid secret key' },
        { status: 401 }
      );
    }

    // Success
    console.log(`Successful admin secret validation at ${new Date().toISOString()}`);
    return NextResponse.json({ valid: true });

  } catch (error) {
    console.error('Secret validation error:', error);
    return NextResponse.json(
      { valid: false, error: 'Validation failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}