import dotenv from 'dotenv';
import { describe, it, expect, beforeAll } from 'vitest';
import getDb from './db';
import {
  addActivityDb,
  ensureActivityIndexes,
  getActivitiesByUserIdsDb,
  getActivityDb,
} from './dbFunctions';
import { recordReviewActivity } from './recordReviewActivity';
import { ActivityType } from '@/app/interfaces/interfaces';

dotenv.config({ path: '.env.test' });

const userId = 'review-activity-user';
const restaurantA = 'restaurant-a-review';
const restaurantB = 'restaurant-b-review';

beforeAll(async () => {
  const db = await getDb();
  await db.dropDatabase();
  await ensureActivityIndexes();
});

describe('recordReviewActivity', () => {
  it('creates a RESTAURANT_REVIEWED activity for the first restaurant review', async () => {
    const activity = await recordReviewActivity({
      userId,
      restaurantId: restaurantA,
      kind: 'restaurant',
      isNewReview: true,
    });

    expect(activity.type).toBe(ActivityType.RESTAURANT_REVIEWED);
    expect(activity.restaurantId).toBe(restaurantA);
    expect(activity.userId).toBe(userId);
  });

  it('creates a DISH_REVIEWED activity for the first dish review at another restaurant', async () => {
    const activity = await recordReviewActivity({
      userId,
      restaurantId: restaurantB,
      kind: 'dish',
      dishId: 'dish-b1',
      isNewReview: true,
    });

    expect(activity.type).toBe(ActivityType.DISH_REVIEWED);
    expect(activity.restaurantId).toBe(restaurantB);
    expect(activity.dishId).toBe('dish-b1');
  });

  it('batches restaurant then dish reviews within 2h into REVIEWS_BATCHED', async () => {
    const localUser = 'review-batch-rest-dish';
    const restaurantId = 'restaurant-batch-rd';

    const first = await recordReviewActivity({
      userId: localUser,
      restaurantId,
      kind: 'restaurant',
      isNewReview: true,
    });
    const firstCreatedAt = first.createdAt;

    const batch = await recordReviewActivity({
      userId: localUser,
      restaurantId,
      kind: 'dish',
      dishId: 'dish-rd-1',
      isNewReview: true,
    });

    expect(batch._id).toBe(first._id);
    expect(batch.type).toBe(ActivityType.REVIEWS_BATCHED);
    expect(batch.includesRestaurantReview).toBe(true);
    expect(batch.dishIds).toEqual(['dish-rd-1']);
    expect(batch.windowStartedAt).toEqual(firstCreatedAt);
    expect(batch.createdAt.getTime()).toBeGreaterThanOrEqual(firstCreatedAt.getTime());
    expect(batch.dishId).toBeUndefined();

    const all = await getActivitiesByUserIdsDb([localUser], { limit: 20 });
    expect(all.filter((a) => a.restaurantId === restaurantId)).toHaveLength(1);
  });

  it('batches two dish reviews within 2h with no restaurant review', async () => {
    const localUser = 'review-batch-two-dishes';
    const restaurantId = 'restaurant-batch-2d';

    const first = await recordReviewActivity({
      userId: localUser,
      restaurantId,
      kind: 'dish',
      dishId: 'dish-2d-1',
      isNewReview: true,
    });

    const batch = await recordReviewActivity({
      userId: localUser,
      restaurantId,
      kind: 'dish',
      dishId: 'dish-2d-2',
      isNewReview: true,
    });

    expect(batch._id).toBe(first._id);
    expect(batch.type).toBe(ActivityType.REVIEWS_BATCHED);
    expect(batch.includesRestaurantReview).toBe(false);
    expect(batch.dishIds?.sort()).toEqual(['dish-2d-1', 'dish-2d-2']);
  });

  it('editing the same dish within 2h bumps createdAt without duplicating membership', async () => {
    const localUser = 'review-edit-same-dish';
    const restaurantId = 'restaurant-edit-dish';

    const first = await recordReviewActivity({
      userId: localUser,
      restaurantId,
      kind: 'dish',
      dishId: 'dish-edit-1',
      isNewReview: true,
    });

    const bumped = await recordReviewActivity({
      userId: localUser,
      restaurantId,
      kind: 'dish',
      dishId: 'dish-edit-1',
      isNewReview: false,
    });

    expect(bumped._id).toBe(first._id);
    expect(bumped.type).toBe(ActivityType.DISH_REVIEWED);
    expect(bumped.dishId).toBe('dish-edit-1');
    expect(bumped.createdAt.getTime()).toBeGreaterThanOrEqual(first.createdAt.getTime());

    const all = await getActivitiesByUserIdsDb([localUser], { limit: 20 });
    expect(all.filter((a) => a.restaurantId === restaurantId)).toHaveLength(1);
  });

  it('does not mix dish reviews across different restaurants', async () => {
    const localUser = 'review-cross-rest';

    const a = await recordReviewActivity({
      userId: localUser,
      restaurantId: 'restaurant-cross-a',
      kind: 'dish',
      dishId: 'dish-cross-a',
      isNewReview: true,
    });

    const b = await recordReviewActivity({
      userId: localUser,
      restaurantId: 'restaurant-cross-b',
      kind: 'dish',
      dishId: 'dish-cross-b',
      isNewReview: true,
    });

    expect(a.type).toBe(ActivityType.DISH_REVIEWED);
    expect(b.type).toBe(ActivityType.DISH_REVIEWED);
    expect(a._id).not.toBe(b._id);
    expect(a.restaurantId).toBe('restaurant-cross-a');
    expect(b.restaurantId).toBe('restaurant-cross-b');
  });

  it('does not merge with a single review outside the 2h window', async () => {
    const localUser = 'review-window-expired';
    const restaurantId = 'restaurant-expired';
    const now = Date.now();

    await addActivityDb({
      _id: 'activity-expired-dish',
      userId: localUser,
      type: ActivityType.DISH_REVIEWED,
      createdAt: new Date(now - 3 * 60 * 60 * 1000),
      restaurantId,
      dishId: 'dish-expired-1',
    });

    const second = await recordReviewActivity({
      userId: localUser,
      restaurantId,
      kind: 'dish',
      dishId: 'dish-expired-2',
      isNewReview: true,
    });

    expect(second.type).toBe(ActivityType.DISH_REVIEWED);
    expect(second.dishId).toBe('dish-expired-2');
    expect(second._id).not.toBe('activity-expired-dish');

    const expired = await getActivityDb('activity-expired-dish');
    expect(expired?.type).toBe(ActivityType.DISH_REVIEWED);
  });

  it('updates an open batch when another dish is reviewed', async () => {
    const localUser = 'review-open-batch';
    const restaurantId = 'restaurant-open-batch';

    await recordReviewActivity({
      userId: localUser,
      restaurantId,
      kind: 'dish',
      dishId: 'dish-ob-1',
      isNewReview: true,
    });
    const batch = await recordReviewActivity({
      userId: localUser,
      restaurantId,
      kind: 'dish',
      dishId: 'dish-ob-2',
      isNewReview: true,
    });
    expect(batch.type).toBe(ActivityType.REVIEWS_BATCHED);

    const updated = await recordReviewActivity({
      userId: localUser,
      restaurantId,
      kind: 'dish',
      dishId: 'dish-ob-3',
      isNewReview: true,
    });

    expect(updated._id).toBe(batch._id);
    expect(updated.type).toBe(ActivityType.REVIEWS_BATCHED);
    expect(updated.dishIds?.sort()).toEqual(['dish-ob-1', 'dish-ob-2', 'dish-ob-3']);
    expect(updated.windowStartedAt).toEqual(batch.windowStartedAt);
  });
});
