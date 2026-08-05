'use client';

import { useState, useMemo } from 'react';
import { List, Restaurant } from '@/app/interfaces/interfaces';
import SearchForm from './SearchForm';
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
  restaurants
}: {
  userId: string,
  isOwnerOrCollaborator: boolean,
  featureAccessAllowed: boolean,
  list: List,
  restaurants: Restaurant[]
}) {
  const [sort, setSort] = useState<SortType>(SortType.RecentlyAdded);
  const [showSearch, setShowSearch] = useState<boolean>(false);

  const sortedRestaurants = useMemo(() => {
    const sorted = [...restaurants];

    if (sort === SortType.RecentlyAdded) {
      sorted.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
    } else if (sort === SortType.Name) {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    }

    return sorted;
  }, [restaurants, sort]);

  return (
    <div className={`${userId === 'public' || !featureAccessAllowed ? "w-full" : "w-full lg:w-1/2"} flex flex-col gap-2`}>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-8">
        <h3 className="whitespace-nowrap" data-cy="number-of-restaurants">
          {`${sortedRestaurants.length} ${sortedRestaurants.length === 1 ? 'Place' : 'Places'}`}
        </h3>
        <div className="w-full">
          {isOwnerOrCollaborator && !showSearch &&
            <div className="h-[50px] flex items-center justify-end">
              <span onClick={() => setShowSearch(true)}
                className="flex items-center gap-1 link text-lg xl:text-xl" data-cy="restaurant-add-trigger">
                Add a place
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="shrink-0 size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </span>
            </div>
          }
          {isOwnerOrCollaborator && showSearch && (
            <SearchForm onClose={() => setShowSearch(false)} />
          )}
        </div>
      </div>
      <form className="flex items-center w-fit my-2">
        <p className="description text-nowrap mr-2">Sort by</p>
        <select className="w-full bg-transparent text-lg font-normal appearance-none focus:outline-none focus:ring-0 focus:border-gray-200 peer xl:text-xl"
          onChange={(e) => setSort(e.target.value as SortType)}>
          <option value={SortType.RecentlyAdded}>Recently added</option>
          <option value={SortType.Name}>Name</option>
        </select>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="shrink-0 size-4 ml-2">
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </form>
      <div
        className={`gap-4 lg:max-h-[80vh] lg:overflow-y-auto
        ${userId === 'public' || !featureAccessAllowed ? "grid grid-cols-2" : "flex flex-col"}`}
      >
        {sortedRestaurants.map((restaurant: Restaurant) => (
          <RestaurantCard
            key={restaurant._id}
            userId={userId}
            isOwnerOrCollaborator={isOwnerOrCollaborator}
            listId={list._id}
            restaurant={restaurant}
          />
        ))}
      </div>
    </div>
  );
}
