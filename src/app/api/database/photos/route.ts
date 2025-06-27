import { NextResponse, type NextRequest } from 'next/server';
import { Database } from '@/app/lib/database';
import { fileTypeFromBuffer } from 'file-type';
import { v4 as uuidv4 } from 'uuid';

const db = new Database('nomnom_notes');

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

export const POST = async (request: NextRequest) => {
  const formData = await request.formData();

  const file = formData.get('file') as File;
  const url = formData.get('url') as string;

  const fileName = uuidv4();

  try {
    if (file) {
      const bytes = await file.arrayBuffer(); // binary data which represents the image
      const buffer = Buffer.from(bytes); // convert to a Node.js Buffer

      await db.uploadPhoto(fileName, buffer);
    } else if (url) {
      const response = await fetch(url);
      const bytes = await response.arrayBuffer(); // binary data which represents the image
      const buffer = Buffer.from(bytes); // convert to a Node.js Buffer

      await db.uploadPhoto(fileName, buffer);
    } else {
      return NextResponse.json({ error: 'No image received' }, { status: 400 });
    }

    return NextResponse.json({
      message: 'Success uploading the image',
      fileName,
      status: 201,
    });

  } catch (err) {
    return NextResponse.json({ error: `Error uploading image: ${err}` }, { status: 500 });
  }
}