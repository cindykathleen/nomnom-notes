import Image from 'next/image';
import { User } from '@/app/interfaces/interfaces';

export default async function Photos({ user }: { user: User }) {
  const profilePhotos = (user.photos ?? [])
    .slice() // make a copy of the array
    .sort(() => 0.5 - Math.random())
    .slice(0, 15); // choose at most 15 photos

  return (
    <div className="profile-section">
      <h4 className="pb-1 xl:pb-2">Photos</h4>
      { // Display photos if available
        profilePhotos.length > 0 && (
          <div className="profile-section-photos">
            { profilePhotos.map((photo, index) => {
              let visibility = '';

              if (index >= 4 && index < 6) {
                visibility = 'hidden sm:block';
              } else if (index >= 6 && index < 8) {
                visibility = 'hidden md:block';
              } else if (index >= 8) {
                visibility = 'hidden lg:block';
              }

              return (
                <Image key={index} src={photo} alt={`${user.name}'s photo`} width='300' height='300'
                  className={`aspect-square object-cover rounded-sm ${visibility}`}
                />
              )
            })}
          </div>
        )
      }
      { // Display an error message if no photos are found
        profilePhotos.length === 0 && (
          <p className="description">The user has not uploaded any photos.</p>
        )
      }
    </div>
  );
}