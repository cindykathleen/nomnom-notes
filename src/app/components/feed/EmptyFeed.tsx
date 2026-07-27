import Link from 'next/link';

export default function EmptyFeed() {
  return (
    <div className="space-y-6 xl:space-y-8" data-cy="empty-feed">
      <h2>Your Feed is Empty</h2>
      <p className="subheading">Start following people to see their posts here.</p>
    </div>
  );
}
