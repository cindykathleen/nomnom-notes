'use client';

import { useMemo, useState, useEffect } from 'react';
import { Restaurant, Review } from '@/app/interfaces/interfaces';
import { updateReview, updateRestaurant } from '@/app/actions/restaurant';
import RatingSystem from '@/app/components/RatingSystem';
import RatingDisplay from '@/app/components/RatingDisplay';

export default function RestaurantReview({ userId, restaurant }: { userId: string, restaurant: Restaurant }) {
  // Get the user's review if it exists
  const review = useMemo(() => {
    if (restaurant.reviews.length === 0) return null;
    return restaurant.reviews.find((r: Review) => r.createdBy === userId) || null;
  }, [restaurant.reviews]);

  // States for the input fields
  const [rating, setRating] = useState<number>(review?.rating || 0);
  const [ratingHover, setRatingHover] = useState<boolean>(false);
  const [inputNote, setInputNote] = useState<string>(review?.note || '');

  useEffect(() => {
    const handleUpdate = async () => {
      const updatedReview = await updateReview(inputNote, userId, restaurant._id, rating);
      await updateRestaurant(userId, restaurant._id, updatedReview);
    };

    handleUpdate();
  }, [rating, inputNote])

  return (
    <div className="flex flex-col gap-2">
      <div id="restaurant-rating" className="w-fit" onMouseEnter={() => setRatingHover(true)} onMouseLeave={() => setRatingHover(false)}>
        {ratingHover
          ? <RatingSystem currRating={rating} setNewRating={newRating => setRating(newRating)} />
          : <RatingDisplay rating={rating} />
        }
      </div>
      <textarea id="restaurant-note" name="restaurant-note" placeholder="Add a note for this restaurant" value={inputNote} onChange={(e) => setInputNote(e.target.value)}
        className="w-full h-auto field-sizing-content focus:outline-none"></textarea>
    </div>
  );
}