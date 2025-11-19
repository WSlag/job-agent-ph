import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory store for rate limiting
// For production, consider using Redis or Upstash Rate Limit
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

// Cleanup old entries every 5 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  identifier?: (request: NextRequest) => string;
}

/**
 * Rate limiting middleware
 * @param config Configuration for rate limiting
 * @returns Middleware function that returns null if request should proceed, or NextResponse if rate limited
 */
export function rateLimit(config: RateLimitConfig) {
  return async (request: NextRequest): Promise<NextResponse | null> => {
    // Get identifier (IP address by default, or custom identifier)
    const identifier = config.identifier || ((req) => {
      return req.headers.get('x-forwarded-for')?.split(',')[0] ||
             req.headers.get('x-real-ip') ||
             'unknown';
    });

    const id = identifier(request);
    const key = `${request.nextUrl.pathname}:${id}`;
    const now = Date.now();

    const record = rateLimitStore.get(key);

    // If no record exists or window has expired, create new record
    if (!record || now > record.resetAt) {
      rateLimitStore.set(key, { count: 1, resetAt: now + config.windowMs });
      return null; // Allow request
    }

    // Check if limit exceeded
    if (record.count >= config.maxRequests) {
      const retryAfter = Math.ceil((record.resetAt - now) / 1000);

      return NextResponse.json(
        {
          error: 'Too many requests',
          message: `Please try again in ${retryAfter} seconds`,
          retryAfter
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfter),
            'X-RateLimit-Limit': String(config.maxRequests),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Math.floor(record.resetAt / 1000)),
          }
        }
      );
    }

    // Increment count and allow request
    record.count++;
    return null; // Allow request
  };
}

/**
 * Common rate limit configurations
 */
export const RateLimits = {
  // Authentication endpoints - strict limit
  auth: rateLimit({
    maxRequests: 5,
    windowMs: 60 * 1000, // 5 requests per minute
  }),

  // API endpoints - moderate limit
  api: rateLimit({
    maxRequests: 30,
    windowMs: 60 * 1000, // 30 requests per minute
  }),

  // Contact form - very strict limit
  contact: rateLimit({
    maxRequests: 3,
    windowMs: 60 * 60 * 1000, // 3 requests per hour
  }),

  // Admin endpoints - moderate limit
  admin: rateLimit({
    maxRequests: 10,
    windowMs: 60 * 1000, // 10 requests per minute
  }),
};