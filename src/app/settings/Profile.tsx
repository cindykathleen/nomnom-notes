'use client';

import { useState } from 'react';
import { User } from '@/app/interfaces/interfaces';
import ImageInput from '@/app/components/ImageInput';
import { uploadImage } from '@/app/lib/uploadImage';
import { updateUser } from '@/app/actions/user';

export default function Profile({ user }: { user: User }) {
  // States for the input fields
  const [inputName, setInputName] = useState(user.name);
  const [inputLocation, setInputLocation] = useState(user.location);
  const [inputImage, setInputImage] = useState(user.photoUrl);

  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    let inputPhotoUrl: string | null = '';

    // If there is no change to the image, don't re-upload it into the database
    if (inputImage === user.photoUrl) {
      inputPhotoUrl = user.photoUrl;
    }
    // If the image is already uploaded, use the existing URL
    else if (inputImage.startsWith(process.env.NEXT_PUBLIC_R2_PUBLIC_URL!)) {
      inputPhotoUrl = inputImage;
    }
    // If the image is new, upload it and get the URL
    else if (inputImage !== '') {
      inputPhotoUrl = await uploadImage(inputImage);
      if (inputPhotoUrl === null) return;
    }
    // If no image is provided, use a default image
    else {
      inputPhotoUrl = process.env.NEXT_PUBLIC_PLACEHOLDER_IMG_AVATAR!;
    }

    await updateUser(formData, user._id, inputPhotoUrl);
  }

  return (
    <div>
      <h3 className="accordion-content-heading">Profile</h3>
      <hr className="hidden border-lightgray xl:block" />
      <form onSubmit={handleSubmit} className="max-w-[700px] pt-2 flex flex-col xl:pt-8">
        <label htmlFor="user-name" className="pb-1 font-semibold">Display name</label>
        <input id="user-name" name="user-name" type="text" value={inputName} onChange={(e) => setInputName(e.target.value)}
          className="w-full input" placeholder="City, State/Country" autoComplete="off" />
        <label htmlFor="user-location" className="pb-1 font-semibold">Location</label>
        <input id="user-location" name="user-location" type="text" value={inputLocation} onChange={(e) => setInputLocation(e.target.value)}
          className="w-full input" autoComplete="off" />
        <ImageInput currImage={inputImage} setNewImage={(newImage) => setInputImage(newImage)} />
        <button type="submit" className="button-primary" data-cy="edit-list-submit">
          Update
        </button>
      </form>
    </div>

  );
}