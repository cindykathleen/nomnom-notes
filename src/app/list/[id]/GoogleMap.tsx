'use client';

import { useEffect } from 'react';
import { Restaurant } from '@/app/interfaces/interfaces';
import { APIProvider, Map, AdvancedMarker, Pin, useMap } from '@vis.gl/react-google-maps';

const isTest = process.env.NEXT_PUBLIC_IS_TEST === 'test';
console.log('node env:', process.env.NEXT_PUBLIC_IS_TEST);

type Poi = {
  key: string,
  location: google.maps.LatLngLiteral
}

const PoiMarkers = ({ pois }: { pois: Poi[] }) => {
  return (
    <>
      {pois.map((poi: Poi) => (
        <AdvancedMarker key={poi.key} position={poi.location}>
          <Pin />
        </AdvancedMarker>
      ))}
    </>
  );
};

const FitBoundsHandler = ({ locations }: { locations: Poi[] }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || locations.length === 0) return;

    const bounds = new google.maps.LatLngBounds();
    locations.forEach((poi) => bounds.extend(poi.location));

    map.fitBounds(bounds);
  }, [map, locations]);

  return null;
};

export default function GoogleMap({ restaurants }: { restaurants: Restaurant[] }) {
  if (restaurants.length === 0) return null;

  const locations: Poi[] = restaurants.map((restaurant) => ({
    key: restaurant._id,
    location: {
      lat: restaurant.location.latitude,
      lng: restaurant.location.longitude,
    },
  }));

  return (
    <div className="hidden lg:block lg:w-1/2" data-cy="map-display">
      { // Mock the Google Map display during testing 
        isTest && (
          <div className="hidden lg:block lg:w-1/2" data-cy="map-display">
            <p>Mock map display for testing</p>
          </div>
        )
      }
      {
        !isTest && (
          <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY!}>
            <Map mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_ID!} defaultCenter={locations[0].location} defaultZoom={4}>
              <PoiMarkers pois={locations} />
              <FitBoundsHandler locations={locations} />
            </Map>
          </APIProvider>
        )
      }
    </div>
  );
}