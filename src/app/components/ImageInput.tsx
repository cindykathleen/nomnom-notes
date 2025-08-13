'use client';

import { useState } from 'react';

export default function ImageInput({ currImage, setNewImage }: { currImage: string, setNewImage: (newImage: string) => void }) {
  const [showUploadInput, setShowUploadInput] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>(currImage);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);

    setPreviewImage(fileUrl);
    setNewImage(fileUrl);
  };

  return (
    <div className="flex flex-col gap-2">
      {showUploadInput
        ? <label className="font-semibold">Image (<span className="text-darkpink cursor-pointer hover:text-mauve transition-colors" onClick={() => setShowUploadInput(false)}>use an existing image</span>)</label>
        : <label className="font-semibold">Image (<span className="text-darkpink cursor-pointer hover:text-mauve transition-colors" onClick={() => setShowUploadInput(true)}>upload your own</span>)</label>
      }
      {previewImage !== '' && (
        <img src={previewImage} className="max-w-36 mb-1 aspect-square object-contain" />
      )}
      {showUploadInput
        ? <input key="file-input" type="file" accept="image/*"
          className="mb-6 file:px-3 file:py-1 file:mr-2 file:font-semibold file:border file:border-charcoal file:rounded-lg file:cursor-pointer"
          onChange={handleFileChange} />
        : <input key="url-input" type="text" placeholder="Add image URL here"
          value={currImage} onChange={(e) => setNewImage(e.target.value)} onBlur={(e) => setPreviewImage(e.target.value)}
          className="w-full px-2 py-1 mb-6 border border-charcoal border-solid rounded-sm focus:outline-none focus:border-darkpink focus:shadow-(--input-shadow)" autoComplete="off" />
      }
    </div>
  );
}