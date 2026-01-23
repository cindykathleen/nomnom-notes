'use client';

import { useState, useEffect } from 'react';
import { List, SearchQueryResult } from '@/app/interfaces/interfaces';
import { searchQuery } from '@/app/actions/search';
import SearchForm from './SearchForm';
import SearchResults from './SearchResults';
import Image from 'next/image';

interface SearchProps {
  query: string | undefined,
  userId: string,
  lists: List[]
}

export default function Search({ query, userId, lists }: SearchProps) {
  // Default to San Jose, CA
  const [coords, setCoords] = useState<{ latitude: number; longitude: number }>({
    latitude: 37.335480,
    longitude: -121.893028
  });

  const [results, setResults] = useState<SearchQueryResult | null>(null);

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

  return (
    <>
      { // Default search page
        !results && (
          <div className="search-page-layout">
            <div className="search-page-layout-inner">
              <div className="max-w-3xl w-full space-y-4 md:space-y-8">
                <Image src="/logo-search.png" alt="NomNom Notes logo" width={500} height={102} 
                  className="mx-auto"
                />
                <SearchForm />
              </div>
            </div>
          </div>
        )
      }
      { // Search results page
        results && (
          <div className="gated-page-layout">
            <div className="gated-page-layout-inner">
              <div className="max-w-5xl flex flex-col space-y-8">
                <div className="w-full mb-8 xl:mb-16">
                  <SearchForm query={query} />
                </div>
                { // Display an error message if no results were found
                  // or if the user has exceeded their rate limit
                  results?.kind === 'error' && (
                    <p className="text-lg" data-cy="error-message">{results.message}</p>
                  )
                }
                { // Display search results
                  results?.kind === 'success' && (
                    <SearchResults lists={lists} places={results.places} />
                  )
                }
              </div>
            </div>
          </div>
        )
      }

    </>
  );
}