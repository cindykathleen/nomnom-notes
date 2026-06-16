import { Suspense } from 'react';
import { getUser, isFollowingDb, hasPendingFollowRequestDb } from '@/app/lib/dbFunctions';
import getCurrentUser from '@/app/lib/getCurrentUser';
import Nav from '@/app/components/Nav';
import Hero from './Hero';
import ProfileLoading from './ProfileLoading';
import ProfileDetails from './ProfileDetails';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getUser(id);
  const currentUserId = await getCurrentUser(false);

  const isFollowing = user
    ? await isFollowingDb(currentUserId, user._id)
    : false;

  const hasPendingRequest = user
    ? await hasPendingFollowRequestDb(currentUserId, user._id)
    : false;

  const canViewDetails = user && (
    user.profilePrivacy !== true ||
    user._id === currentUserId ||
    isFollowing
  );

  return (
    <div>
      <Nav userId={currentUserId} />
      {!user && (
        <div className="gated-page-layout">
          <div className="gated-page-layout-inner">
            <h1 className="page-heading">Uh oh!</h1>
            <p className="text-xl">We are not able to find the user you are looking for. Please double-check the user ID and try again.</p>
          </div>
        </div>
      )}
      {user && (
        <div className="gated-page-layout">
          <div className="gated-page-layout-inner">
            <Hero
              user={user}
              currentUserId={currentUserId}
              isFollowing={isFollowing}
              hasPendingRequest={hasPendingRequest}
            />
            <hr className="border-lightgray" />
            {canViewDetails ? (
              <Suspense fallback={<ProfileLoading />}>
                <ProfileDetails user={user} />
              </Suspense>
            ) : (
              <p className="text-xl" data-cy="profile-privacy-message">
                This user turned on their profile privacy. Please request access from them.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
