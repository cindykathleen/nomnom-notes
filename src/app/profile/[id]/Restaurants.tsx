import Link from 'next/link';
import Image from 'next/image';
import { User } from '@/app/interfaces/interfaces';
import { getProfileRestaurants } from '@/app/actions/profile';

export default async function Restaurants({ user }: { user: User }) {
  const profileRestaurants = await getProfileRestaurants(user._id);

  return (
    <div className="profile-section">
      <h4 className="profile-section-heading">Restaurants</h4>
      { // Display restaurants if available
        profileRestaurants.length > 0 && (
          <div className="profile-section-highlights">
            {profileRestaurants.map(restaurant => (
              <Link key={restaurant._id} href={`/restaurant/${restaurant._id}`} className="text-center">
                <Image src={restaurant.photoUrl!} alt={restaurant.name} width='300' height='300'
                  className="aspect-square object-cover rounded-sm"
                />
                <span className="profile-section-highlights-text">{restaurant.name}</span>
              </Link>
            ))}
          </div>
        )
      }
      { // Display an error message if no restaurants are found
        profileRestaurants.length === 0 && (
          <p className="text-lg">The user does not have any restaurants saved.</p>
        )
      }
    </div>
  );
}