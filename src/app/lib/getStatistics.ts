import { getUserStats } from "./dbFunctions";

export default async function getStatistics(userId: string) {
  const { listsCount, restaurantsCount, reviewsCount } = await getUserStats(userId);

  return {
    listsCount: listsCount,
    restaurantsCount: restaurantsCount,
    reviewsCount: reviewsCount,
  };
}