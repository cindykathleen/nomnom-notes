import { useState } from 'react';

interface Props {
  currImage: string;
  setNewImage: (newImage: string) => void;
}

export const UploadImage: React.FC<Props> = ({ currImage, setNewImage }) => {
  const [showUploadInput, setShowUploadInput] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>(currImage);

  const handleClick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const formData = new FormData();
      formData.append('file', e.target.files[0]);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(`${response.status} - ${JSON.stringify(data)}`);
        return;
      }

      setPreviewImage(`/uploads/${e.target.files[0].name.replaceAll(" ", "_")}`);
      setNewImage(`/uploads/${e.target.files[0].name.replaceAll(" ", "_")}`);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {showUploadInput
        ? <label className="font-semibold">Image (<span className="underline cursor-pointer hover:text-blue-900" onClick={() => setShowUploadInput(false)}>use an existing image</span>)</label>
        : <label className="font-semibold">Image (<span className="underline cursor-pointer hover:text-blue-900" onClick={() => setShowUploadInput(true)}>upload your own</span>)</label>
      }
      {previewImage !== '' && (
        <img src={previewImage} className="max-w-48 mb-1" />
      )}
      {showUploadInput
        ? <input key="file-input" type="file" accept="image/*"
          className="mb-6 file:px-3 file:py-1 file:mr-2 file:font-semibold file:border file:border-blue-900 file:rounded-lg file:cursor-pointer"
          onChange={handleClick} />
        : <input key="url-input" type="text" placeholder="Add image URL here"
          value={currImage} onChange={(e) => setNewImage(e.target.value)} onBlur={(e) => setPreviewImage(e.target.value)}
          className="w-full px-2 py-1 mb-6 border border-black border-solid rounded-sm focus:outline-none focus:border-blue-900 focus:shadow-(--input-shadow)" autoComplete="off" />
      }
    </div>
  );
}