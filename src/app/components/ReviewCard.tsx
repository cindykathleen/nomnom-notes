'use client';

import { Review } from '@/app/interfaces/interfaces';
import RatingDisplay from '@/app/components/RatingDisplay';

export default function ReviewCard({ index, review }: { index: number, review: Review }) {
  return (
    <div key={index} className="cards-outline pb-12 flex-col gap-2">
      <RatingDisplay rating={review.rating} />
      <p className="description-sm whitespace-pre-line">{review.note}</p>
      <p className="absolute bottom-4 right-4 review-user">- {review.name}</p>
    </div>
  );
}