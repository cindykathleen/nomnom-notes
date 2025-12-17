'use server';

import { v4 as uuidv4 } from 'uuid';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { r2 } from '@/app/lib/r2';
import { getPhoto } from '@/app/lib/GooglePhotosAPI';

export const addPhoto = async (formData: FormData): Promise<string | null> => {
  const file = formData.get('file') as File | null;
  const url = formData.get('url') as string | null;

  if (!file && !url) return null;

  try {
    let buffer: Buffer;
    let contentType: string;
    let extension: string;

    if (file) {
      const bytes = await file.arrayBuffer(); // binary data which represents the image
      buffer = Buffer.from(bytes); // convert to a Node.js Buffer
      contentType = file.type;
      extension = file.type.split('/')[1] ?? 'jpg';
    } else {
      const response = await fetch(url!);
      const bytes = await response.arrayBuffer(); // binary data which represents the image
      buffer = Buffer.from(bytes); // convert to a Node.js Buffer
      contentType = response.headers.get('content-type') ?? 'image/jpeg';
      extension = contentType.split('/')[1] ?? 'jpg';
    }

    const id = uuidv4();
    const key = `${id}.${extension}`;

    await r2.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        CacheControl: "public, max-age=31536000, immutable",
      })
    );

    return `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`;
  } catch (err) {
    console.error('Error uploading image to R2:', err);
    return null;
  }
}

export const getGooglePhoto = async (photoUrl: string) => {
  // Get the photo URL from the Google Photos API first 
  // Then upload the photo into the database
  // And use the new, unique photoUrl provided
  try {
    const googlePhotoURL = await getPhoto(photoUrl!);

    const formData = new FormData();
    formData.append('url', googlePhotoURL);

    const imageUrlFromR2 = await addPhoto(formData);

    if (!imageUrlFromR2) {
      return null;
    }

    return imageUrlFromR2;
  } catch (err) {
    console.error('Error getting Google photo and uploading image to R2:', err);
    return null;
  }
}