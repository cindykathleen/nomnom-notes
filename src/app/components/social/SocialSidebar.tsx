import { getUser, getUsersByIds } from '@/app/lib/dbFunctions';
import Social, { orderUsersByIds, takeMostRecentIds } from './Social';

const SIDEBAR_USER_LIMIT = 5;

export default async function SocialSidebar({ userId }: { userId: string }) {
  const user = await getUser(userId);

  if (!user) {
    return null;
  }

  const followRequestsAll = user.followRequests ?? [];
  const followersAll = user.followers ?? [];
  const followingAll = user.following ?? [];

  const followRequestIds = takeMostRecentIds(followRequestsAll, SIDEBAR_USER_LIMIT);
  const followerIds = takeMostRecentIds(followersAll, SIDEBAR_USER_LIMIT);
  const followingIds = takeMostRecentIds(followingAll, SIDEBAR_USER_LIMIT);

  const allIds = [...new Set([...followRequestIds, ...followerIds, ...followingIds])];
  const users = await getUsersByIds(allIds);

  return (
    <aside className="w-full max-w-sm shrink-0 lg:sticky" data-cy="social-sidebar-aside">
      <Social
        followRequests={orderUsersByIds(users, followRequestIds)}
        followers={orderUsersByIds(users, followerIds)}
        following={orderUsersByIds(users, followingIds)}
        followRequestsCount={followRequestsAll.length}
        followersCount={followersAll.length}
        followingCount={followingAll.length}
      />
    </aside>
  );
}
