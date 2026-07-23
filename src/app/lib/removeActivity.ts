import { ActivityItem, ActivityType } from '@/app/interfaces/interfaces';
import {
  deleteActivitiesByListIdDb,
  deleteActivitiesByRestaurantIdDb,
  deleteActivityDb,
  deleteListJoinedActivityDb,
  findActivitiesReferencingDishDb,
  updateActivityDb,
} from '@/app/lib/dbFunctions';

/** Returns updated activity, or null if the activity should be deleted. */
export function applyDishRemovalToActivity(
  activity: ActivityItem,
  dishId: string
): ActivityItem | null {
  if (activity.type === ActivityType.DISH_REVIEWED) {
    return activity.dishId === dishId ? null : activity;
  }

  if (activity.type !== ActivityType.REVIEWS_BATCHED) {
    return activity;
  }

  const dishIds = (activity.dishIds ?? []).filter((id) => id !== dishId);
  const includesRestaurantReview = activity.includesRestaurantReview === true;
  const memberCount = (includesRestaurantReview ? 1 : 0) + dishIds.length;

  if (memberCount === 0) {
    return null;
  }

  if (memberCount === 1) {
    if (includesRestaurantReview) {
      return {
        _id: activity._id,
        userId: activity.userId,
        type: ActivityType.RESTAURANT_REVIEWED,
        createdAt: activity.createdAt,
        restaurantId: activity.restaurantId,
      };
    }

    return {
      _id: activity._id,
      userId: activity.userId,
      type: ActivityType.DISH_REVIEWED,
      createdAt: activity.createdAt,
      restaurantId: activity.restaurantId,
      dishId: dishIds[0],
    };
  }

  return {
    _id: activity._id,
    userId: activity.userId,
    type: ActivityType.REVIEWS_BATCHED,
    createdAt: activity.createdAt,
    windowStartedAt: activity.windowStartedAt,
    restaurantId: activity.restaurantId,
    dishIds,
    includesRestaurantReview,
  };
}

export async function removeActivitiesForList(listId: string) {
  await deleteActivitiesByListIdDb(listId);
}

export async function removeListJoinedActivity(userId: string, listId: string) {
  await deleteListJoinedActivityDb(userId, listId);
}

export async function removeActivitiesForRestaurant(restaurantId: string) {
  await deleteActivitiesByRestaurantIdDb(restaurantId);
}

export async function removeDishFromReviewActivities(dishId: string) {
  const activities = await findActivitiesReferencingDishDb(dishId);

  for (const activity of activities) {
    const updated = applyDishRemovalToActivity(activity, dishId);

    if (updated === null) {
      await deleteActivityDb(activity._id);
    } else if (updated !== activity) {
      await updateActivityDb(updated);
    }
  }
}
