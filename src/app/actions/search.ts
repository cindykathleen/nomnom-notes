'use server';

import { db } from '@/app/lib/database';
import { searchPlace } from '@/app/lib/GooglePlacesAPI';
import { Place, Restaurant } from '@/app/interfaces/interfaces';
import { getGooglePhoto } from './images';

export const searchQuery = async (formData: FormData) => {
  const searchQuery = formData.get('search-query') as string;

  // Make sure the input is not null
  if (!searchQuery) {
    return [];
  }

  const query = searchQuery.toLowerCase();

  // Check if the query is already stored in the database
  const storedPlaces = await db.getSearchResults(query);

  if (storedPlaces) {
    return storedPlaces;
  }

  // Send a new search request
  const searchedPlaces = await searchPlace(query);

  // Store the new search into the database
  await db.addSearchResult(query, searchedPlaces);

  return searchedPlaces;
}

export const addPlace = async (listId: string, place: Place) => {
  const lists = await db.getLists();

  // Check if the restaurant is already in the list
  const currentList = lists.find((list) => list._id === listId);
  if (currentList!.restaurants.find((restaurant) => restaurant === place._id)) {
    return;
  }

  // Get the restaurant cover photo from Google
  if (place.photoId !== '') {
    const googlePhotoId = await getGooglePhoto(place.photoId);

    if (googlePhotoId) {
      place.photoId = googlePhotoId;
    }
  } else {
    // Use a placeholder image if no photo is available from Google
    // There is a placeholder image in the database
    place.photoId = '110eef21-e1df-4f07-9442-44cbca0b42fc';
  }

  const newRestaurant: Restaurant = {
    _id: place._id,
    name: place.name,
    type: place.type,
    address: place.address,
    location: place.location,
    mapsUrl: place.mapsUrl,
    photoId: place.photoId,
    photoUrl: `/api/database/photos?id=${place.photoId}`,
    rating: 0,
    description: '',
    dishes: [],
    dateAdded: new Date()
  }

  await db.addRestaurant(listId, newRestaurant);
}