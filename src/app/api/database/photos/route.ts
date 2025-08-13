import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@/app/lib/database';
import { fileTypeFromBuffer } from 'file-type';

export const GET = async (request: NextRequest) => {
  const id = request.nextUrl.searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID parameter is required' }, { status: 400 });
  }

  try {
    const photo = await db.getPhoto(id);

    if (!photo) {
      return NextResponse.json({ error: 'Photo not found' });
    }

    // Converting from MongoDB's BSON Binary type to buffer
    const buffer = photo.data.buffer;

    // Dynamically get the image type
    const fileType = await fileTypeFromBuffer(buffer);

    if (!fileType) {
      return new NextResponse('Unsupported file type', { status: 415 });
    }

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': fileType.mime, // adjust to 'image/png' if needed
        'Content-Length': buffer.length.toString(),
      },
    });
  } catch (err) {
    return NextResponse.json({ error: `Error fetching photo: ${err}` }, { status: 500 });
  }
}