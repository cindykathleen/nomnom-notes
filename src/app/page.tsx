import { Suspense } from 'react';
import getCurrentUser from '@/app/lib/getCurrentUser';
import PublicNav from '@/app/components/PublicNav';
import Nav from '@/app/components/Nav';
import LandingPage from '@/app/components/LandingPage';
import FollowingFeed from '@/app/components/feed/FollowingFeed';
import FeedLoading from '@/app/components/feed/FeedLoading';
import SocialSidebar from '@/app/components/social/SocialSidebar';

export default async function HomePage() {
  const userId = await getCurrentUser(true);

  return (
    <div className="outer-layout">
      {userId === 'public' ? (
        <>
          <PublicNav />
          <LandingPage />
        </>
      ) : (
        <>
          <Nav userId={userId} />
          <div className="page-layout">
            <div className="page-layout-inner">
              <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
                <div className="min-w-0 flex-1">
                  <Suspense fallback={<FeedLoading />}>
                    <FollowingFeed userId={userId} />
                  </Suspense>
                </div>
                <SocialSidebar userId={userId} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}