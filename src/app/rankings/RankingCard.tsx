'use client';

import { useState, useReducer } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { RankingList } from '@/app/interfaces/interfaces';
import ImageInput from '@/app/components/ImageInput';
import SubmitButton from '@/app/components/SubmitButton';
import { uploadImage } from '@/app/lib/uploadImage';
import { updateRankingList, deleteRankingList } from '@/app/actions/ranking';

interface RankingCardProps {
  userId: string;
  ranking: RankingList;
}

interface ModalState {
  showMenuModal: boolean;
  showEditModal: boolean;
  showDeleteAlert: boolean;
}

type ModalAction = { type: keyof ModalState } | { type: 'reset' };

const modalInitialState: ModalState = {
  showMenuModal: false,
  showEditModal: false,
  showDeleteAlert: false,
};

const modalReducer = (state: ModalState, action: ModalAction): ModalState => {
  if (action.type === 'reset') {
    return modalInitialState;
  }

  return { ...state, [action.type]: !state[action.type] };
};

export default function RankingCard({ userId, ranking }: RankingCardProps) {
  const [modalState, dispatch] = useReducer(modalReducer, modalInitialState);
  const [inputName, setInputName] = useState(ranking.name);
  const [inputDescription, setInputDescription] = useState(ranking.description);
  const [inputImage, setInputImage] = useState(ranking.photoUrl);

  const handleSubmit = async (formData: FormData) => {
    let inputPhotoUrl: string | null = '';

    if (inputImage === ranking.photoUrl) {
      inputPhotoUrl = ranking.photoUrl;
    } else if (inputImage.startsWith(process.env.NEXT_PUBLIC_R2_PUBLIC_URL!)) {
      inputPhotoUrl = inputImage;
    } else if (inputImage !== '') {
      inputPhotoUrl = await uploadImage(inputImage);
      if (inputPhotoUrl === null) return;
    } else {
      inputPhotoUrl = process.env.NEXT_PUBLIC_PLACEHOLDER_IMG!;
    }

    await updateRankingList(userId, formData, ranking._id, inputPhotoUrl);
    dispatch({ type: 'showEditModal' });
  };

  return (
    <div key={ranking._id} data-cy="ranking" className="relative flex flex-col bg-snowwhite rounded-sm">
      <Link href={`/ranking/${ranking._id}`}>
        <Image
          src={ranking.photoUrl}
          alt={ranking.name}
          width={500}
          height={500}
          className="aspect-square object-cover rounded-lg"
        />
      </Link>
      <div className="flex flex-col py-4">
        <div className="relative flex items-center justify-between gap-4">
          <Link href={`/ranking/${ranking._id}`}>
            <h5>{ranking.name}</h5>
          </Link>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="menu-modal-expand"
            data-cy="ranking-menu-modal-trigger"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              dispatch({ type: 'showMenuModal' });
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
            />
          </svg>
          {modalState.showMenuModal && (
            <div className="menu-modal right-0 top-8" data-cy="ranking-menu-modal">
              <button
                data-cy="edit-ranking-modal-trigger"
                className="menu-modal-item"
                onClick={() => {
                  dispatch({ type: 'showMenuModal' });
                  dispatch({ type: 'showEditModal' });
                }}
              >
                Edit
              </button>
              <button
                data-cy="delete-ranking-modal-trigger"
                className="menu-modal-item"
                onClick={() => {
                  dispatch({ type: 'showMenuModal' });
                  dispatch({ type: 'showDeleteAlert' });
                }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
        <p className="description-sm">{ranking.description}</p>
      </div>
      {modalState.showEditModal && (
        <div className="modal" data-cy="edit-ranking-modal">
          <div className="modal-inner">
            <div className="p-2 flex items-center justify-between lg:p-4">
              <h4 className="modal-heading">Edit {ranking.name}</h4>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="modal-close"
                onClick={() => dispatch({ type: 'showEditModal' })}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </div>
            <hr className="border-lightgray" />
            <form action={handleSubmit} className="px-2 py-4 flex flex-col lg:px-4">
              <label htmlFor="ranking-name">Name</label>
              <input
                id="ranking-name"
                name="ranking-name"
                type="text"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                className="w-full input"
                autoComplete="off"
              />
              <label htmlFor="ranking-description">Description</label>
              <textarea
                id="ranking-description"
                name="ranking-description"
                placeholder="Add a description for this ranking"
                value={inputDescription}
                onChange={(e) => setInputDescription(e.target.value)}
                className="input"
              />
              <ImageInput currImage={inputImage} setNewImage={(newImage) => setInputImage(newImage)} />
              <SubmitButton className="self-start" data-cy="edit-ranking-submit">
                Update
              </SubmitButton>
            </form>
          </div>
        </div>
      )}
      {modalState.showDeleteAlert && (
        <div className="modal" data-cy="delete-ranking-modal">
          <div role="alert" className="modal-alert-inner">
            <h4 className="modal-heading">Are you sure you want to delete this ranking?</h4>
            <div className="flex gap-4">
              <button
                type="button"
                data-cy="delete-ranking-button"
                className="button-primary"
                onClick={() => deleteRankingList(userId, ranking._id)}
              >
                Yes
              </button>
              <button
                type="button"
                className="button-secondary"
                onClick={() => dispatch({ type: 'showDeleteAlert' })}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
