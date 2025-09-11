import { Review } from '@/app/interfaces/interfaces';

export default function getAvgRating(reviews: Review[]) {
  let avg: number = 0;

  if (reviews.length > 0) {
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    avg = total / reviews.length;

    // Round to nearest half
    avg = Math.round(avg * 2) / 2;
  }

  return avg;
}