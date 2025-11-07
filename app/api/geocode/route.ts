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
      }
    ).finally(() => {
      clearTimeout(timeoutId);
    });

    if (!response.ok) {
      // Return error without logging to console
      return NextResponse.json(
        { error: `Nominatim API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    // Silently handle errors - don't log to console
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Geocoding failed due to network error', details: errorMessage },
      { status: 500 }
    );
  }
}
