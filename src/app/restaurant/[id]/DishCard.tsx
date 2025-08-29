'use client';

import { useState, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import type { Identifier, XYCoord } from 'dnd-core';
import { Restaurant, Dish } from '@/app/interfaces/interfaces';
import RatingDisplay from '@/app/components/RatingDisplay';
import RatingSystem from '@/app/components/RatingSystem';
import ImageInput from '@/app/components/ImageInput';
import { uploadImage } from '@/app/lib/uploadImage';
import { updateDish, deleteDish, moveDish } from '@/app/actions/dish';

interface DragItem {
  index: number;
}

export default function DishCard({ isOwner, restaurant, dish }: { isOwner: boolean, restaurant: Restaurant, dish: Dish }) {
  // States for modals & alerts
  const [showMenuModal, setShowMenuModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);

  // States for the input fields in the edit modal
  const [inputName, setInputName] = useState<string>(dish.name);
  const [rating, setRating] = useState<number>(dish.rating);
  const [ratingHover, setRatingHover] = useState<boolean>(false);
  const [inputNote, setInputNote] = useState<string>(dish.note);
  const [inputImage, setInputImage] = useState<string>(dish.photoUrl || '');

  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
    accept: "dish",
    // A collecting function that keeps track of the drop target/zone
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId()
      }
    },
    hover(item: DragItem, monitor) {
      // Checking to make sure ref is not null
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = dish.index;

      // Don't call moveList if the item is hovering over itself
      if (dragIndex === hoverIndex) {
        return;
      }

      // Get the bounding rect of the hovered item
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      // Get the middle of the hovered item
      const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
      // Get the mouse position
      const clientOffset = monitor.getClientOffset();
      // Get the pixels to the left
      const hoverClientX = (clientOffset as XYCoord).x - hoverBoundingRect.left;

      // Don't call moveList if the item did not pass the middle while dragging to the right
      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
        return;
      }
      // Don't call moveList if the item did not pass the middle while dragging to the left
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
        return;
      }

      moveDish(dragIndex, hoverIndex);
      item.index = hoverIndex;
    }
  })

  const [{ isDragging }, drag] = useDrag({
    type: "dish",
    item: () => {
      return { id: dish._id, index: dish.index }
    },
    // A collecting function that keeps track of the dragging state
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging()
    }),
  })

  // Setting ref to act as both a drag source and a drop target
  drag(drop(ref));

  return (
    <div key={dish._id} {...(isOwner ? { ref, "data-handler-id": handlerId } : {})}
      className="flex flex-col relative bg-snowwhite rounded-sm">
      <img src={dish.photoUrl} alt={dish.name} className="aspect-square object-cover rounded-lg" />
      <div className="flex flex-col gap-2 py-4">
        <div className="flex justify-between relative">
          <h3 className="text-xl font-semibold">{dish.name}</h3>
          { // Don't display menu options for anyone other than the list owner
            isOwner && (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                className="ml-4 size-8 cursor-pointer"
                onClick={() => setShowMenuModal(!showMenuModal)}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
            )
          }
          { // Modal for menu options
            showMenuModal && (
              <div className="absolute right-0 top-8 min-w-30 p-2 flex flex-col bg-snowwhite border border-lightgray rounded-sm">
                <button
                  className="px-2 py-1 mb-2 text-left rounded-sm cursor-pointer hover:bg-lightpink"
                  onClick={() => { setShowMenuModal(false); setShowEditModal(true); }}>
                  Edit
                </button>
                <button
                  className="px-2 py-1 text-left rounded-sm cursor-pointer hover:bg-lightpink"
                  onClick={() => { setShowMenuModal(false); setShowDeleteAlert(true); }}>
                  Delete
                </button>
              </div>
            )
          }
        </div>
        <RatingDisplay rating={dish.rating} />
        <p className="whitespace-pre-line">{dish.note}</p>
      </div>
      { // Modal for editing a dish
        showEditModal && (
          <div className="fixed h-full w-full inset-0 flex items-center justify-center bg-(--modal-background) z-99">
            <div className="relative px-6 py-8 w-2/5 bg-snowwhite rounded-lg">
              <div className="p-4 flex items-center justify-between">
                <h2 className="text-3xl font-semibold text-darkpink">Edit {dish.name}</h2>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 cursor-pointer" onClick={() => setShowEditModal(false)}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </div>
              <hr className="border-gray-300" />
              <form action={async (formData) => {
                let inputPhotoId: string | null = '';

                if (inputImage === dish.photoUrl) {
                  // If there is no change to the image, don't re-upload it into the database
                  inputPhotoId = inputImage.split('=')[1];
                } else if (inputImage !== '') {
                  inputPhotoId = await uploadImage(inputImage);
                  if (inputPhotoId === null) return;
                } else {
                  // If no image is provided, use a default image
                  inputPhotoId = process.env.NEXT_PUBLIC_PLACEHOLDER_IMG!;
                }

                await updateDish(formData, dish._id, rating, inputPhotoId);
                setShowEditModal(false);
              }} className="p-4 flex flex-col">
                <label htmlFor="dish-name" className="pb-1 font-semibold">Name</label>
                <input id="dish-name" name="dish-name" type="text" value={inputName} onChange={(e) => setInputName(e.target.value)}
                  className="w-full px-2 py-1 mb-6 border border-charcoal rounded-sm focus:outline-none focus:border-darkpink focus:shadow-(--input-shadow)" autoComplete="off" />
                <label htmlFor="dish-rating" className="pb-1 font-semibold">Rating</label>
                <div id="dish-rating" className="w-fit mb-6" onMouseEnter={() => setRatingHover(true)} onMouseLeave={() => setRatingHover(false)}>
                  {ratingHover
                    ? <RatingSystem currRating={rating} setNewRating={newRating => setRating(newRating)} />
                    : <RatingDisplay rating={rating} />
                  }
                </div>
                <label htmlFor="dish-note" className="pb-1 font-semibold">Note</label>
                <textarea id="dish-note" name="dish-note" placeholder="Add a note for this dish" value={inputNote} onChange={(e) => setInputNote(e.target.value)}
                  className="px-2 py-1 mb-6 border border-charcoal rounded-sm focus:outline-none focus:border-darkpink focus:shadow-(--input-shadow)"></textarea>
                <ImageInput currImage={inputImage} setNewImage={(newImage) => setInputImage(newImage)} />
                <button type="submit" className="px-4 py-2 self-start text-snowwhite font-bold bg-darkpink rounded-lg cursor-pointer hover:bg-mauve transition-colors">
                  Update
                </button>
              </form>
            </div>
          </div>
        )
      }
      { // Alert for deleting a dish
        showDeleteAlert && (
          <div className="fixed h-full w-full inset-0 flex items-center justify-center bg-(--modal-background) z-99">
            <div role="alert" className="relative px-6 py-8 w-1/5 bg-snowwhite rounded-lg">
              <h3 className="mb-4 text-2xl font-semibold text-darkpink">Are you sure you want to delete this dish?</h3>
              <div className="flex">
                <button type="button"
                  className="px-8 py-1.5 mr-4 text-sm text-snowwhite font-semibold text-center bg-darkpink rounded-lg cursor-pointer hover:bg-mauve transition-colors"
                  onClick={() => { deleteDish(restaurant._id, dish._id) }}>
                  Yes
                </button>
                <button type="button"
                  className="px-8 py-1.5 text-sm text-darkpink font-semibold text-center bg-transparent border border-darkpink rounded-lg cursor-pointer hover:text-mauve hover:border-mauve transition-colors"
                  onClick={() => { setShowDeleteAlert(false) }}>
                  No
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
};