import Link from 'next/link';
import type { ReactNode } from 'react';
import { ActivityType, FeedActivityView } from '@/app/interfaces/interfaces';

function EntityLink({
  href,
  children,
}: {
  href?: string;
  children: ReactNode;
}) {
  if (!href) {
    return <span className="font-normal text-charcoal">{children}</span>;
  }

  return (
    <Link href={href} className="link text-darkpink">
      {children}
    </Link>
  );
}

export default function ActivityRenderer({ item }: { item: FeedActivityView }) {
  const { activity, list, restaurant, dishes } = item;
  const listHref = list ? `/list/${list._id}` : undefined;
  const restaurantHref = restaurant ? `/restaurant/${restaurant._id}` : undefined;
  const listName = list?.name ?? 'a list';
  const restaurantName = restaurant?.name ?? 'a restaurant';
  const dishName = dishes?.[0]?.name ?? 'a dish';

  let body: ReactNode;

  switch (activity.type) {
    case ActivityType.LIST_CREATED:
      body = (
        <>
          created a new list <EntityLink href={listHref}>{listName}</EntityLink>
        </>
      );
      break;
    case ActivityType.LIST_JOINED:
      body = (
        <>
          is now a collaborator of <EntityLink href={listHref}>{listName}</EntityLink>
        </>
      );
      break;
    case ActivityType.RESTAURANT_SAVED:
      body = (
        <>
          saved <EntityLink href={restaurantHref}>{restaurantName}</EntityLink>
          {' '}to <EntityLink href={listHref}>{listName}</EntityLink>
        </>
      );
      break;
    case ActivityType.RESTAURANT_REVIEWED:
      body = (
        <>
          reviewed <EntityLink href={restaurantHref}>{restaurantName}</EntityLink>
        </>
      );
      break;
    case ActivityType.DISH_REVIEWED:
      body = (
        <>
          reviewed <EntityLink href={restaurantHref}>{dishName}</EntityLink>
          {' '}at <EntityLink href={restaurantHref}>{restaurantName}</EntityLink>
        </>
      );
      break;
    case ActivityType.REVIEWS_BATCHED: {
      const dishCount = activity.dishIds?.length ?? dishes?.length ?? 0;
      
      if (activity.includesRestaurantReview) {
        body = (
          <>
            reviewed <EntityLink href={restaurantHref}>{restaurantName}</EntityLink>
            {dishCount > 0 && (
              <>
                {' '}and {dishCount} {dishCount === 1 ? 'dish' : 'dishes'}
              </>
            )}
          </>
        );
      } else {
        body = (
          <>
            reviewed {dishCount} {dishCount === 1 ? 'dish' : 'dishes'} at{' '}
            <EntityLink href={restaurantHref}>{restaurantName}</EntityLink>
          </>
        );
      }
      break;
    }
    default:
      body = <>did something</>;
  }

  return (
    <p className="description" data-cy="feed-activity-text">
      {body}
    </p>
  );
}
