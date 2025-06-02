'use client';

import { useListsContext } from '@/app/context/ListsContext';
import { RestaurantListing } from '@/app/components/RestaurantListing';
import { Sidebar } from '@/app/components/Sidebar';
import { Restaurant } from '@/app/interfaces/interfaces';

export default function RestaurantPage({ id }: { id: string }) {
  const { lists } = useListsContext();

  const getRestaurant = (id: string): Restaurant | null => {
    for (const list of lists) {
      const currentRestaurant = list.restaurants.find((restaurant: Restaurant) => restaurant.id === id);
      if (currentRestaurant) return currentRestaurant;
    }

    // Do not throw an error
    // On page reload, lists is re-initialized to an empty array 
    // The useEffect hook to fetch lists from localStorage is not called until AFTER the components mount
    // If you throw an error here, it will crash the component because it will not be able to find the restaurant with the given id that is passed in the URL
    // Instead, return null to indicate that the restaurant was not found
    // This allows the component to render without crashing
    
    return null;
  };

  const restaurant = getRestaurant(id);
  
  return (
    <div>
      <Sidebar />
      {restaurant && <RestaurantListing restaurant={restaurant} />}
    </div>
  );
}