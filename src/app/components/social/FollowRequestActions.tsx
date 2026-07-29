'use client';

import { useTransition } from 'react';
import { approveFollowRequest, denyFollowRequest } from '@/app/actions/follow';

interface Props {
  requesterId: string;
  onResolved?: () => void;
}

export default function FollowRequestActions({ requesterId, onResolved }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleApprove = () => {
    startTransition(async () => {
      const result = await approveFollowRequest(requesterId);
      if (result && !('error' in result)) {
        onResolved?.();
      }
    });
  };

  const handleDeny = () => {
    startTransition(async () => {
      const result = await denyFollowRequest(requesterId);
      if (result && !('error' in result)) {
        onResolved?.();
      }
    });
  };

  return (
    <div className="flex gap-1.5 shrink-0">
      <button
        type="button"
        className="button-primary min-w-0 px-2.5 py-1 text-sm"
        onClick={handleApprove}
        disabled={isPending}
        data-cy="approve-follow-request"
      >
        Approve
      </button>
      <button
        type="button"
        className="button-secondary min-w-0 px-2.5 py-1 text-sm"
        onClick={handleDeny}
        disabled={isPending}
        data-cy="deny-follow-request"
      >
        Deny
      </button>
    </div>
  );
}
