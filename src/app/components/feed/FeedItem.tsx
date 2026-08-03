import Link from 'next/link';
import Image from 'next/image';
import { ActivityType, FeedActivityView } from '@/app/interfaces/interfaces';
import ActivityRenderer from './ActivityRenderer';

function toIsoString(value: Date | string): string {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function isPlaceholderPhoto(photoUrl: string): boolean {
  return photoUrl.includes('placeholder');
}

function getActivityPhoto(item: FeedActivityView): {
  url: string;
  alt: string;
  href?: string;
} | null {
  const { activity, list, restaurant, dishes } = item;

  switch (activity.type) {
    case ActivityType.LIST_CREATED:
    case ActivityType.LIST_JOINED: {
      if (!list?.photoUrl || isPlaceholderPhoto(list.photoUrl)) return null;
      return { url: list.photoUrl, alt: list.name, href: `/list/${list._id}` };
    }
    case ActivityType.RESTAURANT_SAVED:
    case ActivityType.RESTAURANT_REVIEWED:
    case ActivityType.REVIEWS_BATCHED: {
      if (!restaurant?.photoUrl) return null;
      return {
        url: restaurant.photoUrl,
        alt: restaurant.name,
        href: `/restaurant/${restaurant._id}`,
      };
    }
    case ActivityType.DISH_REVIEWED: {
      const dish = dishes?.[0];
      if (!dish?.photoUrl || isPlaceholderPhoto(dish.photoUrl)) return null;
      return {
        url: dish.photoUrl,
        alt: dish.name,
        href: restaurant ? `/restaurant/${restaurant._id}` : undefined,
      };
    }
    default:
      return null;
  }
}

function ActivityPhoto({
  url,
  alt,
  href,
}: {
  url: string;
  alt: string;
  href?: string;
}) {
  const image = (
    <div className="relative mt-4 w-full aspect-square overflow-hidden rounded-xl">
      <Image
        src={url}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover"
      />
    </div>
  );

  if (!href) {
    return <div className="mt-auto" data-cy="feed-activity-photo">{image}</div>;
  }

  return (
    <Link href={href} className="mt-auto block" data-cy="feed-activity-photo">
      {image}
    </Link>
  );
}

export default function FeedItem({ item }: { item: FeedActivityView }) {
  const { actor, activity, timestampLabel } = item;
  const photoUrl = actor.photoUrl || process.env.NEXT_PUBLIC_PLACEHOLDER_IMG_AVATAR || '';
  const activityPhoto = getActivityPhoto(item);

  return (
    <article className="feed-item" data-cy={`feed-item-${activity._id}`}>
      <div className="flex gap-3">
        <Link href={`/profile/${actor._id}`} className="shrink-0">
          {photoUrl ? (
            <Image src={photoUrl} alt={`${actor.name}'s profile picture`} width={48} height={48}
              className="rounded-full aspect-square object-cover" />
          ) : (
            <div className="h-12 w-12 rounded-full bg-lightgray" />
          )}
        </Link>
        <div className="min-w-0 flex-1 flex flex-col gap-1">
          <div className="flex items-baseline justify-between gap-3">
            <Link href={`/profile/${actor._id}`}>
              <h5 className="link truncate">{actor.name}</h5>
            </Link>
            <time className="shrink-0" dateTime={toIsoString(activity.createdAt)}>
              <p className="description-sm">{timestampLabel}</p>
            </time>
          </div>
          <ActivityRenderer item={item} />
        </div>
      </div>
      {activityPhoto && <ActivityPhoto {...activityPhoto} />}
    </article>
  );
}
