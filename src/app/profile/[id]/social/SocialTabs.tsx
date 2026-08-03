'use client';

import { User } from '@/app/interfaces/interfaces';
import HashTabs from '@/app/components/HashTabs';
import UserRow from '@/app/components/social/UserRow';

function UserList({
  users,
  emptyMessage,
  emptyCy,
  listCy,
}: {
  users: User[];
  emptyMessage: string;
  emptyCy: string;
  listCy: string;
}) {
  if (users.length === 0) {
    return (
      <p className="subheading" data-cy={emptyCy}>
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="max-w-xl divide-y divide-lightgray" data-cy={listCy}>
      {users.map((user) => (
        <UserRow key={user._id} user={user} />
      ))}
    </div>
  );
}

export default function SocialTabs({
  followers,
  following,
}: {
  followers: User[];
  following: User[];
}) {
  const hashes = ['followers', 'following'];

  const tabs = [
    {
      title: `Followers`,
      content: (
        <UserList
          users={followers}
          emptyMessage="No followers yet."
          emptyCy="no-followers"
          listCy="followers-list"
        />
      ),
    },
    {
      title: `Following`,
      content: (
        <UserList
          users={following}
          emptyMessage="Not following anyone yet."
          emptyCy="no-following"
          listCy="following-list"
        />
      ),
    },
  ];

  return <HashTabs tabs={tabs} hashes={hashes} selectId="social-select" />;
}
