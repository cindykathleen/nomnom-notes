import Link from 'next/link';
import { User } from '@/app/interfaces/interfaces';
import UserRow from './UserRow';

/** Preserve id order; ids are expected newest-first. */
export function orderUsersByIds(users: User[], ids: string[]): User[] {
  const userMap = new Map(users.map((user) => [user._id, user]));
  return ids
    .map((id) => userMap.get(id))
    .filter((user): user is User => user !== undefined);
}

/** Most recent ids are at the end of Mongo $addToSet arrays — newest first. */
export function newestFirstIds(ids: string[]): string[] {
  return [...ids].reverse();
}

/** Most recent ids — take last N, newest first. */
export function takeMostRecentIds(ids: string[], limit: number = 5): string[] {
  return ids.slice(-limit).reverse();
}

interface SectionProps {
  title: string;
  href: string;
  totalCount: number;
  emptyMessage: string;
  emptyCy: string;
  listCy?: string;
  users: User[];
  showActions?: boolean;
}

function SocialSection({
  title,
  href,
  totalCount,
  emptyMessage,
  emptyCy,
  listCy,
  users,
  showActions = false,
}: SectionProps) {
  return (
    <section>
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <h5>{title}</h5>
        <Link
          href={href}
          className="link description-sm shrink-0 whitespace-nowrap"
          data-cy={`view-all-${href.split('/').pop()}`}
        >
          View all ({totalCount})
        </Link>
      </div>
      <hr className="border-lightgray mb-1" />
      {users.length === 0 ? (
        <p className="py-2 description-sm" data-cy={emptyCy}>
          {emptyMessage}
        </p>
      ) : (
        <div className="divide-y divide-lightgray" data-cy={listCy}>
          {users.map((user) => (
            <UserRow key={user._id} user={user} showActions={showActions} />
          ))}
        </div>
      )}
    </section>
  );
}

interface Props {
  followRequests: User[];
  followers: User[];
  following: User[];
  followRequestsCount: number;
  followersCount: number;
  followingCount: number;
}

export default function Social({
  followRequests,
  followers,
  following,
  followRequestsCount,
  followersCount,
  followingCount,
}: Props) {
  return (
    <div className="flex flex-col gap-6" data-cy="social-sidebar">
      <SocialSection
        title="Follower requests"
        href="/social/requests"
        totalCount={followRequestsCount}
        emptyMessage="No pending follower requests."
        emptyCy="no-follow-requests"
        users={followRequests}
        showActions
      />
      <SocialSection
        title="Followers"
        href="/social/followers"
        totalCount={followersCount}
        emptyMessage="No followers yet."
        emptyCy="no-followers"
        listCy="followers-list"
        users={followers}
      />
      <SocialSection
        title="Following"
        href="/social/following"
        totalCount={followingCount}
        emptyMessage="Not following anyone yet."
        emptyCy="no-following"
        listCy="following-list"
        users={following}
      />
    </div>
  );
}
