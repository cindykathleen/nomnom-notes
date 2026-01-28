import { isOwnerOrCollaboratorDb, getList, getRestaurant } from '@/app/lib/dbFunctions';
import { Restaurant } from '@/app/interfaces/interfaces';
import Link from 'next/link';
import RestaurantDisplay from './RestaurantDisplay';
import checkRate from '@/app/lib/checkRate';
import GoogleMap from './GoogleMap';

export default async function CustomList({ userId, listId }: { userId: string, listId: string }) {
  const isOwnerOrCollaborator = await isOwnerOrCollaboratorDb(userId, listId);

  let list;

  try {
    list = await getList(listId);

    if (!list) {
      return <div>error: {listId}</div>;
    }
  } catch (err) {
    return <div>Error fetching list</div>;
  }

  let restaurants: Restaurant[] = [];

  try {
    restaurants = await Promise.all(
      list.restaurants.map(async (restaurantId) => {
        const restaurant = await getRestaurant(restaurantId);

        if (!restaurant) {
          throw new Error(`Restaurant with ID ${restaurantId} not found`);
        }

        return restaurant;
      })
    );
  } catch (err) {
    return <div>Error fetching restaurants</div>;
  }

  // Check if the user has passed their rate limit before allowing them to send in a new search request
  const featureAccessAllowed = await checkRate(userId, 'map');

  return (
    <div className="gated-page-layout">
      <div className="gated-page-layout-inner">
        { // Don't display private pages for anyone other than the list owner / collaborator
          isOwnerOrCollaborator && (
            <div className="flex flex-wrap gap-2">
              <Link href="/" className="breadcrumb-link">
                Lists
              </Link>
              <p className="font-semibold">/</p>
              <p>{list.name}</p>
            </div>
          )}
        <h1 className="page-heading">{list.name}</h1>
        <div className="max-h-full flex gap-8 overflow-y-auto">
          <RestaurantDisplay
            userId={userId}
            isOwnerOrCollaborator={isOwnerOrCollaborator}
            featureAccessAllowed={featureAccessAllowed}
            list={list}
            initialRestaurants={restaurants}
          />
          { // Don't display a map for public users or if the user has passed their rate limit
            (userId !== 'public') && featureAccessAllowed && (
              <GoogleMap restaurants={restaurants} />
            )
          }
        </div>
      </div>
    </div>
  );
};