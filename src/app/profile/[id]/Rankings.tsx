import Link from 'next/link';
import Image from 'next/image';
import { ProfileItem } from '@/app/interfaces/interfaces';

export default async function Rankings({
  rankings,
  stats,
  userId,
}: {
  rankings: ProfileItem[];
  stats: number;
  userId: string;
}) {
  return (
    <div className="profile-section">
      <div className="profile-section-heading">
        <h4>Rankings</h4>
        <Link
          href={`/profile/${userId}/activity#rankings`}
          className="description-sm link"
          data-cy="profile-rankings-count"
        >
          View all ({stats})
        </Link>
      </div>
      {rankings.length > 0 && (
        <div className="profile-section-left-cols">
          {rankings.map((ranking) => (
            <Link href={`/ranking/${ranking._id}`} key={ranking._id} className="text-center">
              <Image
                src={ranking.photoUrl!}
                alt={ranking.name}
                width="300"
                height="300"
                className="aspect-square object-cover rounded-sm"
              />
              <h5 className="pt-2 line-clamp-1">{ranking.name}</h5>
            </Link>
          ))}
        </div>
      )}
      {rankings.length === 0 && (
        <p className="description">The user does not have any rankings.</p>
      )}
    </div>
  );
}
