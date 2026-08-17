'use client';

import { useState } from 'react';
import { RankingList, Restaurant } from '@/app/interfaces/interfaces';
import RankingRestaurantCard from './RankingRestaurantCard';
import AddToRanking from './AddToRanking';

export default function RankingDisplay({
  userId,
  featureAccessAllowed,
  ranking,
  restaurants,
  savedRestaurants,
}: {
  userId: string;
  featureAccessAllowed: boolean;
  ranking: RankingList;
  restaurants: Restaurant[];
  savedRestaurants: Restaurant[];
}) {
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className={`${!featureAccessAllowed ? "w-full" : "w-full lg:w-1/2"} flex flex-col gap-2`}>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-8">
        <div className="w-full">
          <div className="h-[50px] flex items-center justify-start">
            <span
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-1 link text-lg xl:text-xl"
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
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:max-h-[80vh] lg:overflow-y-auto">
        {Array.from({ length: 10 }, (_, index) => {
          const restaurant = restaurants[index] ?? null;
          return (
            <RankingRestaurantCard
              key={restaurant?._id ?? `placeholder-${index + 1}`}
              userId={userId}
              rankingId={ranking._id}
              rank={index + 1}
              restaurant={restaurant}
            />
          );
        })}
      </div>
      {showAdd && (
        <AddToRanking
          userId={userId}
          ranking={ranking}
          rankedRestaurants={restaurants}
          savedRestaurants={savedRestaurants}
          onClose={() => setShowAdd(false)}
        />
      )}
    </div>
  );
}
