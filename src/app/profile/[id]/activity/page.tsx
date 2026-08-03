import Link from 'next/link';
import { getUser, getProfileData, isFollowingDb } from '@/app/lib/dbFunctions';
import getCurrentUser from '@/app/lib/getCurrentUser';
import Nav from '@/app/components/Nav';
import ActivityTabs from './ActivityTabs';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const currentUserId = await getCurrentUser(false);
  const user = await getUser(id);

  if (!user) {
    return (
      <div className="outer-layout">
        <Nav userId={currentUserId} />
        <div className="page-layout">
          <div className="page-layout-inner gap-4 xl:gap-8">
            <h2>Uh Oh!</h2>
            <p className="subheading">
              We are not able to find the user you are looking for. Please double-check the user ID and try again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isFollowing = await isFollowingDb(currentUserId, user._id);
  const canViewDetails =
    user.profilePrivacy !== true ||
    user._id === currentUserId ||
    isFollowing;

  if (!canViewDetails) {
    return (
      <div className="outer-layout">
        <Nav userId={currentUserId} />
        <div className="page-layout">
          <div className="page-layout-inner space-y-6 xl:space-y-8">
            <Link href={`/profile/${user._id}`} className="link-cta group font-normal">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
              </svg>
              <span className="transition-transform group-hover:translate-x-1">Back to {user.name}&apos;s profile</span>
            </Link>
            <p className="subheading" data-cy="profile-privacy-message">
              This user turned on their profile privacy. Please request access from them.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const profileData = await getProfileData(user._id, null);

  return (
    <div className="outer-layout">
      <Nav userId={currentUserId} />
      <div className="page-layout">
        <div className="page-layout-inner space-y-6 xl:space-y-8">
          <Link href={`/profile/${user._id}`} className="link-cta group font-normal">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
              className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
            </svg>
            <span className="transition-transform group-hover:translate-x-1">Back to {user.name}&apos;s profile</span>
          </Link>
          <ActivityTabs
            lists={profileData.lists}
            restaurants={profileData.restaurants}
            reviews={profileData.reviews}
          />
        </div>
      </div>
    </div>
  );
}
