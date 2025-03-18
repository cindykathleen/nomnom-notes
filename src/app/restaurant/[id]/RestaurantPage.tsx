'use client';

import { RestaurantListing } from '@/app/components/RestaurantListing';
import { Sidebar } from '@/app/components/Sidebar';
import { Restaurant } from '@/app/interfaces/interfaces';

export default function RestaurantPage({ id }: { id: string }) {
  const storedLists = JSON.parse(localStorage.getItem("lists")!);

  const restaurant = (id: string): Restaurant  => {
    for (const list of storedLists) {
      const currentRestaurant = list.restaurants.find((restaurant: Restaurant) => restaurant.id === id);
      if (currentRestaurant) return currentRestaurant;
    }
    
    throw new Error(`Restaurant with id ${id} not found`);
  };
  
  return (
    <div>
      <Sidebar />
      <RestaurantListing restaurant={restaurant(id)} />
    </div>
  );
}