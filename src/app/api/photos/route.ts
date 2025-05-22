import { NextResponse, type NextRequest } from 'next/server';
import { getPhoto } from '@/app/lib/GooglePhotosAPI';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const photoId = searchParams.get('photoId');

  if (!photoId) {
    return NextResponse.json({ error: 'photoId parameter is required' }, { status: 400 });
  }

  try {
    return NextResponse.json({ photo: await getPhoto(photoId!) }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: `${err}` }, { status: 500 });
  }
}