import { User } from '@/app/interfaces/interfaces';
import UserRow from './UserRow';

function orderUsersByIds(users: User[], ids: string[]): User[] {
  const userMap = new Map(users.map((user) => [user._id, user]));
  return ids
    .map((id) => userMap.get(id))
    .filter((user): user is User => user !== undefined);
}

interface Props {
  followRequests: User[];
  followers: User[];
  following: User[];
}

export default function Social({ followRequests, followers, following }: Props) {
  return (
    <div className="flex flex-col gap-8">
      <section>
        <h2 className="page-subheading">Follower requests</h2>
        <hr className="border-lightgray mb-2" />
        {followRequests.length === 0 ? (
          <p className="text-lg" data-cy="no-follow-requests">No pending follower requests.</p>
        ) : (
          <div className="divide-y divide-lightgray">
            {followRequests.map((user) => (
              <UserRow key={user._id} user={user} showActions />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="page-subheading">Followers</h2>
        <hr className="border-lightgray mb-2" />
        {followers.length === 0 ? (
          <p className="text-lg" data-cy="no-followers">No followers yet.</p>
        ) : (
          <div className="divide-y divide-lightgray" data-cy="followers-list">
            {followers.map((user) => (
              <UserRow key={user._id} user={user} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="page-subheading">Following</h2>
        <hr className="border-lightgray mb-2" />
        {following.length === 0 ? (
          <p className="text-lg" data-cy="no-following">Not following anyone yet.</p>
        ) : (
          <div className="divide-y divide-lightgray" data-cy="following-list">
            {following.map((user) => (
              <UserRow key={user._id} user={user} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export { orderUsersByIds };
