import Link from 'next/link';
import Image from 'next/image';
import { User } from '@/app/interfaces/interfaces';
import { getProfileLists } from '@/app/actions/profile';

export default async function Lists({ user }: { user: User }) {
  const profileLists = await getProfileLists(user._id);

  return (
    <div className="profile-section">
      <h4 className="profile-section-heading">Lists</h4>
      { // Display lists if available
        profileLists.length > 0 && (
          <div className="profile-section-highlights">
            {profileLists.map(list => (
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
        profileLists.length === 0 && (
          <p className="text-lg">The user does not have any lists.</p>
        )
      }
    </div>
  );
}