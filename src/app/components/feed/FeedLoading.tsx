export default function FeedLoading({ variant = 'initial' }: { variant?: 'initial' | 'more' }) {
  if (variant === 'more') {
    return (
      <div className="py-6 text-center" data-cy="feed-loading-more">
        <p className="description-sm text-slategray">Loading more...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl w-full" data-cy="feed-loading">
      {[0, 1, 2].map((i) => (
        <div key={i} className="feed-item animate-pulse">
          <div className="flex gap-3">
            <div className="h-12 w-12 shrink-0 rounded-full bg-lightgray" />
            <div className="flex-1 flex flex-col gap-2 py-1">
              <div className="h-4 w-1/3 rounded bg-lightgray" />
              <div className="h-4 w-2/3 rounded bg-lightgray" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
