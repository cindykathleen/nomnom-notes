import { User } from '@/app/interfaces/interfaces';
import { getProfileData } from '@/app/lib/dbFunctions';
import Photos from './Photos';
import Rankings from './Rankings';
import Lists from './Lists';
import Restaurants from './Restaurants';
import Reviews from './Reviews';

export default async function ProfileDetails({ user }: { user: User }) {
  const { stats, lists, rankings, restaurants, reviews } = await getProfileData(user._id);

  return (
    <div className="pb-8 flex flex-col-reverse gap-6 xl:pb-16 lg:flex-row">
      <div className="w-full space-y-6 lg:w-2/5">
        <Rankings rankings={rankings} stats={stats.rankingsCount} userId={user._id} />
        <Photos user={user} />
      </div>
      <div className="w-full space-y-6 lg:w-3/5">
        <Lists lists={lists} stats={stats.listsCount} userId={user._id} />
        <Restaurants restaurants={restaurants} stats={stats.restaurantsCount} userId={user._id} />
        <Reviews reviews={reviews} stats={stats.reviewsCount} userId={user._id} />
      </div>
    </div>
  );
}
