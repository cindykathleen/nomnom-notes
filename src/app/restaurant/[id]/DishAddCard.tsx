'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { addDish } from '@/app/actions/dish'
import { addPhotoToUser } from '@/app/actions/user';
import ImageInput from '@/app/components/ImageInput';
import { uploadImage } from '@/app/lib/uploadImage';

export default function DishAddCard({ userId, restaurantId }: { userId: string, restaurantId: string }) {
  // State for modal
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // States for the input fields in the add modal
  const [dishName, setDishName] = useState('');
  const [inputImage, setInputImage] = useState('');

  const { pending } = useFormStatus();
  const formIsValid = dishName.trim() !== '';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    let inputPhotoUrl: string | null = '';

    // If the image is already uploaded, use the existing URL
    if (inputImage.startsWith(process.env.NEXT_PUBLIC_R2_PUBLIC_URL!)) {
      inputPhotoUrl = inputImage;
    }
    // If the image is new, upload it and get the URL
    else if (inputImage !== '') {
      inputPhotoUrl = await uploadImage(inputImage);
      if (inputPhotoUrl === null) return;
      await addPhotoToUser(userId, inputPhotoUrl);
    }
    // If no image is provided, use a default image
    else {
      inputPhotoUrl = process.env.NEXT_PUBLIC_PLACEHOLDER_IMG!;
    }

    await addDish(formData, restaurantId, inputPhotoUrl);
    setShowAddModal(false);

    // Clear inputs
    setDishName('');
    setInputImage('');
  }

  return (
    <div className="h-full flex items-start">
      <div className="w-full flex items-center justify-center bg-lightgray aspect-square rounded-lg cursor-pointer"
        onClick={() => { setShowAddModal(true) }} data-cy="add-dish-modal-trigger">
        <p className="text-2xl text-slategray">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-12">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </p>
      </div>
      { // Modal for creating a new list
        showAddModal && (
          <div className="modal" data-cy="add-dish-modal">
            <div className="modal-inner">
              <div className="p-4 flex items-center justify-between">
                <h2 className="modal-heading">Add a dish</h2>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 cursor-pointer lg:size-8" onClick={() => { setShowAddModal(false) }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </div>
              <hr className="border-slategray" />
              <form onSubmit={handleSubmit} className="p-4 flex flex-col">
                <label htmlFor="dish-name" className="pb-1 font-semibold">Name *</label>
                <input id="dish-name" name="dish-name" type="text" required value={dishName} onChange={e => setDishName(e.target.value)}
                  className="input" autoComplete="off" />
                <ImageInput currImage={inputImage} setNewImage={(newImage) => setInputImage(newImage)} />
                <button type="submit" disabled={!formIsValid}
                  className={`px-4 py-2 self-start text-snowwhite font-bold rounded-lg
                  ${!formIsValid
                      ? 'bg-lightgray cursor-not-allowed'
                      : 'bg-darkpink cursor-pointer hover:bg-mauve transition-colors'
                    }`}>
                  {pending
                    ? (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="block m-auto size-6 animate-spin" >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>)
                    : ("Add")
                  }
                </button>
                <p className="mt-6 text-sm font-semibold">* Required fields</p>
              </form>
            </div>
          </div>
        )
      }
    </div>
  );
}