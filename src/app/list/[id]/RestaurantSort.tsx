'use client';

import { useState } from 'react';

enum SortType {
  RecentlyAdded = 'recently-added',
  Name = 'name'
}

export default function RestaurantSort() {
  const [sort, setSort] = useState<SortType>(SortType.RecentlyAdded);

  return (
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
  );
}