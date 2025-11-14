'use client';

import { Review } from '@/app/interfaces/interfaces';
import RatingDisplay from '@/app/components/RatingDisplay';

export default function ReviewCard({ index, review }: { index: number, review: Review }) {
  return (
    <div key={index} className="cards-outline flex-col gap-2">
      <RatingDisplay rating={review.rating} />
      <p className="mb-6 text-md whitespace-pre-line lg:text-lg">{review.note}</p>
      <p className="absolute bottom-4 right-4 text-sm font-semibold">- {review.name}</p>
    </div>
  );
}