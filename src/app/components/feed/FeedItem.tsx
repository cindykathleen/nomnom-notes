import Link from 'next/link';
import Image from 'next/image';
import { FeedActivityView } from '@/app/interfaces/interfaces';
import ActivityRenderer from './ActivityRenderer';

function toIsoString(value: Date | string): string {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

export default function FeedItem({ item }: { item: FeedActivityView }) {
  const { actor, activity, timestampLabel } = item;
  const photoUrl = actor.photoUrl || process.env.NEXT_PUBLIC_PLACEHOLDER_IMG_AVATAR || '';

  return (
    <article className="feed-item" data-cy={`feed-item-${activity._id}`}>
      <div className="flex gap-3">
        <Link href={`/profile/${actor._id}`} className="shrink-0">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={`${actor.name}'s profile picture`}
              width={48}
              height={48}
              className="rounded-full aspect-square object-cover"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-lightgray" />
          )}
        </Link>
        <div className="min-w-0 flex-1 flex flex-col gap-1">
          <div className="flex items-baseline justify-between gap-3">
            <Link href={`/profile/${actor._id}`} className="link description-sm truncate">
              {actor.name}
            </Link>
            <time
              className="text-sm font-extralight text-slategray shrink-0"
              dateTime={toIsoString(activity.createdAt)}
            >
              {timestampLabel}
            </time>
          </div>
          <ActivityRenderer item={item} />
        </div>
      </div>
    </article>
  );
}
