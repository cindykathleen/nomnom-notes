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
    'places.location', // Essentials IDs Only SKU
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

  // Return an empty array if no places found
  if (!places || places.length === 0) {
    return [];
  }

  const results = places.map((place: any) => {
    return {
      _id: place.id,
      name: place.displayName.text,
      type: place.primaryTypeDisplayName?.text ?? "",
      address: place.formattedAddress,
      location: place.location,
      mapsUrl: place.googleMapsUri,
      photoId: place.photos?.[0]?.name ?? ""
    }
  });

  return results;
}