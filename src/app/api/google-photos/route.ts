import { NextResponse, type NextRequest } from 'next/server';
import { getPhoto } from '@/app/lib/GooglePhotosAPI';

export const GET = async (request: NextRequest) => {
  const photoId = request.nextUrl.searchParams.get('photoId');

  if (!photoId) {
    return NextResponse.json({ error: 'photoId parameter is required' }, { status: 400 });
  }

  // Get the photo URL from the Google Photos API first 
  // Then upload the photo into the database
  // And use the new, unique photoId (file name) provided
  try { 
    const googlePhotoURL = await getPhoto(photoId!);

    const formData = new FormData();
    formData.append('url', googlePhotoURL);

    // Since this is calling another API inside a server-side API handler
    // A full URL is needed
    const host = request.headers.get('host');
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    const response = await fetch(`${baseUrl}/api/database/photos`, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`${response.status} - ${JSON.stringify(data)}`);
      return;
    }

    return NextResponse.json({ photoId: data.fileName }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: `${err}` }, { status: 500 });
  }
}