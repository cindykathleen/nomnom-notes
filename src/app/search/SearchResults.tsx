'use client';

import { List, Place } from '@/app/interfaces/interfaces';
import { useState } from 'react';
import Link from 'next/link';
import { addPlace } from '@/app/actions/search';

export default function SearchResults({ lists, places }: { lists: List[], places: Place[] }) {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  // State for modal
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  return (
    <div className="flex gap-8" data-cy="search-results">
      <div className="w-full flex flex-col">
        {places.map((place) => {
          return (
            <div key={place._id} className="relative mb-8 bg-snowwhite cursor-pointer" data-cy="search-result-place"
              onClick={() => setSelectedPlace(place)}>
              <p className="text-xl font-semibold pb-2">{place.name}</p>
              <div className="flex gap-2 pb-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
                </svg>
                <p className="text-md">{place.type}</p>
              </div>
              <div className="flex gap-2 pb-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                <p className="text-md">{place.address}</p>
              </div>
              <Link href={place.mapsUrl} target="_blank" className="block w-fit">
                <div className="group flex gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="group-hover:stroke-mauve size-6 transition-colors">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                  <p className="text-md group-hover:text-mauve transition-colors">Google Maps</p>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
      {selectedPlace && (
        <div className="min-w-xl h-fit px-6 py-4 border border-lightgray rounded-lg">
          <div className="p-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-darkpink">Add {selectedPlace.name} to your list</h2>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 cursor-pointer" onClick={() => setSelectedPlace(null)}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </div>
          <hr className="border-slategray" />
          <div className="p-4 flex flex-col">
            <p className="pb-4 text-lg font-bold">Select a list</p>
            <div className="flex flex-col gap-4">
              {lists.map((list) => {
                return (
                  <div key={list._id} className="flex gap-4 cursor-pointer" data-cy="search-result-list"
                    onClick={async () => { await addPlace(list._id, selectedPlace); setShowConfirmation(true); }}>
                    <img className="max-w-24 aspect-square rounded-lg mb-4" src={list.photoUrl} alt={list.name} />
                    <div>
                      <p className="font-semibold">{list.name}</p>
                      <p>{list.restaurants.length} places</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      { // Confirmation that the restaurant has been added to a list
        showConfirmation && (
          <div className="modal">
            <div role="alert" className="modal-alert-inner">
              <h3 className="modal-alert-heading">The restaurant has been added to the list</h3>
              <button type="button" data-cy="search-result-confirmation" className="button-primary"
                onClick={() => { setShowConfirmation(false); setSelectedPlace(null); }}
              >
                Ok
              </button>
            </div>
          </div>
        )
      }
    </div>
  );
}
