'use server';

import { auth } from '@/app/lib/auth';
import {
  followUserDb,
  unfollowUserDb,
  requestFollowDb,
  approveFollowRequestDb,
  denyFollowRequestDb,
  getUser,
} from '@/app/lib/dbFunctions';
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
    const target = await getUser(targetUserId);

    if (!target) {
      return { error: 'User not found' };
    }

    if (target.profilePrivacy === true) {
      await requestFollowDb(followerId, targetUserId);
    } else {
      await followUserDb(followerId, targetUserId);
    }

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

export const approveFollowRequest = async (requesterId: string) => {
  try {
    const ownerId = await getFollowerId();
    await approveFollowRequestDb(ownerId, requesterId);
    revalidatePath('/social');
    revalidatePath(`/profile/${requesterId}`);
    revalidatePath(`/profile/${ownerId}`);
    return { success: true };
  } catch (err) {
    return { error: `Error approving follow request: ${err}` };
  }
};

export const denyFollowRequest = async (requesterId: string) => {
  try {
    const ownerId = await getFollowerId();
    await denyFollowRequestDb(ownerId, requesterId);
    revalidatePath('/social');
    return { success: true };
  } catch (err) {
    return { error: `Error denying follow request: ${err}` };
  }
};
