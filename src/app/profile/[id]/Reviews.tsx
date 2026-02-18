import { ProfileItem } from '@/app/interfaces/interfaces';
import RatingDisplay from '@/app/components/RatingDisplay';

export default async function Reviews({ reviews }: { reviews: ProfileItem[] }) {
  return (
    <div className="profile-section">
      <h4 className="profile-section-heading">Reviews</h4>
      { // Display reviews if available
        reviews.length > 0 && (
          <div className="profile-section-highlights">
            {reviews.map(review => (
              <div key={review._id} className="relative p-2 flex flex-col items-center gap-2 border border-lightgray rounded-sm">
                <span className="profile-section-highlights-text">{review.name}</span>
                <RatingDisplay rating={review.rating!} />
                <span className="text-sm text-center whitespace-pre-line line-clamp-5">{review.note}</span>
              </div>
            ))}
          </div>
        )
      }
      { // Display an error message if no reviews are found
        reviews.length === 0 && (
          <p className="text-lg">The user does not have any reviews.</p>
        )
      }
    </div>
  );
}