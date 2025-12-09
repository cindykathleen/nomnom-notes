'use client';

import { useState, useEffect } from 'react';
import { List, Recommendation, SearchQueryResult } from '@/app/interfaces/interfaces';
import { searchQuery } from '@/app/actions/search';
import getRecommendations from '@/app/lib/getRecommendations';
import SearchForm from './SearchForm';
import SearchResults from './SearchResults';
import Recommendations from './Recommendations';

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
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

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

      // Fetch recommendations
      const recommendationResults = await getRecommendations(6, coords);
      setRecommendations(recommendationResults);
    }

    fetchData();
  }, [coords, query]);

  return (
    <div className="gated-page-layout">
      <div className="gated-page-layout-inner">
        { // Default search page
          !results && (
            <>
              <div className="max-w-3xl w-full mx-auto mb-8 space-y-4 md:mb-16 md:space-y-8">
                <h1 className="text-2xl font-semibold text-center md:text-3xl lg:text-4xl">Search for a restaurant</h1>
                <SearchForm />
              </div>
              <div className="md:space-y-12">
                <h2 className="text-xl font-semibold text-center md:text-2xl md:text-left lg:text-3xl">Need some recommendations?</h2>
                <Recommendations recommendations={recommendations} />
              </div>
            </>
          )
        }
        { // Search results page
          results && (
            <div className="flex flex-col space-y-8">
              <div className="max-w-3xl w-full mx-auto mb-8 xl:mb-16">
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
          )
        }
      </div>
    </div>
  );
}