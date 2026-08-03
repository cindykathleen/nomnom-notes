'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ProfileItem } from '@/app/interfaces/interfaces';
import HashTabs from '@/app/components/HashTabs';
import RatingDisplay from '@/app/components/RatingDisplay';

function ListsGrid({ items }: { items: ProfileItem[] }) {
  if (items.length === 0) {
    return <p className="subheading">The user does not have any lists.</p>;
  }

  return (
    <div className="cards">
      {items.map((list) => (
        <Link href={`/list/${list._id}`} key={list._id} className="flex flex-col items-center gap-2">
          <Image
            src={list.photoUrl!}
            alt={list.name}
            width={300}
            height={300}
            className="aspect-square object-cover rounded-sm"
          />
          <h5>{list.name}</h5>
        </Link>
      ))}
    </div>
  );
}

function RestaurantsGrid({ items }: { items: ProfileItem[] }) {
  if (items.length === 0) {
    return <p className="subheading">The user does not have any restaurants saved.</p>;
  }

  return (
    <div className="cards">
      {items.map((restaurant) => (
        <Link key={restaurant._id} href={`/restaurant/${restaurant._id}`} className="flex flex-col items-center gap-2">
          <Image
            src={restaurant.photoUrl!}
            alt={restaurant.name}
            width={300}
            height={300}
            className="aspect-square object-cover rounded-sm"
          />
          <h5>{restaurant.name}</h5>
        </Link>
      ))}
    </div>
  );
}

function ReviewsGrid({ items }: { items: ProfileItem[] }) {
  if (items.length === 0) {
    return <p className="subheading">The user does not have any reviews.</p>;
  }

  return (
    <div className="cards">
      {items.map((review) => (
        <div key={review._id} className="flex flex-col items-center gap-2">
          <Image
            src={review.photoUrl!}
            alt={review.name}
            width={300}
            height={300}
            className="aspect-square object-cover rounded-sm"
          />
          <div className="p-2 flex flex-col items-center gap-2">
            <h5 className="text-center">{review.name}</h5>
            <RatingDisplay rating={review.rating!} />
            <p className="description-sm whitespace-pre-line line-clamp-5">{review.note}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ActivityTabs({
  lists,
  restaurants,
  reviews,
}: {
  lists: ProfileItem[];
  restaurants: ProfileItem[];
  reviews: ProfileItem[];
}) {
  const hashes = ['lists', 'restaurants', 'reviews'];

  const tabs = [
    {
      title: `Lists`,
      content: <ListsGrid items={lists} />,
    },
    {
      title: `Restaurants`,
      content: <RestaurantsGrid items={restaurants} />,
    },
    {
      title: `Reviews`,
      content: <ReviewsGrid items={reviews} />,
    },
  ];

  return <HashTabs tabs={tabs} hashes={hashes} selectId="activity-select" />;
}
