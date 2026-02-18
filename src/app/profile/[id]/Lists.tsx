import Link from 'next/link';
import Image from 'next/image';
import { ProfileItem } from '@/app/interfaces/interfaces';

export default async function Lists({ lists }: { lists: ProfileItem[] }) {
  return (
    <div className="profile-section">
      <h4 className="profile-section-heading">Lists</h4>
      { // Display lists if available
        lists.length > 0 && (
          <div className="profile-section-highlights">
            {lists.map(list => (
              <Link href={`/list/${list._id}`} key={list._id} className="text-center">
                <Image src={list.photoUrl!} alt={list.name} width='300' height='300'
                  className="aspect-square object-cover rounded-sm"
                />
                <span className="profile-section-highlights-text">{list.name}</span>
              </Link>
            ))}
          </div>
        )
      }
      { // Display an error message if no lists are found
        lists.length === 0 && (
          <p className="text-lg">The user does not have any lists.</p>
        )
      }
    </div>
  );
}