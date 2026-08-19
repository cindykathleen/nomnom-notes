'use client';

import { useState } from 'react';
import { RankingList, Restaurant } from '@/app/interfaces/interfaces';
import AddToRanking from './AddToRanking';

export default function AddPlaceToRanking({
  userId,
  ranking,
  rankedRestaurants,
  savedRestaurants,
}: {
  userId: string;
  ranking: RankingList;
  rankedRestaurants: Restaurant[];
  savedRestaurants: Restaurant[];
}) {
  const [showAdd, setShowAdd] = useState(false);

  return (
    <>
      <span
        onClick={() => setShowAdd(true)}
        className="flex items-center gap-1 link text-lg xl:text-xl whitespace-nowrap"
        data-cy="ranking-add-trigger"
      >
        Add a place
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="shrink-0 size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      </span>
      {showAdd && (
        <AddToRanking
          userId={userId}
          ranking={ranking}
          rankedRestaurants={rankedRestaurants}
          savedRestaurants={savedRestaurants}
          onClose={() => setShowAdd(false)}
        />
      )}
    </>
  );
}
