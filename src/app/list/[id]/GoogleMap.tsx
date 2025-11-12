'use client';

import { Restaurant } from '@/app/interfaces/interfaces';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

type Poi = {
  key: string,
  location: google.maps.LatLngLiteral
}

const PoiMarkers = (props: { pois: Poi[] }) => {
  return (
    <>
      {props.pois.map((poi: Poi) => (
        <AdvancedMarker
          key={poi.key}
          position={poi.location}>
          <Pin />
        </AdvancedMarker>
      ))}
    </>
  );
};

const computeCenter = (locations: Poi[]) => {
  const lats = locations.map((p) => p.location.lat);
  const lngs = locations.map((p) => p.location.lng);

  const avgLat = lats.reduce((sum, val) => sum + val, 0) / lats.length;
  const avgLng = lngs.reduce((sum, val) => sum + val, 0) / lngs.length;

  return { lat: avgLat, lng: avgLng };
}

export default function GoogleMap({ restaurants }: { restaurants: Restaurant[] }) {
  if (restaurants.length === 0) {
    return;
  }

  const locations: Poi[] = restaurants.map((restaurant) => ({
    key: restaurant._id,
    location: {
      lat: restaurant.location.latitude,
      lng: restaurant.location.longitude,
    },
  }));

  const center = locations.length
    ? computeCenter(locations)
    : { lat: 0, lng: 0 };

  return (
    <div className="hidden lg:block lg:w-1/2" data-cy="map-display">
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY!}>
        <Map defaultZoom={12} defaultCenter={center} mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_ID!}>
          <PoiMarkers pois={locations} />
        </Map>
      </APIProvider>
    </div>
  );
}