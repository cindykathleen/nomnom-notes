'use client';

import { useTransition } from 'react';
import { approveFollowRequest, denyFollowRequest } from '@/app/actions/follow';

interface Props {
  requesterId: string;
}

export default function FollowRequestActions({ requesterId }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleApprove = () => {
    startTransition(async () => {
      await approveFollowRequest(requesterId);
    });
  };

  const handleDeny = () => {
    startTransition(async () => {
      await denyFollowRequest(requesterId);
    });
  };

  return (
    <div className="flex gap-2">
      <button
        type="button"
        className="button-primary"
        onClick={handleApprove}
        disabled={isPending}
        data-cy="approve-follow-request"
      >
        Approve
      </button>
      <button
        type="button"
        className="button-secondary"
        onClick={handleDeny}
        disabled={isPending}
        data-cy="deny-follow-request"
      >
        Deny
      </button>
    </div>
  );
}
