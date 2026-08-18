import Link from 'next/link';
import Image from 'next/image';
import { User } from '@/app/interfaces/interfaces';

export default async function Photos({ user }: { user: User }) {
  const allPhotos = user.photos ?? [];
  const profilePhotos = allPhotos
    .slice() // make a copy of the array
    .sort(() => 0.5 - Math.random())
    .slice(0, 12); // choose at most 12 photos

  return (
    <div className="profile-section">
      <div className="profile-section-heading">
        <h4>Photos</h4>
        <Link
          href={`/profile/${user._id}/activity#photos`}
          className="description-sm link"
          data-cy="profile-photos-count"
        >
          View all ({allPhotos.length})
        </Link>
      </div>
      {profilePhotos.length > 0 && (
        <div className="profile-section-left-cols">
          {profilePhotos.map((photo, index) => {
            let visibility = '';

            if (index >= 4 && index < 6) {
              visibility = 'hidden sm:block';
            } else if (index >= 6 && index < 8) {
              visibility = 'hidden md:block';
            } else if (index >= 8) {
              visibility = 'hidden lg:block';
            }

            return (
              <Image
                key={index}
                src={photo}
                alt={`${user.name}'s photo`}
                width="300"
                height="300"
                className={`aspect-square object-cover rounded-sm ${visibility}`}
              />
            );
          })}
        </div>
      )}
      {profilePhotos.length === 0 && (
        <p className="description">The user has not uploaded any photos.</p>
      )}
    </div>
  );
}
