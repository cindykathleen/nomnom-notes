import Link from 'next/link';
import Image from 'next/image';
import { FeedRestaurantView } from '@/app/interfaces/interfaces';

export default function RestaurantPreview({ restaurant }: { restaurant: FeedRestaurantView }) {
  const photoUrl = restaurant.photoUrl || process.env.NEXT_PUBLIC_PLACEHOLDER_IMG || '';

  return (
    <Link
      href={`/restaurant/${restaurant._id}`}
      className="mt-3 flex items-center gap-3 rounded-2xl border border-lightgray p-2 hover:border-dustypink transition-colors"
      data-cy="feed-restaurant-preview"
    >
      {photoUrl ? (
        <Image
          src={photoUrl}
          alt={restaurant.name}
          width={56}
          height={56}
          className="h-14 w-14 rounded-xl object-cover shrink-0"
        />
      ) : (
        <div className="h-14 w-14 rounded-xl bg-lightgray shrink-0" />
      )}
      <span className="font-normal text-charcoal truncate">{restaurant.name}</span>
    </Link>
  );
}
