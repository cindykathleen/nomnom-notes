import getCurrentUser from '@/app/lib/getCurrentUser';
import { getUser, getUsersByIds } from '@/app/lib/dbFunctions';
import Nav from '@/app/components/Nav';
import Social, { orderUsersByIds } from './Social';

export default async function Page() {
  const userId = await getCurrentUser(false);
  const user = await getUser(userId);

  const followRequestIds = user?.followRequests ?? [];
  const followerIds = user?.followers ?? [];
  const followingIds = user?.following ?? [];

  const allIds = [...new Set([...followRequestIds, ...followerIds, ...followingIds])];
  const users = await getUsersByIds(allIds);

  const followRequests = orderUsersByIds(users, followRequestIds);
  const followers = orderUsersByIds(users, followerIds);
  const following = orderUsersByIds(users, followingIds);

  return (
    <div className="outer-layout">
      <Nav userId={userId} />
      <div className="page-layout">
        <div className="page-layout-inner space-y-6 xl:space-y-8">
          {user && (
            <>
              <h1 className="page-heading">Social</h1>
              <Social
                followRequests={followRequests}
                followers={followers}
                following={following}
              />
            </>
          )}
          {!user && (
            <>
              <h1 className="page-heading">Uh oh!</h1>
              <p className="text-xl">We are not able to load your social information. Please try again.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
