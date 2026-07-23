import dotenv from 'dotenv';
import { describe, it, expect, beforeAll } from 'vitest';
import getDb from './db';
import {
  addActivityDb,
  ensureActivityIndexes,
  getActivityDb,
} from './dbFunctions';
import {
  applyDishRemovalToActivity,
  removeActivitiesForList,
  removeActivitiesForRestaurant,
  removeDishFromReviewActivities,
  removeListJoinedActivity,
} from './removeActivity';
import { ActivityType } from '@/app/interfaces/interfaces';

dotenv.config({ path: '.env.test' });

beforeAll(async () => {
  const db = await getDb();
  await db.dropDatabase();
  await ensureActivityIndexes();
});

describe('removeActivitiesForList', () => {
  it('deletes activities for that listId and leaves other lists alone', async () => {
    await addActivityDb({
      _id: 'rm-list-created',
      userId: 'rm-user-1',
      type: ActivityType.LIST_CREATED,
      createdAt: new Date(),
      listId: 'list-rm-1',
    });
    await addActivityDb({
      _id: 'rm-list-joined',
      userId: 'rm-user-2',
      type: ActivityType.LIST_JOINED,
      createdAt: new Date(),
      listId: 'list-rm-1',
    });
    await addActivityDb({
      _id: 'rm-list-saved',
      userId: 'rm-user-1',
      type: ActivityType.RESTAURANT_SAVED,
      createdAt: new Date(),
      listId: 'list-rm-1',
      restaurantId: 'rest-rm-1',
    });
    await addActivityDb({
      _id: 'rm-list-other',
      userId: 'rm-user-1',
      type: ActivityType.LIST_CREATED,
      createdAt: new Date(),
      listId: 'list-rm-other',
    });

    await removeActivitiesForList('list-rm-1');

    expect(await getActivityDb('rm-list-created')).toBeNull();
    expect(await getActivityDb('rm-list-joined')).toBeNull();
    expect(await getActivityDb('rm-list-saved')).toBeNull();
    expect(await getActivityDb('rm-list-other')).not.toBeNull();
  });
});

describe('removeListJoinedActivity', () => {
  it('deletes only LIST_JOINED for that user and list', async () => {
    await addActivityDb({
      _id: 'rm-join-created',
      userId: 'rm-owner',
      type: ActivityType.LIST_CREATED,
      createdAt: new Date(),
      listId: 'list-join-rm',
    });
    await addActivityDb({
      _id: 'rm-join-joined',
      userId: 'rm-collab',
      type: ActivityType.LIST_JOINED,
      createdAt: new Date(),
      listId: 'list-join-rm',
    });

    await removeListJoinedActivity('rm-collab', 'list-join-rm');

    expect(await getActivityDb('rm-join-joined')).toBeNull();
    expect(await getActivityDb('rm-join-created')).not.toBeNull();
  });
});

describe('removeActivitiesForRestaurant', () => {
  it('deletes saved and review activities for that restaurant', async () => {
    await addActivityDb({
      _id: 'rm-rest-saved',
      userId: 'rm-user-r',
      type: ActivityType.RESTAURANT_SAVED,
      createdAt: new Date(),
      listId: 'list-r',
      restaurantId: 'rest-delete-me',
    });
    await addActivityDb({
      _id: 'rm-rest-reviewed',
      userId: 'rm-user-r',
      type: ActivityType.RESTAURANT_REVIEWED,
      createdAt: new Date(),
      restaurantId: 'rest-delete-me',
    });
    await addActivityDb({
      _id: 'rm-rest-other',
      userId: 'rm-user-r',
      type: ActivityType.DISH_REVIEWED,
      createdAt: new Date(),
      restaurantId: 'rest-keep-me',
      dishId: 'dish-keep',
    });

    await removeActivitiesForRestaurant('rest-delete-me');

    expect(await getActivityDb('rm-rest-saved')).toBeNull();
    expect(await getActivityDb('rm-rest-reviewed')).toBeNull();
    expect(await getActivityDb('rm-rest-other')).not.toBeNull();
  });
});

describe('applyDishRemovalToActivity', () => {
  it('returns null for matching DISH_REVIEWED', () => {
    const result = applyDishRemovalToActivity(
      {
        _id: 'a1',
        userId: 'u',
        type: ActivityType.DISH_REVIEWED,
        createdAt: new Date(),
        restaurantId: 'r',
        dishId: 'd1',
      },
      'd1'
    );
    expect(result).toBeNull();
  });

  it('keeps REVIEWS_BATCHED when two dishes remain', () => {
    const result = applyDishRemovalToActivity(
      {
        _id: 'a2',
        userId: 'u',
        type: ActivityType.REVIEWS_BATCHED,
        createdAt: new Date(),
        windowStartedAt: new Date(),
        restaurantId: 'r',
        dishIds: ['d1', 'd2', 'd3'],
        includesRestaurantReview: false,
      },
      'd2'
    );
    expect(result?.type).toBe(ActivityType.REVIEWS_BATCHED);
    expect(result?.dishIds?.sort()).toEqual(['d1', 'd3']);
  });

  it('demotes to DISH_REVIEWED when one dish remains', () => {
    const result = applyDishRemovalToActivity(
      {
        _id: 'a3',
        userId: 'u',
        type: ActivityType.REVIEWS_BATCHED,
        createdAt: new Date(),
        windowStartedAt: new Date(),
        restaurantId: 'r',
        dishIds: ['d1', 'd2'],
        includesRestaurantReview: false,
      },
      'd1'
    );
    expect(result).toEqual({
      _id: 'a3',
      userId: 'u',
      type: ActivityType.DISH_REVIEWED,
      createdAt: expect.any(Date),
      restaurantId: 'r',
      dishId: 'd2',
    });
  });

  it('demotes to RESTAURANT_REVIEWED when only restaurant review remains', () => {
    const result = applyDishRemovalToActivity(
      {
        _id: 'a4',
        userId: 'u',
        type: ActivityType.REVIEWS_BATCHED,
        createdAt: new Date(),
        windowStartedAt: new Date(),
        restaurantId: 'r',
        dishIds: ['d1'],
        includesRestaurantReview: true,
      },
      'd1'
    );
    expect(result?.type).toBe(ActivityType.RESTAURANT_REVIEWED);
    expect(result?.dishIds).toBeUndefined();
    expect(result?.dishId).toBeUndefined();
    expect(result?.includesRestaurantReview).toBeUndefined();
  });

  it('returns null when batch loses all members', () => {
    const result = applyDishRemovalToActivity(
      {
        _id: 'a5',
        userId: 'u',
        type: ActivityType.REVIEWS_BATCHED,
        createdAt: new Date(),
        windowStartedAt: new Date(),
        restaurantId: 'r',
        dishIds: ['d1'],
        includesRestaurantReview: false,
      },
      'd1'
    );
    expect(result).toBeNull();
  });
});

describe('removeDishFromReviewActivities', () => {
  it('deletes DISH_REVIEWED for that dish', async () => {
    await addActivityDb({
      _id: 'rm-dish-single',
      userId: 'rm-dish-user',
      type: ActivityType.DISH_REVIEWED,
      createdAt: new Date(),
      restaurantId: 'rest-dish',
      dishId: 'dish-to-remove',
    });

    await removeDishFromReviewActivities('dish-to-remove');
    expect(await getActivityDb('rm-dish-single')).toBeNull();
  });

  it('updates an open batch when one of three dishes is removed', async () => {
    await addActivityDb({
      _id: 'rm-dish-batch-3',
      userId: 'rm-dish-user-2',
      type: ActivityType.REVIEWS_BATCHED,
      createdAt: new Date(),
      windowStartedAt: new Date(),
      restaurantId: 'rest-dish-2',
      dishIds: ['d-a', 'd-b', 'd-c'],
      includesRestaurantReview: false,
    });

    await removeDishFromReviewActivities('d-b');

    const updated = await getActivityDb('rm-dish-batch-3');
    expect(updated?.type).toBe(ActivityType.REVIEWS_BATCHED);
    expect(updated?.dishIds?.sort()).toEqual(['d-a', 'd-c']);
  });

  it('demotes batch to DISH_REVIEWED when one dish remains', async () => {
    await addActivityDb({
      _id: 'rm-dish-batch-demote-dish',
      userId: 'rm-dish-user-3',
      type: ActivityType.REVIEWS_BATCHED,
      createdAt: new Date(),
      windowStartedAt: new Date(),
      restaurantId: 'rest-dish-3',
      dishIds: ['keep-me', 'drop-me'],
      includesRestaurantReview: false,
    });

    await removeDishFromReviewActivities('drop-me');

    const updated = await getActivityDb('rm-dish-batch-demote-dish');
    expect(updated?.type).toBe(ActivityType.DISH_REVIEWED);
    expect(updated?.dishId).toBe('keep-me');
  });

  it('demotes batch to RESTAURANT_REVIEWED when only restaurant review remains', async () => {
    await addActivityDb({
      _id: 'rm-dish-batch-demote-rest',
      userId: 'rm-dish-user-4',
      type: ActivityType.REVIEWS_BATCHED,
      createdAt: new Date(),
      windowStartedAt: new Date(),
      restaurantId: 'rest-dish-4',
      dishIds: ['only-dish'],
      includesRestaurantReview: true,
    });

    await removeDishFromReviewActivities('only-dish');

    const updated = await getActivityDb('rm-dish-batch-demote-rest');
    expect(updated?.type).toBe(ActivityType.RESTAURANT_REVIEWED);
    expect(updated?.restaurantId).toBe('rest-dish-4');
  });

  it('is a no-op when dish id is not referenced', async () => {
    await addActivityDb({
      _id: 'rm-dish-unrelated',
      userId: 'rm-dish-user-5',
      type: ActivityType.DISH_REVIEWED,
      createdAt: new Date(),
      restaurantId: 'rest-dish-5',
      dishId: 'other-dish',
    });

    await expect(removeDishFromReviewActivities('missing-dish')).resolves.toBeUndefined();
    expect(await getActivityDb('rm-dish-unrelated')).not.toBeNull();
  });

  it('deletes batch when all members are removed', async () => {
    await addActivityDb({
      _id: 'rm-dish-batch-empty',
      userId: 'rm-dish-user-6',
      type: ActivityType.REVIEWS_BATCHED,
      createdAt: new Date(),
      windowStartedAt: new Date(),
      restaurantId: 'rest-dish-6',
      dishIds: ['solo-dish'],
      includesRestaurantReview: false,
    });

    await removeDishFromReviewActivities('solo-dish');
    expect(await getActivityDb('rm-dish-batch-empty')).toBeNull();
  });
});
