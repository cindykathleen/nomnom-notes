'use client';

import { useState } from 'react';
import ImageInput from '@/app/components/ImageInput';
import SubmitButton from '@/app/components/SubmitButton';
import { addList } from '@/app/actions/list';
import { uploadImage } from '@/app/lib/uploadImage';

export default function ListAddCard({ userId }: { userId: string }) {
  // State for modal
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // State for the image input field in the add modal
  const [listName, setListName] = useState('');
  const [inputImage, setInputImage] = useState('');

  const formIsValid = listName.trim() !== '';

  const handleSubmit = async (formData: FormData) => {
    let inputPhotoUrl: string | null = '';

    // If the image is already uploaded, use the existing URL
    if (inputImage.startsWith(process.env.NEXT_PUBLIC_R2_PUBLIC_URL!)) {
      inputPhotoUrl = inputImage;
    }
    // If the image is new, upload it and get the URL
    else if (inputImage !== '') {
      inputPhotoUrl = await uploadImage(inputImage);
      if (inputPhotoUrl === null) return;
    }
    // If no image is provided, use a default image
    else {
      inputPhotoUrl = process.env.NEXT_PUBLIC_PLACEHOLDER_IMG!;
    }

    await addList(userId, formData, inputPhotoUrl);
    setShowAddModal(false);

    // Clear inputs
    setListName('');
    setInputImage('');
  }

  return (
    <div className="h-full flex items-start">
      <div className="add-cards"
        onClick={() => { setShowAddModal(true) }} data-cy="add-list-modal-trigger">
        <p className="text-2xl text-slategray">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-12">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </p>
      </div>
      { // Modal for creating a new list
        showAddModal && (
          <div className="modal"
            data-cy="add-list-modal">
            <div className="modal-inner">
              <div className="p-2 flex items-center justify-between lg:p-4">
                <h4 className="modal-heading">New List</h4>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="modal-close" onClick={() => { setShowAddModal(false) }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </div>
              <hr className="border-lightgray" />
              <form action={handleSubmit} className="px-2 py-4 flex flex-col lg:px-4">
                <label htmlFor="list-name">Name *</label>
                <input id="list-name" name="list-name" type="text" required value={listName} onChange={e => setListName(e.target.value)}
                  className="input" autoComplete="off" />
                <fieldset className="mb-4">
                  <legend>Visibility *</legend>
                  <label className="mr-4">
                    <input type="radio" name="list-visibility" value="private" className="mr-1" defaultChecked />Private
                  </label>
                  <label>
                    <input type="radio" name="list-visibility" value="public" className="mr-1" />Public
                  </label>
                </fieldset>
                <label htmlFor="list-description">Description</label>
                <textarea id="list-description" name="list-description" placeholder="Add a description for this list" className="input"></textarea>
                <ImageInput currImage={inputImage} setNewImage={(newImage) => setInputImage(newImage)} />
                <SubmitButton disabled={!formIsValid} className="self-start">
                  Create
                </SubmitButton>
                <p className="required">* Required fields</p>
              </form>
            </div>
          </div>
        )
      }
    </div>
  );
}
