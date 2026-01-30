'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { User } from '@/app/interfaces/interfaces';
import ImageInput from '@/app/components/ImageInput';
import { uploadImage } from '@/app/lib/uploadImage';
import { updateUser } from '@/app/actions/user';

export default function Profile({ user }: { user: User }) {
  const [inputName, setInputName] = useState(user.name);
  const [inputLocation, setInputLocation] = useState(user.location);
  const [inputImage, setInputImage] = useState(user.photoUrl);
  const [message, setMessage] = useState<string | null>(null);

  const { pending } = useFormStatus();

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

    const result = await updateUser(formData, user._id, inputPhotoUrl);

    if (result.error) {
      setMessage(result.error);
    } else {
      setMessage('Profile updated successfully');
    }
  }

  return (
    <div>
      <h3 className="accordion-content-heading">Update your profile</h3>
      <hr className="hidden border-lightgray xl:block" />
      <form onSubmit={handleSubmit} className="max-w-[700px] pt-2 flex flex-col xl:pt-8">
        <label htmlFor="user-name" className="pb-1 font-semibold">Display name</label>
        <input id="user-name" name="user-name" type="text" value={inputName} onChange={(e) => setInputName(e.target.value)}
          className="w-full input" autoComplete="off" />
        <label htmlFor="user-location" className="pb-1 font-semibold">Location</label>
        <input id="user-location" name="user-location" type="text" value={inputLocation} onChange={(e) => setInputLocation(e.target.value)}
          className="w-full input" placeholder="City, State/Country" autoComplete="off" />
        <ImageInput currImage={inputImage} setNewImage={(newImage) => setInputImage(newImage)} />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <button type="submit" className="button-primary">
            {pending
              ? (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="block m-auto size-6 animate-spin" >
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>)
              : ("Update")
            }
          </button>
          { // Display a message if it exists
            message && (
              <p className="font-semibold">{message}</p>
            )
          }
        </div>
      </form>
    </div>

  );
}