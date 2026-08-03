import Link from 'next/link';
import Image from 'next/image';
import { ProfileItem } from '@/app/interfaces/interfaces';

export default async function Lists({
  lists,
  stats,
  userId,
}: {
  lists: ProfileItem[];
  stats: number;
  userId: string;
}) {
  return (
    <div className="profile-section">
      <div className="profile-section-heading">
        <h4>Lists</h4>
        <Link
          href={`/profile/${userId}/lists`}
          className="description-sm link"
          data-cy="profile-lists-count"
        >
          View all ({stats})
        </Link>
      </div>
      { // Display lists if available
        lists.length > 0 && (
          <div className="profile-section-highlights">
            {lists.map(list => (
              <Link href={`/list/${list._id}`} key={list._id} className="text-center">
                <Image src={list.photoUrl!} alt={list.name} width='300' height='300'
                  className="aspect-square object-cover rounded-sm"
                />
                <h5 className="pt-2 line-clamp-1">{list.name}</h5>
              </Link>
            ))}
          </div>
        )
      }
      { // Display an error message if no lists are found
        lists.length === 0 && (
          <p className="description">The user does not have any lists.</p>
        )
      }
    </div>
  );
}