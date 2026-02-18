import { getProfileData } from '@/app/lib/dbFunctions';
import { User } from '@/app/interfaces/interfaces';
import Hero from './Hero';
import Statistics from './Statistics';
import Photos from './Photos';
import Lists from './Lists';
import Restaurants from './Restaurants';
import Reviews from './Reviews';

export default async function Profile({ user }: { user: User }) {
  const { stats, lists, restaurants, reviews } = await getProfileData(user._id);

  return (
    <div className="gated-page-layout">
      <div className="gated-page-layout-inner">
        <Hero user={user} />
        <hr className="border-lightgray" />
        <div className="pb-8 flex flex-col gap-6 xl:pb-16 lg:flex-row">
          <div className="w-full space-y-6 lg:w-2/5">
            <Statistics stats={stats} />
            <Photos user={user} />
          </div>
          <div className="w-full space-y-6 lg:w-3/5">
            <Lists lists={lists} />
            <Restaurants restaurants={restaurants} />
            <Reviews reviews={reviews} />
          </div>
        </div>
      </div>
    </div>
  );
}