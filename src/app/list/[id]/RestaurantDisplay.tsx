'use client';

import { useState, useMemo } from 'react';
import { List, Restaurant } from '@/app/interfaces/interfaces';
import RestaurantCard from "./RestaurantCard";

enum SortType {
  RecentlyAdded = 'recently-added',
  Name = 'name'
}

export default function RestaurantDisplay({ 
  userId, 
  isOwnerOrCollaborator, 
  featureAccessAllowed,
  list, 
  initialRestaurants 
}: { 
  userId: string, 
  isOwnerOrCollaborator: boolean, 
  featureAccessAllowed: boolean,
  list: List, 
  initialRestaurants: Restaurant[] 
}) {
  const [sort, setSort] = useState<SortType>(SortType.RecentlyAdded);
  const [restaurants, setRestaurants] = useState<Restaurant[]>(initialRestaurants);

  const sortRestaurants = () => {
    if (sort === SortType.RecentlyAdded) {
      restaurants.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
    } else if (sort === SortType.Name) {
      restaurants.sort((a, b) => a.name.localeCompare(b.name));
    }

    // Using the spread operator to ensure a new array reference
    // This is important for React to detect changes and re-render components
    setRestaurants([...restaurants]);
  }

  useMemo(() => {
    sortRestaurants();
  }, [sort]);

  const onUpdate = (updatedRestaurant: Restaurant) => {
    const updatedRestaurants = restaurants.map((restaurant) =>
      restaurant._id === updatedRestaurant._id ? updatedRestaurant : restaurant
    );

    setRestaurants(updatedRestaurants);
  }

  const onDelete = (deletedRestaurantId: string) => {
    const updatedRestaurants = restaurants.filter((restaurant) => restaurant._id !== deletedRestaurantId);

    setRestaurants(updatedRestaurants);
  }

  return (
    <div className={`${userId === 'public' || !featureAccessAllowed ? "w-full" : "w-1/2"} flex flex-col gap-2`}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold" data-cy="number-of-restaurants">{`${restaurants.length} ${restaurants.length === 1 ? 'Place' : 'Places'}`}</h2>
        <form className="flex items-center w-fit my-2">
          <p className="text-lg text-nowrap mr-2">Sort by</p>
          <select className="w-full bg-transparent text-lg font-semibold appearance-none focus:outline-none focus:ring-0 focus:border-gray-200 peer"
            onChange={(e) => setSort(e.target.value as SortType)}>
            <option value={SortType.RecentlyAdded}>Recently added</option>
            <option value={SortType.Name}>Name</option>
          </select>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </form>
      </div>
      <div
        className={`max-h-[80vh] overflow-y-auto gap-8 
        ${userId === 'public' || !featureAccessAllowed ? "grid grid-cols-2" : "pr-4 flex flex-col"}`}
      >
        {restaurants.map((restaurant: Restaurant) => (
          <RestaurantCard
            key={restaurant._id}
            userId={userId}
            isOwnerOrCollaborator={isOwnerOrCollaborator}
            listId={list._id}
            restaurant={restaurant}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}