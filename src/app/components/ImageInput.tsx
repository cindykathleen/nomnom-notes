'use client';

import { useState } from 'react';
import imageCompression from 'browser-image-compression';

export default function ImageInput({ currImage, setNewImage }: { currImage: string, setNewImage: (newImage: string) => void }) {
  const [previewImage, setPreviewImage] = useState<string>(currImage);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Compress the uploaded image
    const options = {
      maxWidthOrHeight: 600,
      useWebWorker: true,
    }

    const compressedFile = await imageCompression(file, options);

    const fileUrl = URL.createObjectURL(compressedFile);

    setPreviewImage(fileUrl);
    setNewImage(fileUrl);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="font-semibold">Image</label>
      {previewImage !== '' && (
        <img src={previewImage} alt="Preview image" className="max-w-36 mb-1 aspect-square object-contain" />
      )}
      <div className="flex flex-col gap-2 mb-6">
        <input name="img-file" key="file-input" type="file" accept="image/*" className="input-file" onChange={handleFileChange} />
        <p className="text-small text-slategray">Maximum file size: 10 MB</p>
      </div>
    </div>
  );
}