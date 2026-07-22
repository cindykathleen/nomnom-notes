import { ActivityItem, ActivityType } from '@/app/interfaces/interfaces';
import {
  findOpenReviewBatchDb,
  findRecentSingleReviewActivityDb,
  updateActivityDb,
} from '@/app/lib/dbFunctions';
import { recordActivity } from '@/app/lib/recordActivity';

export type RecordReviewActivityInput = {
  userId: string;
  restaurantId: string;
  kind: 'restaurant' | 'dish';
  dishId?: string;
  isNewReview: boolean;
};

function isDistinctMembership(
  single: ActivityItem,
  input: RecordReviewActivityInput
): boolean {
  if (input.kind === 'restaurant') {
    return single.type !== ActivityType.RESTAURANT_REVIEWED;
  }

  // dish review
  if (single.type === ActivityType.RESTAURANT_REVIEWED) {
    return true;
  }

  return single.dishId !== input.dishId;
}

function buildBatchFromSingleAndEvent(
  single: ActivityItem,
  input: RecordReviewActivityInput,
  now: Date
): ActivityItem {
  const dishIds: string[] = [];

  if (single.type === ActivityType.DISH_REVIEWED && single.dishId) {
    dishIds.push(single.dishId);
  }
  if (input.kind === 'dish' && input.dishId && !dishIds.includes(input.dishId)) {
    dishIds.push(input.dishId);
  }

  const includesRestaurantReview =
    single.type === ActivityType.RESTAURANT_REVIEWED || input.kind === 'restaurant';

  return {
    _id: single._id,
    userId: single.userId,
    type: ActivityType.REVIEWS_BATCHED,
    createdAt: now,
    windowStartedAt: single.createdAt,
    restaurantId: input.restaurantId,
    dishIds,
    includesRestaurantReview,
  };
}

export async function recordReviewActivity(
  input: RecordReviewActivityInput
): Promise<ActivityItem> {
  if (input.kind === 'dish' && !input.dishId) {
    throw new Error('dishId is required when recording a dish review activity');
  }

  const now = new Date();
  const openBatch = await findOpenReviewBatchDb(input.userId, input.restaurantId);

  if (openBatch) {
    const dishIds = [...(openBatch.dishIds ?? [])];
    if (input.kind === 'dish' && input.dishId && !dishIds.includes(input.dishId)) {
      dishIds.push(input.dishId);
    }

    const updated: ActivityItem = {
      _id: openBatch._id,
      userId: openBatch.userId,
      type: ActivityType.REVIEWS_BATCHED,
      createdAt: now,
      windowStartedAt: openBatch.windowStartedAt,
      restaurantId: openBatch.restaurantId,
      dishIds,
      includesRestaurantReview:
        openBatch.includesRestaurantReview === true || input.kind === 'restaurant',
    };

    await updateActivityDb(updated);
    return updated;
  }

  const single = await findRecentSingleReviewActivityDb(input.userId, input.restaurantId);

  if (single && isDistinctMembership(single, input)) {
    const batch = buildBatchFromSingleAndEvent(single, input, now);
    await updateActivityDb(batch);
    return batch;
  }

  if (single && !isDistinctMembership(single, input)) {
    const bumped: ActivityItem = {
      ...single,
      createdAt: now,
    };
    await updateActivityDb(bumped);
    return bumped;
  }

  // Nothing to merge — insert a single activity (including edits with no prior feed row)
  if (input.kind === 'restaurant') {
    return await recordActivity({
      userId: input.userId,
      type: ActivityType.RESTAURANT_REVIEWED,
      restaurantId: input.restaurantId,
    });
  }

  return await recordActivity({
    userId: input.userId,
    type: ActivityType.DISH_REVIEWED,
    restaurantId: input.restaurantId,
    dishId: input.dishId,
  });
}
