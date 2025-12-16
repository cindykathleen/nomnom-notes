'use client';

import { useState } from 'react';
import { addDish } from '@/app/actions/dish'
import ImageInput from '@/app/components/ImageInput';
import { uploadImage } from '@/app/lib/uploadImage';

export default function DishAddCard({ userId, restaurantId }: { userId: string, restaurantId: string }) {
  // State for modal
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // States for the input fields in the add modal
  const [dishName, setDishName] = useState('');
  const [inputImage, setInputImage] = useState('');

  const formIsValid = dishName.trim() !== '';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    let inputPhotoUrl: string | null = '';

    if (inputImage !== '') {
      inputPhotoUrl = await uploadImage(inputImage);
      if (inputPhotoUrl === null) return;
    } else {
      // If no image is provided, use a default image
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
                <label htmlFor="dish-name" className="pb-1 font-semibold">Name</label>
                <input id="dish-name" name="dish-name" type="text" required value={dishName} onChange={e => setDishName(e.target.value)}
                  className="input" autoComplete="off" />
                <ImageInput currImage={inputImage} setNewImage={(newImage) => setInputImage(newImage)} />
                <button type="submit" disabled={!formIsValid}
                  className={`px-4 py-2 self-start text-snowwhite font-bold rounded-lg
                  ${!formIsValid
                      ? 'bg-lightgray cursor-not-allowed'
                      : 'bg-darkpink cursor-pointer hover:bg-mauve transition-colors'
                    }`}>
                  Add
                </button>
              </form>
            </div>
          </div>
        )
      }
    </div>
  );
}