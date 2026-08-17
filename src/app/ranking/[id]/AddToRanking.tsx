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
    return savedRestaurants.filter((restaurant) => {
      if (normalized && !restaurant.name.toLowerCase().includes(normalized)) {
        return false;
      }
      return true;
    });
  }, [savedRestaurants, query]);

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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="modal-close"
              onClick={onClose}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </div>
          <hr className="border-lightgray" />
          <div className="px-2 py-4 flex flex-col gap-4 lg:px-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search your saved restaurants"
              className="input"
              autoComplete="off"
              data-cy="add-to-ranking-search"
            />
            <div className="max-h-[50vh] overflow-y-auto flex flex-col gap-2">
              {filteredRestaurants.length === 0 && (
                <p className="description-sm">No saved restaurants found.</p>
              )}
              {filteredRestaurants.map((restaurant) => {
                const alreadyRanked = rankedIds.has(restaurant._id);
                return (
                  <button
                    key={restaurant._id}
                    type="button"
                    disabled={alreadyRanked || isSubmitting}
                    onClick={() => handleSelect(restaurant)}
                    className={`w-full flex items-center gap-4 p-2 rounded-lg text-left transition-colors
                      ${alreadyRanked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-lightgray cursor-pointer'}`}
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
                      {alreadyRanked && (
                        <p className="description-sm">Already in this ranking</p>
                      )}
                    </div>
                  </button>
                );
              })}
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
