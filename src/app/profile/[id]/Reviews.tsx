import { ProfileItem } from '@/app/interfaces/interfaces';
import RatingDisplay from '@/app/components/RatingDisplay';

export default async function Reviews({ reviews, stats }: { reviews: ProfileItem[], stats: number }) {
  return (
    <div className="profile-section">
      <div className="profile-section-heading">
        <h4>Reviews</h4>
        <p className="description-sm link">View all ({stats})</p>
      </div>
      { // Display reviews if available
        reviews.length > 0 && (
          <div className="profile-section-highlights">
            {reviews.map(review => (
              <div key={review._id} className="relative p-2 flex flex-col items-center gap-2 border border-lightgray rounded-sm">
                <p className="description">{review.name}</p>
                <RatingDisplay rating={review.rating!} />
                <p className="description-sm text-center whitespace-pre-line line-clamp-5">{review.note}</p>
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