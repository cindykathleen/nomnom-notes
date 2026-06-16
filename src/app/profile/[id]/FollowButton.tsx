'use client';

import { useTransition } from 'react';
import { followUser, unfollowUser } from '@/app/actions/follow';

interface Props {
  targetUserId: string;
  initialIsFollowing: boolean;
  initialHasPendingRequest: boolean;
}

export default function FollowButton({
  targetUserId,
  initialIsFollowing,
  initialHasPendingRequest,
}: Props) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      if (initialIsFollowing) {
        await unfollowUser(targetUserId);
      } else {
        await followUser(targetUserId);
      }
    });
  };

  if (initialHasPendingRequest) {
    return (
      <button
        type="button"
        className="button-disabled"
        disabled
        data-cy="requested-button"
      >
        Requested
      </button>
    );
  }

  return (
    <button
      type="button"
      className="button-secondary flex items-center justify-center gap-2 text-nowrap"
      onClick={handleClick}
      disabled={isPending}
      data-cy={initialIsFollowing ? 'unfollow-button' : 'follow-button'}
    >
      {initialIsFollowing ? (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
          </svg>
          Unfollow
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Follow
        </>
      )}
    </button>
  );
}
