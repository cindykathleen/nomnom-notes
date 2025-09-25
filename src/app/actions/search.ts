'use server';

import checkRate from '@/app/lib/checkRate';
import { db } from '@/app/lib/database';
import { searchPlace } from '@/app/lib/GooglePlacesAPI';
import { Place, Restaurant, SearchQueryResult } from '@/app/interfaces/interfaces';
import { getGooglePhoto } from './images';
import { v4 as uuidv4 } from 'uuid';

export const searchQuery = async (searchQuery: string, userId: string): Promise<SearchQueryResult> => {
  const query = searchQuery.toLowerCase();

  // Check if the query is already stored in the database
  const storedPlaces = await db.getSearchResults(query);

  if (storedPlaces) {
    return { kind: 'success', places: storedPlaces };
  }

  // Check if the user has passed their rate limit before allowing them to send in a new search request
  const featureAccessAllowed = await checkRate(userId, 'search');

  if (!featureAccessAllowed) {
    return { kind: 'error', message: 'You have exceeded your search rate limit. Please try again later.' };
  }

  // Send a new search request
  const searchedPlaces = await searchPlace(query, false);
  
  // Store the new search into the database
  await db.addSearchResult(query, searchedPlaces);

  if (searchedPlaces.length === 0) {
    return { kind: 'error', message: 'No results found. Please try a different search query.' };
  }

  return { kind: 'success', places: searchedPlaces };
}

export const addPlace = async (listId: string, place: Place) => {
  // TODO: Check if the restaurant is already in the list

  // Get the restaurant cover photo from Google
  if (place.photoId !== '') {
    const googlePhotoId = await getGooglePhoto(place.photoId);

    if (googlePhotoId) {
      place.photoId = googlePhotoId;
    }
  } else {
    // Use a placeholder image if no photo is available from Google
    // There is a placeholder image in the database
    place.photoId = process.env.NEXT_PUBLIC_PLACEHOLDER_IMG!;
  }

  const newRestaurant: Restaurant = {
    _id: uuidv4(),
    name: place.name,
    type: place.type,
    rating: place.rating,
    address: place.address,
    location: place.location,
    mapsUrl: place.mapsUrl,
    photoId: place.photoId,
    photoUrl: `/api/database/photos?id=${place.photoId}`,
    reviews: [],
    dishes: [],
    dateAdded: new Date()
  }

  await db.addRestaurant(listId, newRestaurant);
}