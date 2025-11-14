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
        ? <label className="font-semibold">
            Image (<span className="link" onClick={() => setShowUploadInput(false)} data-cy="image-input-type-trigger">use an existing image</span>)</label>
        : <label className="font-semibold">Image (<span className="link" onClick={() => setShowUploadInput(true)} data-cy="image-input-type-trigger">upload your own</span>)</label>
      }
      {previewImage !== '' && (
        <img src={previewImage} className="max-w-36 mb-1 aspect-square object-contain" />
      )}
      {showUploadInput
        ? <input name="img-file" key="file-input" type="file" accept="image/*" className="input-file" onChange={handleFileChange} />
        : <input name="img-url" key="url-input" type="text" placeholder="Add image URL here" className="input" autoComplete="off"
          value={currImage} onChange={(e) => setNewImage(e.target.value)} onBlur={(e) => setPreviewImage(e.target.value)} />
      }
    </div>
  );
}