import Link from 'next/link';
import {
  getRanking,
  getRestaurant,
  getSavedRestaurantsForUser,
} from '@/app/lib/dbFunctions';
import { Restaurant } from '@/app/interfaces/interfaces';
import RankingDisplay from './RankingDisplay';
import AddPlaceToRanking from './AddPlaceToRanking';
import checkRate from '@/app/lib/checkRate';
import GoogleMap from '@/app/components/GoogleMap';

export default async function CustomRanking({
  userId,
  rankingId,
}: {
  userId: string;
  rankingId: string;
}) {
  let ranking;

  try {
    ranking = await getRanking(rankingId);

    if (!ranking) {
      return <div>error: {rankingId}</div>;
    }
  } catch {
    return <div>Error fetching ranking</div>;
  }

  let restaurants: Restaurant[] = [];

  try {
    restaurants = (
      await Promise.all(
        ranking.restaurants.map(async (restaurantId) => {
          return await getRestaurant(restaurantId);
        })
      )
    ).filter((restaurant): restaurant is Restaurant => restaurant !== null);
  } catch {
    return <div>Error fetching restaurants</div>;
  }

  const savedRestaurants = await getSavedRestaurantsForUser(userId);
  const featureAccessAllowed = await checkRate(userId, 'map');

  return (
    <div className="page-layout lg:full-screen-page-layout">
      <div className="page-layout-inner lg:full-screen-page-layout-inner space-y-6 xl:space-y-8">
        <div className="breadcrumb flex flex-wrap gap-2">
          <Link href="/" className="link">
            Home
          </Link>
          <p>/</p>
          <Link href="/rankings" className="link">
            Rankings
          </Link>
          <p>/</p>
          <p>{ranking.name}</p>
        </div>
        <div className="flex gap-8">
          <div className="w-full flex items-end justify-between gap-4 lg:w-1/2">
            <h2>{ranking.name}</h2>
            <AddPlaceToRanking
              userId={userId}
              ranking={ranking}
              rankedRestaurants={restaurants}
              savedRestaurants={savedRestaurants}
            />
          </div>
          <div className="hidden w-full lg:block lg:w-1/2">

          </div>
        </div>
        <div className="min-h-0 flex flex-1 gap-8 lg:overflow-y-auto">
          <RankingDisplay
            userId={userId}
            featureAccessAllowed={featureAccessAllowed}
            ranking={ranking}
            restaurants={restaurants}
          />
          {featureAccessAllowed && (
            <GoogleMap restaurants={restaurants} />
          )}
        </div>
      </div>
    </div>
  );
}
