'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link';
import { SearchQueryResult, Place } from '@/app/interfaces/interfaces';
import { searchQuery, addPlace } from '@/app/actions/search';

export default function SearchResults({ userId, listId, query }: { userId: string, listId: string, query: string }) {
  // Default to San Jose, CA
  const [coords, setCoords] = useState<{ latitude: number; longitude: number }>({
    latitude: 37.335480,
    longitude: -121.893028
  });

  const [results, setResults] = useState<SearchQueryResult | null>(null);
  const [placeId, setPlaceId] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  // Used to clear query and close the modal
  const router = useRouter();
  const pathname = usePathname();

  // Get the geolocation on initial render
  useEffect(() => {
    function success(position: GeolocationPosition) {
      setCoords({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    }

    function error() {
      console.error('Unable to retrieve your location. Using default location (San Jose, CA).');
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    }
  }, []);

  // Fetch data when coords or query changes
  useEffect(() => {
    if (!coords) return;

    async function fetchData() {
      // Make sure the input is not null
      if (query) {
        const searchResults = await searchQuery(query, coords, userId);
        setResults(searchResults);
      }
    }

    fetchData();
  }, [coords, query]);

  const clearQuery = () => {
    router.replace(`${pathname}`);
  }

  const handleClick = async (place: Place) => {
    await addPlace(listId, place);
    setPlaceId(place._id);
    setShowConfirmation(true);
  }

  return (
    <div className="modal">
      <div className="modal-inner">
        <div className="p-2 flex items-center justify-between lg:p-4">
          <h2 className="modal-heading">Search results</h2>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 cursor-pointer lg:size-8" onClick={clearQuery}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </div>
        <hr className="border-slategray" />
        <div className="px-2 py-4 flex flex-col lg:px-4">
          { // Display an error message if no results were found
            // or if the user has exceeded their rate limit
            results?.kind === 'error' && (
              <p className="text-lg">{results.message}</p>
            )
          }
          { // Display search results
            results?.kind === 'success' && results.places.map((place) => {
              return (
                <div key={place._id} className="relative mb-8 space-y-2 bg-snowwhite cursor-pointer"
                  onClick={() => handleClick(place)}>
                  <div className="flex items-end gap-2 font-semibold">
                    <p className="text-xl">{place.name}</p>
                    {showConfirmation && place._id === placeId &&
                      <p className="text-darkpink">(Place has been added to your list!)</p>
                    }
                  </div>
                  <div className="flex gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
                    </svg>
                    <p className="text-md">{place.type}</p>
                  </div>
                  <div className="flex gap-2">
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
      </div>
    </div>
  );
}