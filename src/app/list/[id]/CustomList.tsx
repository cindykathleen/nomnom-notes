import { db } from '@/app/lib/database';
import { Restaurant } from '@/app/interfaces/interfaces';
import Link from 'next/link';
import SortList from './SortList';
import RestaurantCard from './RestaurantCard';
import GoogleMap from './GoogleMap';

export default async function CustomList({ id }: { id: string }) {
  let list;

  try {
    list = await db.getList(id);

    if (!list) {
      return <div>Error fetching list</div>;
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
        <div className="flex gap-2">
          <Link href="/lists" className="font-semibold hover:text-mauve transition-colors">
            Lists
          </Link>
          <p className="font-semibold">/</p>
          <p>{list.name}</p>
        </div>
        <h1 className="text-4xl font-semibold">{list.name}</h1>
        <div className="max-h-full flex gap-8 overflow-y-auto">
          <div className="w-1/2 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{`${restaurants.length} Places`}</h2>
              <SortList />
            </div>
            <div className="max-h-[80vh] pr-4 flex flex-col gap-8 overflow-y-auto">
              {restaurants.map((restaurant: Restaurant) => (
                <RestaurantCard key={restaurant._id} listId={list._id} restaurant={restaurant} />
              ))}
            </div>
          </div>
          <div className="w-1/2">
            <GoogleMap restaurants={restaurants} />
          </div>
        </div>
      </div>
    </div>
  );
};