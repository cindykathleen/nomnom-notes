'use client';

import { Review } from '@/app/interfaces/interfaces';
import RatingDisplay from '@/app/components/RatingDisplay';

export default function ReviewCard({ index, review }: { index: number, review: Review }) {
  return (
    <div key={index} className="relative p-4 flex flex-col gap-2 border border-lightgray rounded-lg">
      <RatingDisplay rating={review.rating} />
      <p className="text-lg">{review.note}</p>
      <p className="text-right text-sm font-semibold">- {review.name}</p>
    </div>
  );
}