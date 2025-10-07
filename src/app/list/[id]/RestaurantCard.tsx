'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Restaurant, Review } from '@/app/interfaces/interfaces';
import { updateReview, updateRestaurant, deleteRestaurant } from '@/app/actions/restaurant';
import getAvgRating from '@/app/lib/getAvgRating';
import RatingDisplay from '@/app/components/RatingDisplay';
import RatingSystem from '@/app/components/RatingSystem';
import ReviewCard from '@/app/components/ReviewCard';

export default function RestaurantCard({
  userId,
  isOwnerOrCollaborator,
  listId,
  restaurant,
  onUpdate,
  onDelete
}: {
  userId: string,
  isOwnerOrCollaborator: boolean,
  listId: string,
  restaurant: Restaurant,
  onUpdate: (updated: Restaurant) => void,
  onDelete: (deletedId: string) => void
}) {
  // States for modals & alerts
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Get the user's review if it exists
  const review = useMemo(() => {
    if (restaurant.reviews.length === 0) return null;
    return restaurant.reviews.find((r: Review) => r.createdBy === userId) || null;
  }, [restaurant.reviews]);

  // States for the input fields in the review modal
  const [rating, setRating] = useState<number>(review?.rating || 0);
  const [ratingHover, setRatingHover] = useState<boolean>(false);
  const [inputNote, setInputNote] = useState<string>(review?.note || '');

  return (
    <div>
      <Link key={restaurant._id} href={`/restaurant/${restaurant._id}`} data-cy="restaurant">
        <div className="flex relative p-8 border border-lightgray rounded-3xl cursor-pointer">
          <img className="aspect-square object-cover rounded-lg mr-8" src={restaurant.photoUrl} alt={restaurant.name} width={180} height={180} />
          <div className="flex flex-col flex-1 gap-2">
            <h3 className="text-xl font-semibold">{restaurant.name}</h3>
            <RatingDisplay rating={getAvgRating(restaurant.reviews)} />
            { // Display the review note if there is only one
              restaurant.reviews.length === 1 && (
                <p className="text-lg whitespace-pre-line">{restaurant.reviews[0].note}</p>
              )
            }
            { // Display the number of reviews if there are multiple
              restaurant.reviews.length > 1 && (
                <p className="w-fit text-lg hover:text-mauve transition-colors"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowAllReviews(true); }}>
                  {restaurant.reviews.length} notes
                </p>
              )
            }
          </div>
          { // Don't display menu options for anyone other than the list owner
            isOwnerOrCollaborator && (
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
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowMenuModal(false); setShowReviewModal(true); }}>
                  Review
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
      { // Modal for reviewing restaurants
        showReviewModal && (
          <div className="fixed h-full w-full inset-0 flex items-center justify-center bg-(--modal-background) z-99">
            <div className="relative px-6 py-8 w-2/5 bg-snowwhite rounded-lg">
              <div className="p-4 flex items-center justify-between">
                <h2 className="text-3xl font-semibold text-darkpink">Review {restaurant.name}</h2>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 cursor-pointer" onClick={() => { setShowReviewModal(false); }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </div>
              <hr className="border-slategray" />
              <form action={async (formData) => {
                const updatedReview = await updateReview(formData, userId, restaurant._id, rating);
                await updateRestaurant(userId, restaurant._id, updatedReview);
                onUpdate({
                  ...restaurant,
                  reviews: [
                    ...(restaurant.reviews?.filter(r => r.createdBy !== userId) || []),
                    updatedReview
                  ]
                });
                setShowReviewModal(false);
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
                    await deleteRestaurant(listId, restaurant._id);
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
      { // Modal for all reviews
        showAllReviews && (
          <div className="fixed h-full w-full inset-0 flex items-center justify-center bg-(--modal-background) z-99">
            <div className="relative px-6 py-8 w-2/5 bg-snowwhite rounded-lg">
              <div className="p-4 flex items-center justify-between">
                <h2 className="text-3xl font-semibold text-darkpink">Reviews for {restaurant.name}</h2>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 cursor-pointer" onClick={() => { setShowAllReviews(false); }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </div>
              <hr className="border-slategray" />
              <div className="mt-6 grid grid-cols-2 gap-8">
                {restaurant.reviews.map((review: Review, index: number) => (
                  <ReviewCard key={index} index={index} review={review} />
                ))}
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
}