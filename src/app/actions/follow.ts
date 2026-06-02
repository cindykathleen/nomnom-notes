'use server';

import { auth } from '@/app/lib/auth';
import { followUserDb, unfollowUserDb } from '@/app/lib/dbFunctions';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

async function getFollowerId() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error('Not authenticated');
  }

  return session.user.id;
}

export const followUser = async (targetUserId: string) => {
  try {
    const followerId = await getFollowerId();
    await followUserDb(followerId, targetUserId);
    revalidatePath(`/profile/${targetUserId}`);
    return { success: true };
  } catch (err) {
    return { error: `Error following user: ${err}` };
  }
};

export const unfollowUser = async (targetUserId: string) => {
  try {
    const followerId = await getFollowerId();
    await unfollowUserDb(followerId, targetUserId);
    revalidatePath(`/profile/${targetUserId}`);
    return { success: true };
  } catch (err) {
    return { error: `Error unfollowing user: ${err}` };
  }
};
