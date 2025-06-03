import { NextResponse, type NextRequest } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export const POST = async (request: NextRequest) => {
  const formData = await request.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file received' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = file.name.replaceAll(" ", "_");

  try {
    await writeFile(path.join(process.cwd(), "public/uploads/" + filename), buffer);
    return NextResponse.json({ Message: "Success", status: 201 });
  } catch (err) {
    return NextResponse.json({ error: `${err}` }, { status: 500 });
  }
}