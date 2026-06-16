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
    <>
      <Nav userId={userId} />
      <div className="gated-page-layout">
        <div className="gated-page-layout-inner">
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
    </>
  );
}
