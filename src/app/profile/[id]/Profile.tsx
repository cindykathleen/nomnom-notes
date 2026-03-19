import { Suspense } from 'react';
import { User } from '@/app/interfaces/interfaces';
import Hero from './Hero';
import ProfileLoading from './ProfileLoading';
import ProfileDetails from './ProfileDetails';

export default function Profile({ user }: { user: User }) {
  return (
    <div className="gated-page-layout">
      <div className="gated-page-layout-inner">
        <Hero user={user} />
        <hr className="border-lightgray" />
        <Suspense fallback={<ProfileLoading />}>
          <ProfileDetails user={user} />
        </Suspense>
      </div>
    </div>
  );
}