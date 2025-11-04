import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  // Validate query parameter
  if (!query) {
    console.error('Geocode API: Missing query parameter');
    return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 });
  }

  // Validate query is not empty after trimming
  if (query.trim() === '') {
    console.error('Geocode API: Empty query parameter');
    return NextResponse.json({ error: 'Query parameter cannot be empty' }, { status: 400 });
  }

  // Validate query length (Nominatim has limits)
  if (query.length > 200) {
    console.error('Geocode API: Query too long:', query.length);
    return NextResponse.json({ error: 'Query parameter too long' }, { status: 400 });
  }

  try {
    console.log('Geocode API: Processing query:', query);

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
      {
        headers: {
          'User-Agent': 'JobAgentPH/1.0 (https://jobagent.ph)',
          // Respect Nominatim usage policy
          'Accept': 'application/json',
        },
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(10000), // 10 second timeout
      }
    );

    if (!response.ok) {
      console.error('Geocode API: Nominatim error:', response.status, response.statusText);
      return NextResponse.json(
        { error: `Nominatim API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Geocode API: Success, results:', data.length);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Geocode API: Unexpected error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Geocoding failed due to network error', details: errorMessage },
      { status: 500 }
    );
  }
}
