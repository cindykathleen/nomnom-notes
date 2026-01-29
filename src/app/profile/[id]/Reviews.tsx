import { User } from '@/app/interfaces/interfaces';
import { getProfileReviews } from '@/app/actions/profile';
import RatingDisplay from '@/app/components/RatingDisplay';

export default async function Reviews({ user }: { user: User }) {
  const profileReviews = await getProfileReviews(user._id);

  return (
    <div className="profile-section">
      <h4 className="profile-section-heading">Reviews</h4>
      { // Display reviews if available
        profileReviews.length > 0 && (
          <div className="profile-section-highlights">
            {profileReviews.map(review => (
              <div key={review._id} className="relative p-1 flex flex-col items-center gap-2 border border-lightgray rounded-sm">
                <span className="profile-section-highlights-text">{review.name}</span>
                <RatingDisplay rating={review.rating!} />
                <span className="text-sm text-center line-clamp-5">{review.note}</span>
              </div>
            ))}
          </div>
        )
      }
      { // Display an error message if no reviews are found
        profileReviews.length === 0 && (
          <p className="text-lg">The user does not have any reviews.</p>
        )
      }
    </div>
  );
}