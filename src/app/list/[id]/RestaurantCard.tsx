'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Restaurant } from '@/app/interfaces/interfaces';
import { editRestaurant, deleteRestaurant } from '@/app/actions/restaurant';
import RatingDisplay from '@/app/components/RatingDisplay';
import RatingSystem from '@/app/components/RatingSystem';

export default function RestaurantCard({
  userId,
  isOwner,
  listId,
  restaurant,
  onUpdate,
  onDelete
}: {
  userId: string,
  isOwner: boolean,
  listId: string,
  restaurant: Restaurant,
  onUpdate: (updated: Restaurant) => void,
  onDelete: (deletedId: string) => void
}) {
  // States for modals & alerts
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  // States for the input fields in the edit modal
  const [rating, setRating] = useState<number>(restaurant.rating);
  const [ratingHover, setRatingHover] = useState<boolean>(false);
  const [inputNote, setInputNote] = useState<string>(restaurant.description);

  return (
    <div>
      <Link key={restaurant._id} href={`/restaurant/${restaurant._id}`}>
        <div className="flex relative p-8 border border-lightgray rounded-3xl cursor-pointer">
          <img className="aspect-square object-cover rounded-lg mr-8" src={restaurant.photoUrl} alt={restaurant.name} width={180} height={180} />
          <div className="flex flex-col flex-1 gap-2">
            <h3 className="text-xl font-semibold">{restaurant.name}</h3>
            <RatingDisplay rating={restaurant.rating} />
            <p className="text-lg whitespace-pre-line">{restaurant.description}</p>
          </div>
          { // Don't display menu options for anyone other than the list owner
            isOwner && (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                className="size-8 cursor-pointer"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowMenuModal(!showMenuModal); }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
            )
          }
          { // Modal for menu options
            showMenuModal && (
              <div className="absolute right-8 top-16 min-w-30 p-2 flex flex-col bg-snowwhite border border-lightgray rounded-sm">
                <button
                  className="px-2 py-1 mb-2 text-left rounded-sm cursor-pointer hover:bg-lightpink"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowMenuModal(false); setShowEditModal(true); }}>
                  Edit
                </button>
                <button
                  className="px-2 py-1 text-left rounded-sm cursor-pointer hover:bg-lightpink"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowMenuModal(false); setShowDeleteAlert(true); }}>
                  Delete
                </button>
              </div>
            )
          }
        </div>
      </Link>
      { // Modal for editing restaurants
        showEditModal && (
          <div className="fixed h-full w-full inset-0 flex items-center justify-center bg-(--modal-background) z-99">
            <div className="relative px-6 py-8 w-2/5 bg-snowwhite rounded-lg">
              <div className="p-4 flex items-center justify-between">
                <h2 className="text-3xl font-semibold text-darkpink">Edit {restaurant.name}</h2>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 cursor-pointer" onClick={() => { setShowEditModal(false); }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </div>
              <hr className="border-slategray" />
              <form action={async (formData) => {
                await editRestaurant(formData, restaurant._id, rating);
                onUpdate({
                  ...restaurant,
                  rating,
                  description: inputNote,
                });
                setShowEditModal(false);
              }} className="p-4 flex flex-col">
                <label htmlFor="restaurant-rating" className="pb-1 font-semibold">Rating</label>
                <div id="restaurant-rating" className="w-fit mb-6" onMouseEnter={() => setRatingHover(true)} onMouseLeave={() => setRatingHover(false)}>
                  {ratingHover
                    ? <RatingSystem currRating={rating} setNewRating={newRating => setRating(newRating)} />
                    : <RatingDisplay rating={rating} />
                  }
                </div>
                <label htmlFor="restaurant-note" className="pb-1 font-semibold">Note</label>
                <textarea id="restaurant-note" name="restaurant-note" placeholder="Add a note for this restaurant" value={inputNote} onChange={(e) => setInputNote(e.target.value)}
                  className="px-2 py-1 border border-charcoal border-solid rounded-sm mb-6 focus:outline-none focus:border-darkpink focus:shadow-(--input-shadow)"></textarea>
                <button className="px-4 py-2 self-start text-snowwhite font-bold bg-darkpink rounded-lg cursor-pointer hover:bg-mauve transition-colors">Update</button>
              </form>
            </div>
          </div>
        )
      }
      { // Alert for deleting restaurants
        showDeleteAlert && (
          <div className="fixed h-full w-full inset-0 flex items-center justify-center bg-(--modal-background) z-99">
            <div role="alert" className="relative px-6 py-8 w-1/5 bg-snowwhite rounded-lg">
              <h3 className="mb-4 text-2xl font-semibold text-darkpink">Are you sure you want to delete this restaurant?</h3>
              <div className="flex">
                <button type="button"
                  className="px-8 py-1.5 mr-4 text-sm text-snowwhite font-semibold text-center bg-darkpink rounded-lg cursor-pointer hover:bg-mauve transition-colors"
                  onClick={async () => {
                    await deleteRestaurant(userId, listId, restaurant._id);
                    onDelete(restaurant._id);
                  }}>
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
}