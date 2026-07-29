'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User } from '@/app/interfaces/interfaces';
import UserRow from './UserRow';

interface Props {
  initialRequests: User[];
  initialCount: number;
}

export default function FollowRequestQueueClient({
  initialRequests,
  initialCount,
}: Props) {
  const [queue, setQueue] = useState(initialRequests);
  const [count, setCount] = useState(initialCount);

  if (queue.length === 0 || count === 0) {
    return null;
  }

  const current = queue[0];

  const handleResolved = () => {
    setQueue((prev) => prev.slice(1));
    setCount((prev) => Math.max(0, prev - 1));
  };

  return (
    <section className="lg:hidden" data-cy="follow-request-queue">
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <h5>Follower requests</h5>
        <Link
          href="/social/requests"
          className="link description-sm shrink-0 whitespace-nowrap"
          data-cy="view-all-requests"
        >
          View all ({count})
        </Link>
      </div>
      <hr className="border-lightgray mb-1" />
      <div key={current._id} className="fade-in">
        <UserRow user={current} showActions onResolved={handleResolved} />
      </div>
    </section>
  );
}
