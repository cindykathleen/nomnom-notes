import { getFollowingFeedPage } from '@/app/lib/getFollowingFeed';
import EmptyFeed from './EmptyFeed';
import FeedList from './FeedList';

export default async function FollowingFeed({ userId }: { userId: string }) {
  const { items, hasMore } = await getFollowingFeedPage(userId);

  if (items.length === 0) {
    return <EmptyFeed />;
  }

  return <FeedList initialItems={items} initialHasMore={hasMore} />;
}
