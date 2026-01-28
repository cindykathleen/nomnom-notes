import { getListsCount, getRestaurantsCount, getReviewsCount } from "./dbFunctions";

export default async function getStatistics(userId: string, type: 'lists' | 'restaurants' | 'reviews'): Promise<number> {
  switch (type) {
    case 'lists':
      const listsCount = await getListsCount(userId);
      return listsCount;
    case 'restaurants':
      const restaurantsCount = await getRestaurantsCount(userId);
      return restaurantsCount;
    case 'reviews':
      const reviewsCount = await getReviewsCount(userId);
      return reviewsCount;
    default:
      return 0;
  }
}