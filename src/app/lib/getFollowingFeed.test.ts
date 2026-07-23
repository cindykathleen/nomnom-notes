import dotenv from 'dotenv';
import { describe, it, expect, beforeAll } from 'vitest';
import getDb from './db';
import {
  addActivityDb,
  addDishDb,
  addListDb,
  addRestaurant,
  addUserDb,
  ensureActivityIndexes,
  followUserDb,
  updateUserDb,
} from './dbFunctions';
import { getFollowingFeedPage } from './getFollowingFeed';
import { ActivityType, User } from '@/app/interfaces/interfaces';

dotenv.config({ path: '.env.test' });

const viewerId = 'feed-viewer';
const followedId = 'feed-followed';
const otherId = 'feed-other';

beforeAll(async () => {
  const db = await getDb();
  await db.dropDatabase();
  await ensureActivityIndexes();

  await addUserDb(viewerId, 'Viewer', 'viewer@test.com');
  await addUserDb(followedId, 'Followed User', 'followed@test.com');
  await addUserDb(otherId, 'Other User', 'other@test.com');

  const followed = await (await getDb()).collection<User>('users').findOne({ _id: followedId });
  if (followed) {
    await updateUserDb({
      ...followed,
      photoUrl: 'https://example.com/followed.jpg',
    });
  }

  await followUserDb(viewerId, followedId);

  await addListDb(followedId, {
    _id: 'feed-list-1',
    owner: followedId,
    visibility: 'private',
    name: 'Boba',
    description: '',
    photoUrl: '',
    restaurants: [],
    dateAdded: new Date(),
    dateUpdated: new Date(),
  });

  await addRestaurant('feed-list-1', {
    _id: 'feed-rest-1',
    name: 'HEYTEA',
    type: 'Tea',
    rating: 4.5,
    address: 'Cupertino',
    location: { latitude: 0, longitude: 0 },
    mapsUrl: '',
    photoUrl: 'https://example.com/heytea.jpg',
    reviews: [],
    dishes: [],
    dateAdded: new Date(),
    dateUpdated: new Date(),
  });

  await addDishDb('feed-rest-1', {
    _id: 'feed-dish-1',
    index: 1,
    name: 'Coconut Mango Boom',
    reviews: [],
    photoUrl: '',
    dateAdded: new Date(),
    dateUpdated: new Date(),
  });

  await addDishDb('feed-rest-1', {
    _id: 'feed-dish-2',
    index: 2,
    name: 'Brown Sugar Boba',
    reviews: [],
    photoUrl: '',
    dateAdded: new Date(),
    dateUpdated: new Date(),
  });
});

describe('getFollowingFeedPage', () => {
  it('returns empty when viewer follows nobody', async () => {
    const lonelyId = 'feed-lonely';
    await addUserDb(lonelyId, 'Lonely', 'lonely@test.com');

    const result = await getFollowingFeedPage(lonelyId);
    expect(result).toEqual({ items: [], hasMore: false });
  });

  it('only returns activities from followed users, newest first, and populates refs', async () => {
    await addActivityDb({
      _id: 'feed-act-old',
      userId: followedId,
      type: ActivityType.LIST_CREATED,
      createdAt: new Date('2026-07-20T10:00:00.000Z'),
      listId: 'feed-list-1',
    });
    await addActivityDb({
      _id: 'feed-act-new',
      userId: followedId,
      type: ActivityType.REVIEWS_BATCHED,
      createdAt: new Date('2026-07-20T14:00:00.000Z'),
      restaurantId: 'feed-rest-1',
      dishIds: ['feed-dish-1', 'feed-dish-2', 'feed-dish-missing'],
      includesRestaurantReview: true,
      windowStartedAt: new Date('2026-07-20T13:00:00.000Z'),
    });
    await addActivityDb({
      _id: 'feed-act-other',
      userId: otherId,
      type: ActivityType.LIST_CREATED,
      createdAt: new Date('2026-07-20T15:00:00.000Z'),
      listId: 'feed-list-1',
    });

    const now = new Date('2026-07-20T15:00:00.000Z');
    const result = await getFollowingFeedPage(viewerId, { now });

    expect(result.items.map((i) => i.activity._id)).toEqual(['feed-act-new', 'feed-act-old']);
    expect(result.hasMore).toBe(false);

    const newest = result.items[0];
    expect(newest.actor).toEqual({
      _id: followedId,
      name: 'Followed User',
      photoUrl: 'https://example.com/followed.jpg',
    });
    expect(newest.restaurant).toEqual({
      _id: 'feed-rest-1',
      name: 'HEYTEA',
      photoUrl: 'https://example.com/heytea.jpg',
    });
    expect(newest.dishes).toEqual([
      { _id: 'feed-dish-1', name: 'Coconut Mango Boom' },
      { _id: 'feed-dish-2', name: 'Brown Sugar Boba' },
    ]);
    expect(newest.timestampLabel).toBe('1 hour ago');

    const older = result.items[1];
    expect(older.list).toEqual({ _id: 'feed-list-1', name: 'Boba' });
  });

  it('respects limit and hasMore, and supports before cursor', async () => {
    const pageUser = 'feed-page-user';
    const pageViewer = 'feed-page-viewer';
    await addUserDb(pageUser, 'Pager', 'pager@test.com');
    await addUserDb(pageViewer, 'Page Viewer', 'pageviewer@test.com');
    await followUserDb(pageViewer, pageUser);

    for (let i = 0; i < 5; i++) {
      await addActivityDb({
        _id: `feed-page-act-${i}`,
        userId: pageUser,
        type: ActivityType.LIST_CREATED,
        createdAt: new Date(`2026-07-20T1${i}:00:00.000Z`),
        listId: 'feed-list-1',
      });
    }

    const first = await getFollowingFeedPage(pageViewer, { limit: 2 });
    expect(first.items).toHaveLength(2);
    expect(first.hasMore).toBe(true);
    expect(first.items.map((i) => i.activity._id)).toEqual([
      'feed-page-act-4',
      'feed-page-act-3',
    ]);

    const second = await getFollowingFeedPage(pageViewer, {
      limit: 2,
      before: first.items[1].activity.createdAt,
    });
    expect(second.items.map((i) => i.activity._id)).toEqual([
      'feed-page-act-2',
      'feed-page-act-1',
    ]);
    expect(second.hasMore).toBe(true);

    const third = await getFollowingFeedPage(pageViewer, {
      limit: 2,
      before: second.items[1].activity.createdAt,
    });
    expect(third.items.map((i) => i.activity._id)).toEqual(['feed-page-act-0']);
    expect(third.hasMore).toBe(false);
  });
});
