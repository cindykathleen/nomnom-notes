'use client';

import { useEffect, useRef, useState } from 'react';
import { User } from '@/app/interfaces/interfaces';
import UserRow from './UserRow';

export default function FollowRequestsNav({
  requests: serverRequests,
  open,
  onOpenChange,
}: {
  requests: User[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [resolvedIds, setResolvedIds] = useState<ReadonlySet<string>>(() => new Set());
  const containerRef = useRef<HTMLLIElement | null>(null);

  // Drop resolved ids the server has already removed, so a later re-request can show again
  const serverIds = new Set(serverRequests.map((user) => user._id));
  let activeResolvedIds = resolvedIds;
  if ([...resolvedIds].some((id) => !serverIds.has(id))) {
    activeResolvedIds = new Set([...resolvedIds].filter((id) => serverIds.has(id)));
    setResolvedIds(activeResolvedIds);
  }

  // Hide requests resolved locally until the server list catches up via revalidation
  const requests = serverRequests.filter((user) => !activeResolvedIds.has(user._id));

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        onOpenChange(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [open, onOpenChange]);

  const handleResolved = (requesterId: string) => {
    setResolvedIds((prev) => new Set(prev).add(requesterId));
  };

  return (
    <li className="relative" ref={containerRef} data-cy="follow-requests-nav">
      <button
        type="button"
        className="nav-button relative"
        aria-label="Follower requests"
        aria-expanded={open}
        data-cy="follow-requests-nav-button"
        onClick={() => onOpenChange(!open)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 md:size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
        </svg>
        {requests.length > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-darkpink px-1 text-[10px] font-medium text-white md:h-5 md:min-w-5 md:text-xs"
            data-cy="follow-requests-badge"
          >
            {requests.length}
          </span>
        )}
      </button>
      {open && (
        <div
          className="absolute right-0 top-[45px] z-99 w-[min(90vw,320px)] max-h-[70vh] overflow-y-auto rounded-xl border border-black/5 bg-white p-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)] md:top-[55px]"
          data-cy="follow-requests-modal"
        >
          {requests.length === 0 ? (
            <p className="py-2 description-sm" data-cy="no-follow-requests">
              No pending follower requests.
            </p>
          ) : (
            <div className="divide-y divide-lightgray" data-cy="follow-requests-list">
              {requests.map((user) => (
                <UserRow
                  key={user._id}
                  user={user}
                  showActions
                  onResolved={() => handleResolved(user._id)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </li>
  );
}
