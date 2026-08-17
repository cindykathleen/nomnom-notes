import { isOwnerOrCollaboratorDb, getList, getRestaurant } from '@/app/lib/dbFunctions';
import { Restaurant } from '@/app/interfaces/interfaces';
import Link from 'next/link';
import RestaurantDisplay from './RestaurantDisplay';
import checkRate from '@/app/lib/checkRate';
import GoogleMap from '@/app/components/GoogleMap';
import SearchResults from './SearchResults';

export default async function CustomList({ userId, listId, query }: { userId: string, listId: string, query?: string }) {
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
    <div className="page-layout lg:full-screen-page-layout">
      <div className="page-layout-inner lg:full-screen-page-layout-inner space-y-6 xl:space-y-8">
        { // Don't display private pages for anyone other than the list owner / collaborator
          isOwnerOrCollaborator && (
            <div className="breadcrumb flex flex-wrap gap-2">
              <Link href="/" className="link">
                Home
              </Link>
              <p>/</p>
              <Link href="/lists" className="link">
                Lists
              </Link>
              <p>/</p>
              <p>{list.name}</p>
            </div>
          )}
        <h2>{list.name}</h2>
        <div className="min-h-0 flex flex-1 gap-8 lg:overflow-y-auto">
          <RestaurantDisplay
            userId={userId}
            isOwnerOrCollaborator={isOwnerOrCollaborator}
            featureAccessAllowed={featureAccessAllowed}
            list={list}
            restaurants={restaurants}
          />
          { // Don't display a map for public users or if the user has passed their rate limit
            (userId !== 'public') && featureAccessAllowed && (
              <GoogleMap restaurants={restaurants} />
            )
          }
        </div>
        {query && isOwnerOrCollaborator && (
          <SearchResults userId={userId} listId={listId} query={query} />
        )}
      </div>
    </div>
  );
};