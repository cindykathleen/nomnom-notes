import { Place } from '@/app/interfaces/interfaces';

export const searchPlace = async (query: string): Promise<Place[]> => {
  // Make sure apiKey is not undefined
  const apiKey = process.env.API_SECRET_KEY!;
  const endpoint = 'https://places.googleapis.com/v1/places:searchText';

  const body = {
    textQuery: query,
    // maxResultCount: 1,
    languageCode: 'en'
  };

  // The input has to be a string
  const fieldMask = [
    'places.id', // Essentials IDs Only SKU
    'places.displayName', // Pro SKU
    'places.googleMapsUri', // Pro SKU
    // 'places.googleMapsLinks', // Pro SKU
    'places.formattedAddress', // Essentials SKU
    // 'places.rating', // Enterprise SKU
    'places.photos', // Essentials IDs Only SKU
    'places.primaryTypeDisplayName' // Pro SKU
  ].join(',');

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': fieldMask
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} - ${response.statusText}`);
  }

  const data = await response.json();
  const places = data.places;

  const results = places.map((place: any) => {
    return {
      id: place.id,
      name: place.displayName.text,
      mapsUri: place.googleMapsUri,
      address: place.formattedAddress,
      photo: place.photos?.[0]?.name || "",
      type: place.primaryTypeDisplayName.text
    }
  });

  return results;
}