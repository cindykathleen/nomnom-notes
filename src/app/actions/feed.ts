'use server';

import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';
import { getFollowingFeedPage } from '@/app/lib/getFollowingFeed';
import { FeedActivityView } from '@/app/interfaces/interfaces';

async function getViewerId() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error('Not authenticated');
  }

  return session.user.id;
}

export const loadMoreFeed = async (
  beforeIso: string
): Promise<{ items: FeedActivityView[]; hasMore: boolean } | { error: string }> => {
  try {
    const viewerId = await getViewerId();
    const before = new Date(beforeIso);

    if (Number.isNaN(before.getTime())) {
      return { error: 'Invalid cursor' };
    }

    return await getFollowingFeedPage(viewerId, { before });
  } catch (err) {
    return { error: `Error loading more feed items: ${err}` };
  }
};
