'use client';

import { useEffect, useRef, useState } from 'react';
import { FeedActivityView } from '@/app/interfaces/interfaces';
import { loadMoreFeed } from '@/app/actions/feed';
import FeedItem from './FeedItem';
import FeedLoading from './FeedLoading';

function activityCreatedAtIso(item: FeedActivityView): string {
  const createdAt = item.activity.createdAt;
  return createdAt instanceof Date ? createdAt.toISOString() : new Date(createdAt).toISOString();
}

export default function FeedList({
  initialItems,
  initialHasMore,
}: {
  initialItems: FeedActivityView[];
  initialHasMore: boolean;
}) {
  const [items, setItems] = useState(initialItems);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const itemsRef = useRef(items);
  const hasMoreRef = useRef(hasMore);
  const loadingRef = useRef(false);

  // Keep refs current for the IntersectionObserver callback without Effect sync
  itemsRef.current = items;
  hasMoreRef.current = hasMore;

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        if (!hasMoreRef.current || loadingRef.current) return;

        const currentItems = itemsRef.current;
        if (currentItems.length === 0) return;

        loadingRef.current = true;
        setIsLoadingMore(true);

        const beforeIso = activityCreatedAtIso(currentItems[currentItems.length - 1]);

        loadMoreFeed(beforeIso)
          .then((result) => {
            if ('error' in result) {
              return;
            }

            setItems((prev) => {
              const next = [...prev, ...result.items];
              itemsRef.current = next;
              return next;
            });
            setHasMore(result.hasMore);
            hasMoreRef.current = result.hasMore;
          })
          .finally(() => {
            loadingRef.current = false;
            setIsLoadingMore(false);
          });
      },
      { root: null, rootMargin: '200px', threshold: 0 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-6" data-cy="feed-list">
      {items.map((item) => (
        <FeedItem key={item.activity._id} item={item} />
      ))}
      <div ref={sentinelRef} className="col-span-full h-1 w-full" aria-hidden data-cy="feed-scroll-sentinel" />
      {isLoadingMore && (
        <div className="col-span-full">
          <FeedLoading variant="more" />
        </div>
      )}
    </div>
  );
}
