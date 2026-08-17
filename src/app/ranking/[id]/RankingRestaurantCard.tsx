'use client';

import { useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import type { Identifier, XYCoord } from 'dnd-core';
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

interface DragItem {
  id: string;
  index: number;
}

export default function RankingRestaurantCard({
  userId,
  rankingId,
  rank,
  index,
  restaurant,
  onMove,
}: {
  userId: string;
  rankingId: string;
  rank: number;
  index: number;
  restaurant: Restaurant | null;
  onMove: (dragIndex: number, hoverIndex: number) => void;
}) {
  const [showRemoveAlert, setShowRemoveAlert] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const didDragRef = useRef(false);

  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
    accept: 'ranked-restaurant',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!restaurant || !ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Dragging downward past the midpoint
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upward past the midpoint
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      onMove(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'ranked-restaurant',
    item: () => {
      didDragRef.current = false;
      return { id: restaurant?._id ?? '', index };
    },
    canDrag: !!restaurant,
    end: () => {
      didDragRef.current = true;
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));


  if (!restaurant) {
    return (
      <div data-cy="ranked-restaurant-placeholder">
        <div className="w-full p-4 flex border-b border-b-lightgray">
          <div className="min-w-0 flex items-center gap-4">
            {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"
              className="shrink-0 size-6 opacity-0 lg:size-8"
            >
              <circle cx="9" cy="5" r="2" />
              <circle cx="9" cy="12" r="2" />
              <circle cx="9" cy="19" r="2" />
              <circle cx="15" cy="5" r="2" />
              <circle cx="15" cy="12" r="2" />
              <circle cx="15" cy="19" r="2" />
            </svg> */}
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
    <div
      ref={ref}
      data-handler-id={handlerId}
      data-cy="ranked-restaurant"
      style={{ opacity: isDragging ? 0.4 : 1 }}
      className="cursor-grab active:cursor-grabbing"
    >
      <div className="border-b border-b-lightgray">
        <div className="group w-full px-4 py-2 my-2 flex items-start justify-between gap-4
          border-l-4 border-l-lightgray hover:border-l-dustypink transition-colors"
        >
          <div className="min-w-0 flex items-center gap-4">
            {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"
              className="shrink-0 size-6 opacity-40 transition-opacity group-hover:opacity-100 lg:size-8"
              data-cy="ranked-restaurant-drag-handle"
            >
              <circle cx="9" cy="5" r="2" />
              <circle cx="9" cy="12" r="2" />
              <circle cx="9" cy="19" r="2" />
              <circle cx="15" cy="5" r="2" />
              <circle cx="15" cy="12" r="2" />
              <circle cx="15" cy="19" r="2" />
            </svg> */}
            <Link
              href={`/restaurant/${restaurant._id}`}
              className="flex flex-col gap-1 min-w-0 cursor-grab active:cursor-grabbing"
              onClick={(e) => {
                if (didDragRef.current || isDragging) {
                  e.preventDefault();
                  didDragRef.current = false;
                }
              }}
            >
              <h5>{rank}. {restaurant.name}</h5>
              <p className="description-sm">{formatRestaurantLocation(restaurant.address)}</p>
            </Link>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
            className="shrink-0 size-6 cursor-pointer" data-cy="remove-ranked-restaurant-trigger"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowRemoveAlert(true); }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </div>
      </div>
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