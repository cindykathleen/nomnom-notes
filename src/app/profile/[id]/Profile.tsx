import { User } from '@/app/interfaces/interfaces';
import Hero from './Hero';
import Statistics from './Statistics';
import Photos from './Photos';
import Lists from './Lists';
import Restaurants from './Restaurants';
import Reviews from './Reviews';

export default async function Profile({ user }: { user: User }) {
  return (
    <div className="gated-page-layout">
      <div className="gated-page-layout-inner">
        <Hero user={user} />
        <hr className="border-lightgray" />
        <div className="pb-8 flex gap-6 xl:pb-16">
          <div className="w-2/5 space-y-6">
            <Statistics user={user} />
            <Photos user={user} />
          </div>
          <div className="w-3/5 space-y-6">
            <Lists user={user} />
            <Restaurants user={user} />
            <Reviews user={user} />
          </div>
        </div>
      </div>
    </div>
  );
}