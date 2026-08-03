import Link from 'next/link';
import Image from 'next/image';
import { ProfileItem } from '@/app/interfaces/interfaces';

export default async function Restaurants({
  restaurants,
  stats,
  userId,
}: {
  restaurants: ProfileItem[];
  stats: number;
  userId: string;
}) {
  return (
    <div className="profile-section">
      <div className="profile-section-heading">
        <h4>Restaurants</h4>
        <Link
          href={`/profile/${userId}/activity#restaurants`}
          className="description-sm link"
          data-cy="profile-restaurants-count"
        >
          View all ({stats})
        </Link>
      </div>
      { // Display restaurants if available
        restaurants.length > 0 && (
          <div className="profile-section-highlights">
            {restaurants.map(restaurant => (
              <Link key={restaurant._id} href={`/restaurant/${restaurant._id}`} className="text-center">
                <Image src={restaurant.photoUrl!} alt={restaurant.name} width='300' height='300'
                  className="aspect-square object-cover rounded-sm"
                />
                <h5 className="pt-2 line-clamp-1">{restaurant.name}</h5>
              </Link>
            ))}
          </div>
        )
      }
      { // Display an error message if no restaurants are found
        restaurants.length === 0 && (
          <p className="description">The user does not have any restaurants saved.</p>
        )
      }
    </div>
  );
}