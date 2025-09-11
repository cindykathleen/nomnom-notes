import { db } from '@/app/lib/database';
import { Restaurant } from '@/app/interfaces/interfaces';
import Link from 'next/link';
import RestaurantDisplay from './RestaurantDisplay';
import GoogleMap from './GoogleMap';

export default async function CustomList({ userId, listId }: { userId: string, listId: string }) {
  const isOwnerOrCollaborator = await db.isOwnerOrCollaborator(userId, listId);
  let list;

  try {
    list = await db.getList(listId);

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
        const restaurant = await db.getRestaurant(restaurantId);

        if (!restaurant) {
          throw new Error(`Restaurant with ID ${restaurantId} not found`);
        }

        return restaurant;
      })
    );
  } catch (err) {
    return <div>Error fetching restaurants</div>;
  }

  return (
    <div className="fixed top-[80px] h-[calc(100vh-80px)] w-screen box-border p-16 flex justify-center">
      <div className="max-w-[1440px] w-full px-8 flex flex-col space-y-6">
        { // Don't display private pages for anyone other than the list owner
          isOwnerOrCollaborator && (
            <div className="flex gap-2">
              <Link href="/lists" className="font-semibold hover:text-mauve transition-colors">
                Lists
              </Link>
              <p className="font-semibold">/</p>
              <p>{list.name}</p>
            </div>
          )}
        <h1 className="text-4xl font-semibold">{list.name}</h1>
        <div className="max-h-full flex gap-8 overflow-y-auto">
          <RestaurantDisplay userId={userId} isOwnerOrCollaborator={isOwnerOrCollaborator} list={list} initialRestaurants={restaurants} />
          {/* { // Don't display a map for public users
            (userId !== 'public') && (
              <GoogleMap restaurants={restaurants} />
            )
          } */}
        </div>
      </div>
    </div>
  );
};