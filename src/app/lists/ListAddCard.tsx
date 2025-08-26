'use client';

import { useState } from 'react';
import ImageInput from '@/app/components/ImageInput';
import { addList } from '@/app/actions/list';
import { uploadImage } from '@/app/lib/uploadImage';

export default function ListAddCard({ userId }: { userId: string }) {
  // State for modal
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // State for the image input field in the add modal
  const [inputImage, setInputImage] = useState('');

  return (
    <div className="h-full flex items-start">
      <div className="w-full flex items-center justify-center bg-lightgray aspect-square rounded-lg cursor-pointer"
        onClick={() => { setShowAddModal(true) }}>
        <p className="text-2xl text-slategray">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-12">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </p>
      </div>
      { // Modal for creating a new list
        showAddModal && (
          <div className="fixed h-full w-full inset-0 flex items-center justify-center bg-(--modal-background) z-99">
            <div className="relative w-2/5 px-6 py-8  bg-snowwhite rounded-lg">
              <div className="p-4 flex items-center justify-between">
                <h2 className="text-3xl font-semibold text-darkpink">New list</h2>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 cursor-pointer" onClick={() => { setShowAddModal(false) }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </div>
              <hr className="border-slategray" />
              <form action={async (formData) => {
                let inputPhotoId: string | null = '';

                if (inputImage !== '') {
                  inputPhotoId = await uploadImage(inputImage);
                  if (inputPhotoId === null) return;
                } else {
                  // If no image is provided, use a default image
                  inputPhotoId = process.env.NEXT_PUBLIC_PLACEHOLDER_IMG!;
                }

                await addList(userId, formData, inputPhotoId);
                setShowAddModal(false);
              }} className="p-4 flex flex-col">
                <label htmlFor="list-name" className="pb-1 font-semibold">Name</label>
                <input id="list-name" name="list-name" type="text"
                  className="px-2 py-1 mb-6 border border-charcoal rounded-sm focus:outline-none focus:border-darkpink focus:shadow-(--input-shadow)" autoComplete="off" />
                <label htmlFor="list-description" className="pb-1 font-semibold">Description</label>
                <textarea id="list-description" name="list-description" placeholder="Add a description for this list"
                  className="px-2 py-1 mb-6 border border-charcoal rounded-sm focus:outline-none focus:border-darkpink focus:shadow-(--input-shadow)"></textarea>
                <ImageInput currImage={inputImage} setNewImage={(newImage) => setInputImage(newImage)} />
                <button type="submit" className="px-4 py-2 self-start text-snowwhite font-bold bg-darkpink rounded-lg cursor-pointer hover:bg-mauve transition-colors">Create</button>
              </form>
            </div>
          </div>
        )
      }
    </div>
  );
}