'use client';

import { useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { Restaurant, Review } from '@/app/interfaces/interfaces';
import { updateReview, updateRestaurant } from '@/app/actions/restaurant';
import RatingSystem from '@/app/components/RatingSystem';
import RatingDisplay from '@/app/components/RatingDisplay';

const NOTE_DEBOUNCE_MS = 600;

export default function RestaurantReview({ userId, restaurant }: { userId: string, restaurant: Restaurant }) {
  const review = useMemo(() => {
    if (restaurant.reviews.length === 0) return null;
    return restaurant.reviews.find((r: Review) => r.createdBy === userId) || null;
  }, [restaurant.reviews, userId]);

  const [rating, setRating] = useState<number>(review?.rating || 0);
  const [ratingHover, setRatingHover] = useState<boolean>(false);
  const [inputNote, setInputNote] = useState<string>(review?.note || '');
  const [committed, setCommitted] = useState({
    rating: review?.rating || 0,
    note: review?.note || '',
  });
  const [, startTransition] = useTransition();

  const ratingRef = useRef(rating);
  const noteRef = useRef(inputNote);
  const committedRef = useRef(committed);
  const noteDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    ratingRef.current = rating;
  }, [rating]);

  useEffect(() => {
    noteRef.current = inputNote;
  }, [inputNote]);

  useEffect(() => {
    committedRef.current = committed;
  }, [committed]);

  const persist = (nextRating: number, nextNote: string) => {
    const current = committedRef.current;
    if (nextRating === current.rating && nextNote === current.note) return;

    startTransition(async () => {
      const updatedReview = await updateReview(nextNote, userId, restaurant._id, nextRating);
      await updateRestaurant(userId, restaurant._id, updatedReview);
      setCommitted({ rating: nextRating, note: nextNote });
    });
  };

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);

    if (noteDebounceRef.current) {
      clearTimeout(noteDebounceRef.current);
      noteDebounceRef.current = null;
    }

    persist(newRating, noteRef.current);
  };

  useEffect(() => {
    if (inputNote === committedRef.current.note) return;

    if (noteDebounceRef.current) {
      clearTimeout(noteDebounceRef.current);
    }

    noteDebounceRef.current = setTimeout(() => {
      noteDebounceRef.current = null;
      persist(ratingRef.current, inputNote);
    }, NOTE_DEBOUNCE_MS);

    return () => {
      if (noteDebounceRef.current) {
        clearTimeout(noteDebounceRef.current);
        noteDebounceRef.current = null;
      }
    };
  }, [inputNote]);

  return (
    <div className="flex flex-col gap-2">
      <div
        id="restaurant-rating"
        className="w-fit"
        onMouseEnter={() => setRatingHover(true)}
        onMouseLeave={() => setRatingHover(false)}
      >
        {ratingHover
          ? <RatingSystem currRating={rating} setNewRating={handleRatingChange} />
          : <RatingDisplay rating={rating} />
        }
      </div>
      <textarea
        id="restaurant-note"
        name="restaurant-note"
        placeholder="Add a note for this restaurant"
        value={inputNote}
        onChange={(e) => setInputNote(e.target.value)}
        className="w-full h-auto field-sizing-content focus:outline-none"
      />
    </div>
  );
}
