'use server'; 

import { getSearchResults, addSearchResult } from '@/app/lib/dbFunctions';
import { Place, Recommendation } from '@/app/interfaces/interfaces';
import { searchPlace } from './GooglePlacesAPI';

export default async function getRecommendations(
  numberOfRecs: number,
  coords: { latitude: number; longitude: number }
) {
  let recommendations: Recommendation[] = [];

  let recommendedType = [
    'Japanese restaurant',
    'Korean restaurant',
    'Chinese restaurant',
    'Thai restaurant',
    'Vietnamese restaurant',
    'Italian restaurant',
    'Mexican restaurant',
    'American restaurant',
  ];

  // Shuffle the array
  recommendedType.sort(() => Math.random() - 0.5);

  for (let i = 0; i < numberOfRecs; i++) {
    let typeRecommendations: Place[] = [];

    // Check if the recommendation is already stored in the database
    const storedPlaces = await getSearchResults(recommendedType[i]);

    if (storedPlaces) {
      typeRecommendations = storedPlaces;
    } else {
      // Send a new search request
      const searchedPlaces = await searchPlace(recommendedType[i], coords, true);
      typeRecommendations = searchedPlaces;

      // Store the new search into the database
    await addSearchResult(recommendedType[i], searchedPlaces);
    }

    // Get one restaurant from typeRecommendations at random
    const randomIndex = Math.floor(Math.random() * (typeRecommendations.length));
    recommendations.push({
      _id: recommendedType[i],
      restaurant: typeRecommendations[randomIndex]
    })
  }

  return recommendations;
}