import {
  ActivityItem,
  FeedActivityView,
  FeedActorView,
  FeedDishView,
  FeedListView,
  FeedRestaurantView,
} from '@/app/interfaces/interfaces';
import {
  getActivitiesByUserIdsDb,
  getDishesByIds,
  getListsByIds,
  getRestaurantsByIds,
  getUser,
  getUsersByIds,
} from '@/app/lib/dbFunctions';
import { formatActivityTimestamp } from '@/app/lib/formatActivityTimestamp';

export async function populateFeedActivities(
  activities: ActivityItem[],
  now: Date = new Date()
): Promise<FeedActivityView[]> {
  if (activities.length === 0) {
    return [];
  }

  const userIds = new Set<string>();
  const listIds = new Set<string>();
  const restaurantIds = new Set<string>();
  const dishIds = new Set<string>();

  for (const activity of activities) {
    userIds.add(activity.userId);
    if (activity.listId) listIds.add(activity.listId);
    if (activity.restaurantId) restaurantIds.add(activity.restaurantId);
    if (activity.dishId) dishIds.add(activity.dishId);
    for (const id of activity.dishIds ?? []) {
      dishIds.add(id);
    }
  }

  const [users, lists, restaurants, dishes] = await Promise.all([
    getUsersByIds([...userIds]),
    getListsByIds([...listIds]),
    getRestaurantsByIds([...restaurantIds]),
    getDishesByIds([...dishIds]),
  ]);

  const usersById = new Map(users.map((u) => [u._id, u]));
  const listsById = new Map(lists.map((l) => [l._id, l]));
  const restaurantsById = new Map(restaurants.map((r) => [r._id, r]));
  const dishesById = new Map(dishes.map((d) => [d._id, d]));

  return activities.map((activity) => {
    const user = usersById.get(activity.userId);
    const actor: FeedActorView = {
      _id: activity.userId,
      name: user?.name ?? 'Unknown',
      photoUrl: user?.photoUrl ?? '',
    };

    let list: FeedListView | undefined;
    if (activity.listId) {
      const found = listsById.get(activity.listId);
      if (found) {
        list = { _id: found._id, name: found.name, photoUrl: found.photoUrl };
      }
    }

    let restaurant: FeedRestaurantView | undefined;
    if (activity.restaurantId) {
      const found = restaurantsById.get(activity.restaurantId);
      if (found) {
        restaurant = { _id: found._id, name: found.name, photoUrl: found.photoUrl };
      }
    }

    const orderedDishIds = [
      ...(activity.dishIds ?? []),
      ...(activity.dishId && !(activity.dishIds ?? []).includes(activity.dishId)
        ? [activity.dishId]
        : []),
    ];

    const populatedDishes: FeedDishView[] = [];
    for (const id of orderedDishIds) {
      const found = dishesById.get(id);
      if (found) {
        populatedDishes.push({ _id: found._id, name: found.name, photoUrl: found.photoUrl });
      }
    }

    return {
      activity,
      actor,
      ...(list && { list }),
      ...(restaurant && { restaurant }),
      ...(populatedDishes.length > 0 && { dishes: populatedDishes }),
      timestampLabel: formatActivityTimestamp(activity.createdAt, now),
    };
  });
}

export async function getFollowingFeedPage(
  viewerId: string,
  options: { limit?: number; before?: Date; now?: Date } = {}
): Promise<{ items: FeedActivityView[]; hasMore: boolean }> {
  const limit = options.limit ?? 12;
  const now = options.now ?? new Date();

  const viewer = await getUser(viewerId);
  const following = viewer?.following ?? [];

  if (following.length === 0) {
    return { items: [], hasMore: false };
  }

  const rows = await getActivitiesByUserIdsDb(following, {
    limit: limit + 1,
    before: options.before,
  });

  const hasMore = rows.length > limit;
  const page = hasMore ? rows.slice(0, limit) : rows;
  const items = await populateFeedActivities(page, now);

  return { items, hasMore };
}
