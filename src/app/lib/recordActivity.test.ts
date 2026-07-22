import dotenv from 'dotenv';
import { describe, it, expect, beforeAll } from 'vitest';
import getDb from './db';
import {
  addUserDb,
  addListDb,
  addRestaurant,
  addInvitation,
  acceptInvitationDb,
  getActivitiesByUserIdsDb,
  getInvitationByToken,
} from './dbFunctions';
import { recordActivity } from './recordActivity';
import { ActivityType, List, Restaurant } from '@/app/interfaces/interfaces';

dotenv.config({ path: '.env.test' });

beforeAll(async () => {
  const db = await getDb();
  await db.dropDatabase();

  await addUserDb('activity-user-1', 'Activity User 1', 'activity1@test.com');
  await addUserDb('activity-user-2', 'Activity User 2', 'activity2@test.com');
});

describe('recordActivity', () => {
  it('inserts a LIST_CREATED activity', async () => {
    const activity = await recordActivity({
      userId: 'activity-user-1',
      type: ActivityType.LIST_CREATED,
      listId: 'list-created-test',
    });

    expect(activity._id).toBeTruthy();
    expect(activity.userId).toBe('activity-user-1');
    expect(activity.type).toBe(ActivityType.LIST_CREATED);
    expect(activity.listId).toBe('list-created-test');
    expect(activity.createdAt).toBeInstanceOf(Date);

    const found = await getActivitiesByUserIdsDb(['activity-user-1'], { limit: 10 });
    expect(found.some((a) => a._id === activity._id)).toBe(true);
  });

  it('inserts a LIST_JOINED activity', async () => {
    const activity = await recordActivity({
      userId: 'activity-user-2',
      type: ActivityType.LIST_JOINED,
      listId: 'list-joined-test',
    });

    expect(activity.type).toBe(ActivityType.LIST_JOINED);
    expect(activity.listId).toBe('list-joined-test');
    expect(activity.userId).toBe('activity-user-2');
  });

  it('inserts a RESTAURANT_SAVED activity', async () => {
    const activity = await recordActivity({
      userId: 'activity-user-1',
      type: ActivityType.RESTAURANT_SAVED,
      listId: 'list-saved-test',
      restaurantId: 'restaurant-saved-test',
    });

    expect(activity.type).toBe(ActivityType.RESTAURANT_SAVED);
    expect(activity.listId).toBe('list-saved-test');
    expect(activity.restaurantId).toBe('restaurant-saved-test');
  });

  it('records LIST_CREATED after addListDb (action sequence)', async () => {
    const list: List = {
      _id: 'list-seq-created',
      owner: 'activity-user-1',
      visibility: 'private',
      name: 'Sequence List',
      description: '',
      photoUrl: '',
      restaurants: [],
      dateAdded: new Date(),
      dateUpdated: new Date(),
    };

    await addListDb('activity-user-1', list);
    const activity = await recordActivity({
      userId: 'activity-user-1',
      type: ActivityType.LIST_CREATED,
      listId: list._id,
    });

    const found = await getActivitiesByUserIdsDb(['activity-user-1'], { limit: 20 });
    const match = found.find((a) => a._id === activity._id);
    expect(match?.type).toBe(ActivityType.LIST_CREATED);
    expect(match?.listId).toBe('list-seq-created');
  });

  it('records LIST_JOINED after acceptInvitationDb (action sequence)', async () => {
    const list: List = {
      _id: 'list-seq-join',
      owner: 'activity-user-1',
      visibility: 'private',
      name: 'Join List',
      description: '',
      photoUrl: '',
      restaurants: [],
      dateAdded: new Date(),
      dateUpdated: new Date(),
    };
    await addListDb('activity-user-1', list);

    const token = 'activity-join-token';
    await addInvitation({
      _id: 'invitation-activity-test',
      listId: list._id,
      invitedBy: 'activity-user-1',
      token,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      usedBy: '',
    });

    const invitation = await getInvitationByToken(token);
    await acceptInvitationDb('activity-user-2', token);
    const activity = await recordActivity({
      userId: 'activity-user-2',
      type: ActivityType.LIST_JOINED,
      listId: invitation.listId,
    });

    const found = await getActivitiesByUserIdsDb(['activity-user-2'], { limit: 20 });
    const match = found.find((a) => a._id === activity._id);
    expect(match?.type).toBe(ActivityType.LIST_JOINED);
    expect(match?.listId).toBe('list-seq-join');
  });

  it('records RESTAURANT_SAVED after addRestaurant (action sequence)', async () => {
    const list: List = {
      _id: 'list-seq-save',
      owner: 'activity-user-1',
      visibility: 'private',
      name: 'Save List',
      description: '',
      photoUrl: '',
      restaurants: [],
      dateAdded: new Date(),
      dateUpdated: new Date(),
    };
    await addListDb('activity-user-1', list);

    const restaurant: Restaurant = {
      _id: 'restaurant-seq-save',
      name: 'Test Place',
      type: 'cafe',
      rating: 4.5,
      address: '1 Main St',
      location: { latitude: 0, longitude: 0 },
      mapsUrl: '',
      photoUrl: '',
      reviews: [],
      dishes: [],
      dateAdded: new Date(),
      dateUpdated: new Date(),
    };

    await addRestaurant(list._id, restaurant);
    const activity = await recordActivity({
      userId: 'activity-user-1',
      type: ActivityType.RESTAURANT_SAVED,
      listId: list._id,
      restaurantId: restaurant._id,
    });

    const found = await getActivitiesByUserIdsDb(['activity-user-1'], { limit: 20 });
    const match = found.find((a) => a._id === activity._id);
    expect(match?.type).toBe(ActivityType.RESTAURANT_SAVED);
    expect(match?.listId).toBe('list-seq-save');
    expect(match?.restaurantId).toBe('restaurant-seq-save');
  });
});
