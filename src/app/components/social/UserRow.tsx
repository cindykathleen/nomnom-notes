import Link from 'next/link';
import Image from 'next/image';
import { User } from '@/app/interfaces/interfaces';
import FollowRequestActions from './FollowRequestActions';

interface Props {
  user: User;
  showActions?: boolean;
}

export default function UserRow({ user, showActions = false }: Props) {
  return (
    <div className="flex items-center justify-between gap-2 py-2.5" data-cy={`social-user-${user._id}`}>
      <Link href={`/profile/${user._id}`} className="flex items-center gap-2.5 min-w-0">
        <Image
          src={user.photoUrl}
          alt={`${user.name}'s profile picture`}
          width={40}
          height={40}
          className="rounded-full aspect-square object-cover shrink-0"
        />
        <span className="link description-sm truncate">{user.name}</span>
      </Link>
      {showActions && <FollowRequestActions requesterId={user._id} />}
    </div>
  );
}
