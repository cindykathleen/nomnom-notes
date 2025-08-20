import { db } from '@/app/lib/database';
import { Restaurant } from '@/app/interfaces/interfaces';
import Link from 'next/link';
import RestaurantDisplay from './RestaurantDisplay';
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
          <RestaurantDisplay list={list} restaurants={restaurants} />
          <GoogleMap restaurants={restaurants} />
        </div>
      </div>
    </div>
  );
};