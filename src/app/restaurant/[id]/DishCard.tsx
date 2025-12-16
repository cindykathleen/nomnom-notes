'use client';

import { useState, useMemo, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import type { Identifier, XYCoord } from 'dnd-core';
import Image from 'next/image';
import { Restaurant, Dish, Review } from '@/app/interfaces/interfaces';
import getAvgRating from '@/app/lib/getAvgRating';
import RatingDisplay from '@/app/components/RatingDisplay';
import RatingSystem from '@/app/components/RatingSystem';
import ImageInput from '@/app/components/ImageInput';
import { uploadImage } from '@/app/lib/uploadImage';
import { updateDish, updateReview, deleteDish, moveDish } from '@/app/actions/dish';
import ReviewCard from '@/app/components/ReviewCard';

interface DragItem {
  index: number;
}

export default function DishCard({
  userId, isOwnerOrCollaborator, restaurant, dish
}: {
  userId: string, isOwnerOrCollaborator: boolean, restaurant: Restaurant, dish: Dish
}) {
  // States for modals & alerts
  const [showMenuModal, setShowMenuModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Get the user's review if it exists
  const review = useMemo(() => {
    if (dish.reviews.length === 0) return null;
    return dish.reviews.find((r: Review) => r.createdBy === userId) || null;
  }, [dish.reviews]);

  // States for the input fields in the edit & review modals
  const [inputName, setInputName] = useState<string>(dish.name);
  const [rating, setRating] = useState<number>(review?.rating || 0);
  const [ratingHover, setRatingHover] = useState<boolean>(false);
  const [inputNote, setInputNote] = useState<string>(review?.note || '');
  const [inputImage, setInputImage] = useState<string>(dish.photoUrl || '');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    let inputPhotoUrl: string | null = '';

    if (inputImage === dish.photoUrl) {
      // If there is no change to the image, don't re-upload it into the database
      inputPhotoUrl = dish.photoUrl;
    } else if (inputImage !== '') {
      inputPhotoUrl = await uploadImage(inputImage);
      if (inputPhotoUrl === null) return;
    } else {
      // If no image is provided, use a default image
      inputPhotoUrl = process.env.NEXT_PUBLIC_PLACEHOLDER_IMG!;
    }

    await updateDish(formData, dish._id, inputPhotoUrl);
    setShowEditModal(false);
  }

  const handleReviewSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    await updateReview(formData, userId, dish._id, rating);
    setShowReviewModal(false);
  }

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

      // Don't call moveDish if the item is hovering over itself
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

      // Don't call moveDish if the item did not pass the middle while dragging to the right
      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
        return;
      }
      // Don't call moveDish if the item did not pass the middle while dragging to the left
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
    <div key={dish._id} {...(isOwnerOrCollaborator ? { ref, "data-handler-id": handlerId } : {})}
      className="flex flex-col relative bg-snowwhite rounded-sm" data-cy="dish">
      <Image src={dish.photoUrl} alt={dish.name} width={500} height={500} className="aspect-square object-cover rounded-lg" />
      <div className="flex flex-col gap-2 p-4">
        <div className="relative flex justify-between gap-4">
          <h3 className="text-xl font-semibold">{dish.name}</h3>
          { // Don't display menu options for anyone other than the list owner / collaborator
            isOwnerOrCollaborator && (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                className="size-9 cursor-pointer" data-cy="dish-menu-modal-trigger"
                onClick={() => setShowMenuModal(!showMenuModal)}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
            )
          }
          { // Modal for menu options
            showMenuModal && (
              <div className="menu-modal right-0 top-8" data-cy="dish-menu-modal">
                <button data-cy="edit-dish-modal-trigger" className="menu-modal-item"
                  onClick={() => { setShowMenuModal(false); setShowEditModal(true); }}
                >
                  Edit
                </button>
                <button data-cy="review-dish-modal-trigger" className="menu-modal-item"
                  onClick={() => { setShowMenuModal(false); setShowReviewModal(true); }}
                >
                  Review
                </button>
                <button data-cy="delete-dish-modal-trigger" className="menu-modal-item"
                  onClick={() => { setShowMenuModal(false); setShowDeleteAlert(true); }}
                >
                  Delete
                </button>
              </div>
            )
          }
        </div>
        <RatingDisplay rating={getAvgRating(dish.reviews)} />
        { // Display the review note if there is only one
          dish.reviews.length === 1 && (
            <p className="whitespace-pre-line">{dish.reviews[0].note}</p>
          )
        }
        { // Display the number of reviews if there are multiple
          dish.reviews.length > 1 && (
            <p className="w-fit whitespace-pre-line cursor-pointer hover:text-mauve transition-colors"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowAllReviews(true); }}>
              {dish.reviews.length} notes
            </p>
          )
        }
      </div>
      { // Modal for editing a dish
        showEditModal && (
          <div className="modal" data-cy="edit-dish-modal">
            <div className="modal-inner">
              <div className="p-4 flex items-center justify-between">
                <h2 className="modal-heading">Edit the dish</h2>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 cursor-pointer lg:size-8" onClick={() => setShowEditModal(false)}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </div>
              <hr className="border-gray-300" />
              <form onSubmit={handleSubmit} className="p-4 flex flex-col">
                <label htmlFor="dish-name" className="pb-1 font-semibold">Name</label>
                <input id="dish-name" name="dish-name" type="text" value={inputName} onChange={(e) => setInputName(e.target.value)}
                  className="w-full input" autoComplete="off" />
                <ImageInput currImage={inputImage} setNewImage={(newImage) => setInputImage(newImage)} />
                <button type="submit" className="button-primary" data-cy="edit-dish-submit">
                  Update
                </button>
              </form>
            </div>
          </div>
        )
      }
      { // Modal for reviewing a dish
        showReviewModal && (
          <div className="modal" data-cy="review-dish-modal">
            <div className="modal-inner">
              <div className="p-4 flex items-center justify-between">
                <h2 className="modal-heading">Review the dish</h2>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 cursor-pointer lg:size-8" onClick={() => setShowReviewModal(false)}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </div>
              <hr className="border-gray-300" />
              <form onSubmit={handleReviewSubmit} className="p-4 flex flex-col">
                <label htmlFor="dish-rating" className="pb-1 font-semibold">Rating</label>
                <div id="dish-rating" className="w-fit mb-6" onMouseEnter={() => setRatingHover(true)} onMouseLeave={() => setRatingHover(false)}>
                  {ratingHover
                    ? <RatingSystem currRating={rating} setNewRating={newRating => setRating(newRating)} />
                    : <RatingDisplay rating={rating} />
                  }
                </div>
                <label htmlFor="dish-note" className="pb-1 font-semibold">Note</label>
                <textarea id="dish-note" name="dish-note" placeholder="Add a note for this dish" value={inputNote} onChange={(e) => setInputNote(e.target.value)}
                  className="input"></textarea>
                <button type="submit" className="button-primary" data-cy="add-review-submit">
                  Update
                </button>
              </form>
            </div>
          </div>
        )
      }
      { // Alert for deleting a dish
        showDeleteAlert && (
          <div className="modal" data-cy="delete-dish-modal">
            <div role="alert" className="modal-alert-inner">
              <h3 className="modal-alert-heading">Are you sure you want to delete this dish?</h3>
              <div className="flex gap-4">
                <button type="button" data-cy="delete-dish-button" className="button-primary" onClick={() => { deleteDish(restaurant._id, dish._id) }}>
                  Yes
                </button>
                <button type="button" className="button-secondary" onClick={() => { setShowDeleteAlert(false) }}>
                  No
                </button>
              </div>
            </div>
          </div>
        )
      }
      { // Modal for all reviews
        showAllReviews && (
          <div className="modal">
            <div className="modal-inner">
              <div className="p-4 flex items-center justify-between gap-2">
                <h2 className="modal-heading">Reviews for {dish.name}</h2>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 cursor-pointer lg:size-8" onClick={() => { setShowAllReviews(false); }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </div>
              <hr className="border-slategray" />
              <div className="review-cards">
                {dish.reviews.map((review: Review, index: number) => (
                  <ReviewCard key={index} index={index} review={review} />
                ))}
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
};