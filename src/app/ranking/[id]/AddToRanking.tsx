'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { RankingList, Restaurant } from '@/app/interfaces/interfaces';
import { addRestaurantToRanking } from '@/app/actions/ranking';

export default function AddToRanking({
  userId,
  ranking,
  rankedRestaurants,
  savedRestaurants,
  onClose,
}: {
  userId: string;
  ranking: RankingList;
  rankedRestaurants: Restaurant[];
  savedRestaurants: Restaurant[];
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const [pendingRestaurant, setPendingRestaurant] = useState<Restaurant | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const rankedIds = useMemo(
    () => new Set(rankedRestaurants.map((restaurant) => restaurant._id)),
    [rankedRestaurants]
  );

  const restaurantAtRank10 = rankedRestaurants.length === 10 ? rankedRestaurants[9] : null;

  const filteredRestaurants = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const available = savedRestaurants.filter((restaurant) => {
      if (rankedIds.has(restaurant._id)) return false;
      if (normalized && !restaurant.name.toLowerCase().includes(normalized)) {
        return false;
      }
      return true;
    });
    return available.slice(0, 10);
  }, [savedRestaurants, query, rankedIds]);

  const handleSelect = async (restaurant: Restaurant) => {
    if (rankedIds.has(restaurant._id) || isSubmitting) return;

    if (restaurantAtRank10) {
      setPendingRestaurant(restaurant);
      return;
    }

    await confirmAdd(restaurant);
  };

  const confirmAdd = async (restaurant: Restaurant) => {
    setIsSubmitting(true);
    const result = await addRestaurantToRanking(userId, ranking._id, restaurant._id);
    setIsSubmitting(false);

    if (result.error) {
      return;
    }

    setPendingRestaurant(null);
    onClose();
  };

  return (
    <>
      <div className="modal" data-cy="add-to-ranking-modal">
        <div className="modal-inner">
          <div className="p-2 flex items-center justify-between lg:p-4">
            <h4 className="modal-heading">Add to {ranking.name}</h4>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
              className="modal-close" onClick={onClose}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </div>
          <hr className="border-lightgray" />
          <div className="px-2 py-4 flex flex-col gap-4 lg:px-4">
            <input type="text" autoComplete="off" placeholder="Search your saved restaurants" className="input" 
              data-cy="add-to-ranking-search" value={query} onChange={(e) => setQuery(e.target.value)}
            />
            <div className="h-[50vh] overflow-y-auto flex flex-col gap-2">
              {filteredRestaurants.length === 0 && (
                <p className="description">No saved restaurants found.</p>
              )}
              {filteredRestaurants.map((restaurant) => (
                  <button
                    key={restaurant._id}
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleSelect(restaurant)}
                    className="w-full p-2 flex items-center gap-4 text-lef trounded-lg cursor-pointer transition-colors hover:bg-highlight"
                    data-cy="add-to-ranking-option"
                  >
                    <Image
                      src={restaurant.photoUrl}
                      alt={restaurant.name}
                      width={64}
                      height={64}
                      className="h-16 w-16 aspect-square object-cover rounded-lg"
                    />
                    <div className="flex flex-col min-w-0">
                      <h5 className="truncate">{restaurant.name}</h5>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>
      {pendingRestaurant && restaurantAtRank10 && (
        <div className="modal" data-cy="ranking-full-confirm-modal">
          <div role="alert" className="modal-alert-inner">
            <h4 className="modal-heading">
              {`Adding restaurant ${pendingRestaurant.name} will remove restaurant ${restaurantAtRank10.name} from the rankings.`}
            </h4>
            <div className="flex gap-4">
              <button
                type="button"
                className="button-secondary"
                data-cy="ranking-full-confirm-cancel"
                onClick={() => setPendingRestaurant(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="button-primary"
                data-cy="ranking-full-confirm-ok"
                disabled={isSubmitting}
                onClick={() => confirmAdd(pendingRestaurant)}
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
