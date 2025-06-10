import { NextResponse, type NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { writeFile } from 'fs/promises';
import path from 'path';

export const POST = async (request: NextRequest) => {
  const formData = await request.formData();

  const file = formData.get('file') as File;
  const url = formData.get('url') as string;

  const fileName = uuidv4(); // create a unique photo ID
  const filePath = path.join(process.cwd(), "public/uploads/" + fileName);

  try {
    if (file) {
      const bytes = await file.arrayBuffer(); // binary data which represents the image
      const buffer = Buffer.from(bytes); // convert to a Node.js Buffer
      await writeFile(filePath, buffer);
    } else if (url) {
      const response = await fetch(url);
      const bytes = await response.arrayBuffer(); // binary data which represents the image
      const buffer = Buffer.from(bytes); // convert to a Node.js Buffer
      await writeFile(filePath, buffer);
    } else {
      return NextResponse.json({ error: 'No image received' }, { status: 400 });
    }

    return NextResponse.json({
      message: 'Success uploading the image',
      fileName,
      status: 201,
    });

  } catch (err) {
    return NextResponse.json({ error: `${err}` }, { status: 500 });
  }
}