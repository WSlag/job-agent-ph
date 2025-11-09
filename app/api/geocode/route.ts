import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  // Validate query parameter
  if (!query) {
    return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 });
  }

  // Validate query is not empty after trimming
  if (query.trim() === '') {
    return NextResponse.json({ error: 'Query parameter cannot be empty' }, { status: 400 });
  }

  // Validate query length (Nominatim has limits)
  if (query.length > 200) {
    return NextResponse.json({ error: 'Query parameter too long' }, { status: 400 });
  }

  try {
    // Create AbortController for timeout (more compatible than AbortSignal.timeout)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
      {
        headers: {
          'User-Agent': 'JobAgentPH/1.0 (https://jobagent.ph)',
          // Respect Nominatim usage policy
          'Accept': 'application/json',
        },
        signal: controller.signal,
        // Add cache control to reduce API calls
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    ).finally(() => {
      clearTimeout(timeoutId);
    });

    if (!response.ok) {
      // For rate limiting (429) or server errors (5xx), return empty array instead of error
      // This allows the frontend to gracefully fallback to showing location text
      if (response.status === 429 || response.status >= 500) {
        return NextResponse.json([]);
      }

      // For other errors, return error status
      return NextResponse.json(
        { error: `Geocoding service unavailable` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    // For timeout or network errors, return empty array for graceful degradation
    if (error instanceof Error && (error.name === 'AbortError' || error.message.includes('fetch'))) {
      return NextResponse.json([]);
    }

    // For other errors, return 500 with empty array
    return NextResponse.json([]);
  }
}
