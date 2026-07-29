import { getUser, getUsersByIds } from '@/app/lib/dbFunctions';
import { newestFirstIds, orderUsersByIds } from './Social';
import FollowRequestQueueClient from './FollowRequestQueueClient';

export default async function FollowRequestQueue({ userId }: { userId: string }) {
  const user = await getUser(userId);

  if (!user) {
    return null;
  }

  const followRequestsAll = user.followRequests ?? [];

  if (followRequestsAll.length === 0) {
    return null;
  }

  const followRequestIds = newestFirstIds(followRequestsAll);
  const users = await getUsersByIds(followRequestIds);

  return (
    <FollowRequestQueueClient
      initialRequests={orderUsersByIds(users, followRequestIds)}
      initialCount={followRequestsAll.length}
    />
  );
}
