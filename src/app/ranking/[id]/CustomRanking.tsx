import Link from 'next/link';
import {
  getRanking,
  getRestaurant,
  getSavedRestaurantsForUser,
} from '@/app/lib/dbFunctions';
import { Restaurant } from '@/app/interfaces/interfaces';
import RankingDisplay from './RankingDisplay';
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
        <h2>{ranking.name}</h2>
        {ranking.description && (
          <p className="description">{ranking.description}</p>
        )}
        <div className="min-h-0 flex flex-1 gap-8 lg:overflow-y-auto">
          <RankingDisplay
            userId={userId}
            featureAccessAllowed={featureAccessAllowed}
            ranking={ranking}
            restaurants={restaurants}
            savedRestaurants={savedRestaurants}
          />
          {featureAccessAllowed && (
            <GoogleMap restaurants={restaurants} />
          )}
        </div>
      </div>
    </div>
  );
}
