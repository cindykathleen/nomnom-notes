import { NextResponse, type NextRequest } from 'next/server';
import { searchPlace } from '@/app/lib/GooglePlacesAPI';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    return NextResponse.json({ places: await searchPlace(query!) }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: `${err}` }, { status: 500 });
  }
}