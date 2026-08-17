'use client';

import { useState } from 'react';
import ImageInput from '@/app/components/ImageInput';
import SubmitButton from '@/app/components/SubmitButton';
import { createRankingList } from '@/app/actions/ranking';
import { uploadImage } from '@/app/lib/uploadImage';

export default function RankingAddCard({ userId }: { userId: string }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [rankingName, setRankingName] = useState('');
  const [inputImage, setInputImage] = useState('');

  const formIsValid = rankingName.trim() !== '';

  const handleSubmit = async (formData: FormData) => {
    let inputPhotoUrl: string | null = '';

    if (inputImage.startsWith(process.env.NEXT_PUBLIC_R2_PUBLIC_URL!)) {
      inputPhotoUrl = inputImage;
    } else if (inputImage !== '') {
      inputPhotoUrl = await uploadImage(inputImage);
      if (inputPhotoUrl === null) return;
    } else {
      inputPhotoUrl = process.env.NEXT_PUBLIC_PLACEHOLDER_IMG!;
    }

    await createRankingList(userId, formData, inputPhotoUrl);
    setShowAddModal(false);
    setRankingName('');
    setInputImage('');
  };

  return (
    <div className="h-full flex items-start">
      <div
        className="w-full flex items-center justify-center bg-lightgray aspect-square rounded-lg cursor-pointer"
        onClick={() => setShowAddModal(true)}
        data-cy="add-ranking-modal-trigger"
      >
        <p className="text-2xl text-slategray">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-12">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </p>
      </div>
      {showAddModal && (
        <div className="modal" data-cy="add-ranking-modal">
          <div className="modal-inner">
            <div className="p-2 flex items-center justify-between lg:p-4">
              <h4 className="modal-heading">New Ranking</h4>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="modal-close"
                onClick={() => setShowAddModal(false)}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </div>
            <hr className="border-lightgray" />
            <form action={handleSubmit} className="px-2 py-4 flex flex-col lg:px-4">
              <label htmlFor="ranking-name">Name *</label>
              <input
                id="ranking-name"
                name="ranking-name"
                type="text"
                required
                value={rankingName}
                onChange={(e) => setRankingName(e.target.value)}
                className="input"
                autoComplete="off"
              />
              <label htmlFor="ranking-description">Description</label>
              <textarea
                id="ranking-description"
                name="ranking-description"
                placeholder="Add a description for this ranking"
                className="input"
              />
              <ImageInput currImage={inputImage} setNewImage={(newImage) => setInputImage(newImage)} />
              <SubmitButton disabled={!formIsValid} className="self-start">
                Create
              </SubmitButton>
              <p className="required">* Required fields</p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
