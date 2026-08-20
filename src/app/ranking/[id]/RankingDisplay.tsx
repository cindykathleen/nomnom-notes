'use client';

import { useEffect, useState } from 'react';
import { RankingList, Restaurant } from '@/app/interfaces/interfaces';
import RankingRestaurantCard from './RankingRestaurantCard';
import DndWrapper from '@/app/components/DndWrapper';
import { moveRestaurantInRanking } from '@/app/actions/ranking';

export default function RankingDisplay({
  userId,
  featureAccessAllowed,
  ranking,
  restaurants,
}: {
  userId: string;
  featureAccessAllowed: boolean;
  ranking: RankingList;
  restaurants: Restaurant[];
}) {
  const [orderedRestaurants, setOrderedRestaurants] = useState(restaurants);

  useEffect(() => {
    setOrderedRestaurants(restaurants);
  }, [restaurants]);

  const handleMove = (dragIndex: number, hoverIndex: number) => {
    setOrderedRestaurants((prev) => {
      const next = [...prev];
      const [dragItem] = next.splice(dragIndex, 1);
      next.splice(hoverIndex, 0, dragItem);
      return next;
    });
    moveRestaurantInRanking(userId, ranking._id, dragIndex, hoverIndex);
  };

  return (
    <DndWrapper>
      <div className={`${!featureAccessAllowed ? "w-full" : "w-full lg:w-1/2"} flex flex-col gap-2`}>
        <div className="pb-8 flex flex-col lg:max-h-[80vh] lg:pb-0 lg:overflow-y-auto">
          {Array.from({ length: 10 }, (_, index) => {
            const restaurant = orderedRestaurants[index] ?? null;
            return (
              <RankingRestaurantCard
                key={restaurant?._id ?? `placeholder-${index + 1}`}
                userId={userId}
                rankingId={ranking._id}
                rank={index + 1}
                index={index}
                restaurant={restaurant}
                onMove={handleMove}
              />
            );
          })}
        </div>
      </div>
    </DndWrapper>
  );
}
