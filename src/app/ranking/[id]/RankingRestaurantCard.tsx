'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Restaurant } from '@/app/interfaces/interfaces';
import { removeRestaurantFromRanking } from '@/app/actions/ranking';

/**
 * Truncates a Google Places-style address to a short location label.
 * USA: "city, state, country" (e.g. "Cupertino, CA, USA")
 * International: "city, country" (e.g. "Paris, France")
 */
function formatRestaurantLocation(address: string): string {
  const parts = address
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0];

  const country = parts[parts.length - 1];
  const isUSA = /^(USA|US|United States)$/i.test(country);
  const normalizedCountry = /^United States$/i.test(country) ? 'USA' : country;

  if (isUSA) {
    if (parts.length >= 3) {
      const stateZip = parts[parts.length - 2];
      const state = stateZip.split(/\s+/)[0];
      const city = parts[parts.length - 3];
      return `${city}, ${state}, ${normalizedCountry}`;
    }

    return `${parts[parts.length - 2]}, ${normalizedCountry}`;
  }

  // International: city is usually the second-to-last segment
  let city = parts[parts.length - 2];
  // "75007 Paris" -> "Paris"
  city = city.replace(/^\d+[A-Za-z]?\s+/, '');
  // "Tokyo 131-0045" -> "Tokyo"
  city = city.replace(/\s+\d+[-\dA-Za-z]*$/, '');

  return `${city}, ${country}`;
}

export default function RankingRestaurantCard({
  userId,
  rankingId,
  rank,
  restaurant,
}: {
  userId: string;
  rankingId: string;
  rank: number;
  restaurant: Restaurant | null;
}) {
  const [showRemoveAlert, setShowRemoveAlert] = useState(false);

  if (!restaurant) {
    return (
      <div data-cy="ranked-restaurant-placeholder">
        <div className="w-full p-4 flex border-b border-b-lightgray">
          <div className="min-w-0 flex items-center gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"
              className="shrink-0 size-6 opacity-0 lg:size-8"
            >
              <circle cx="9" cy="5" r="2" />
              <circle cx="9" cy="12" r="2" />
              <circle cx="9" cy="19" r="2" />
              <circle cx="15" cy="5" r="2" />
              <circle cx="15" cy="12" r="2" />
              <circle cx="15" cy="19" r="2" />
            </svg>
            <div className="flex flex-col gap-1 min-w-0">
              <h5 className="opacity-40">{rank}. Empty</h5>
              <p className="description-sm"></p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div data-cy="ranked-restaurant">
      <Link href={`/restaurant/${restaurant._id}`}>
        <div className="border-b border-b-lightgray">
          <div className="group w-full px-4 py-2 my-2 flex items-start justify-between gap-4 cursor-pointer
          border-l-4 border-l-transparent hover:border-l-dustypink transition-colors"
          >
            <div className="min-w-0 flex items-center gap-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"
                className="shrink-0 size-6 opacity-0 transition-opacity group-hover:opacity-100 lg:size-8"
              >
                <circle cx="9" cy="5" r="2" />
                <circle cx="9" cy="12" r="2" />
                <circle cx="9" cy="19" r="2" />
                <circle cx="15" cy="5" r="2" />
                <circle cx="15" cy="12" r="2" />
                <circle cx="15" cy="19" r="2" />
              </svg>
              <div className="flex flex-col gap-1 min-w-0">
                <h5>{rank}. {restaurant.name}</h5>
                <p className="description-sm">{formatRestaurantLocation(restaurant.address)}</p>
              </div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
              className="shrink-0 size-6" data-cy="remove-ranked-restaurant-trigger"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowRemoveAlert(true); }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </div>
        </div>
      </Link>
      {showRemoveAlert && (
        <div className="modal" data-cy="remove-ranked-restaurant-modal">
          <div role="alert" className="modal-alert-inner">
            <h4 className="modal-heading">
              Are you sure you want to remove {restaurant.name} from the ranking?
            </h4>
            <div className="flex gap-4">
              <button
                type="button"
                data-cy="remove-ranked-restaurant-button"
                className="button-primary"
                onClick={async () => {
                  await removeRestaurantFromRanking(userId, rankingId, restaurant._id);
                  setShowRemoveAlert(false);
                }}
              >
                Yes
              </button>
              <button
                type="button"
                className="button-secondary"
                onClick={() => setShowRemoveAlert(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
