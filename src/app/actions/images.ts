'use server';

import { db } from '@/app/lib/database';
import { v4 as uuidv4 } from 'uuid';
import { getPhoto } from '@/app/lib/GooglePhotosAPI';

export const addPhoto = async (formData: FormData) => {
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
      return null;
    }

    return fileName;

  } catch (err) {
    return null;
  }
}

export const getGooglePhoto = async (photoId: string) => {
  // Get the photo URL from the Google Photos API first 
  // Then upload the photo into the database
  // And use the new, unique photoId (file name) provided
  try {
    const googlePhotoURL = await getPhoto(photoId!);

    const formData = new FormData();
    formData.append('url', googlePhotoURL);

    const fileName = await addPhoto(formData);

    if (!fileName) {
      return null;
    }

    return fileName;
  } catch (err) {
    return null;
  }
}