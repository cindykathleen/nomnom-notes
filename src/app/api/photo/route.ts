import { NextResponse, type NextRequest } from 'next/server';

export const GET = async (request: NextRequest) => {
  const photoID = request.nextUrl.searchParams.get('photoID');

  if (!photoID) {
    return NextResponse.json({ error: 'Photo ID parameter is required' }, { status: 400 });
  }
}