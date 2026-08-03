import Link from 'next/link';
import { ProfileItem } from '@/app/interfaces/interfaces';
import RatingDisplay from '@/app/components/RatingDisplay';

export default async function Reviews({
  reviews,
  stats,
  userId,
}: {
  reviews: ProfileItem[];
  stats: number;
  userId: string;
}) {
  return (
    <div className="profile-section">
      <div className="profile-section-heading">
        <h4>Reviews</h4>
        <Link href={`/profile/${userId}/reviews`} className="description-sm link">
          View all ({stats})
        </Link>
      </div>
      { // Display reviews if available
        reviews.length > 0 && (
          <div className="profile-section-highlights">
            {reviews.map(review => (
              <div key={review._id} className="relative p-2 flex flex-col items-center gap-2 border border-lightgray rounded-sm">
                <h5 className="text-center">{review.name}</h5>
                <RatingDisplay rating={review.rating!} />
                <p className="description-sm whitespace-pre-line line-clamp-5">{review.note}</p>
              </div>
            ))}
          </div>
        )
      }
      { // Display an error message if no reviews are found
        reviews.length === 0 && (
          <p className="description">The user does not have any reviews.</p>
        )
      }
    </div>
  );
}