import { describe, it, expect, beforeAll } from 'vitest'
import { Database } from './database';
import { v4 as uuidv4 } from 'uuid';

const testDb = new Database('nomnom_notes_test');
const listUuid = uuidv4();
const dishUuid = uuidv4();

const newList = {
  _id: listUuid,
  name: 'Boba',
  description: 'Rating all of the boba drinks we have tried',
  photoId: '48f7b0c4-dfc7-46c4-b85c-c834767e2850',
  photoUrl: '/uploads/48f7b0c4-dfc7-46c4-b85c-c834767e2850'
}

const newRestaurant = {
  _id: 'ChIJTRDQZ_K1j4ARqdjFU7FbSes',
  name: 'TP Tea',
  type: 'Tea house',
  address: '10787 S Blaney Ave, Cupertino, CA 95014, USA',
  mapsUrl: 'https://maps.google.com/?cid=16954183089385756841',
  photoId: '503574d6-db6d-4be7-bec7-1c305686119e',
  photoUrl: '/uploads/503574d6-db6d-4be7-bec7-1c305686119e'
}

const newDish = {
  _id: dishUuid,
  name: 'Strawberry Milk Tea w/ boba 50% sweet',
  note: 'Just ok',
  rating: 3,
  photoId: '1d14055a-8402-408a-a67c-800130874c2c',
  photoUrl: '/uploads/1d14055a-8402-408a-a67c-800130874c2c'
}

beforeAll(async () => {
  await testDb.db.dropDatabase();
})

describe('Database lists collection', async () => {
  it('add list', async () => {
    await testDb.addList(newList);

    const expectedList = {
      _id: listUuid,
      name: 'Boba',
      description: 'Rating all of the boba drinks we have tried',
      photoId: '48f7b0c4-dfc7-46c4-b85c-c834767e2850',
      photoUrl: '/uploads/48f7b0c4-dfc7-46c4-b85c-c834767e2850',
      restaurants: []
    }

    const list = await testDb.getList(listUuid);
    expect(list).not.toBeNull();
    expect(list).toEqual(expectedList);
  })

  it('update list', async () => {
    const list = await testDb.getList(listUuid);
    expect(list).not.toBeNull();

    list.description = 'Updated description for boba drinks';
    await testDb.updateList(list);

    const updatedList = await testDb.getList(listUuid);
    expect(updatedList.description).toBe('Updated description for boba drinks');
  })

  it('delete list', async () => {
    await testDb.deleteList(listUuid);
    const list = await testDb.getList(listUuid);
    expect(list).toBeNull();
  })
})

describe('Database restaurants collection', async () => {
  it('add restaurant', async () => {
    await testDb.addRestaurant(listUuid, newRestaurant);
    const restaurant = await testDb.getRestaurant(newRestaurant._id);

    const expectedRestaurant = {
      _id: 'ChIJTRDQZ_K1j4ARqdjFU7FbSes',
      name: 'TP Tea',
      type: 'Tea house',
      address: '10787 S Blaney Ave, Cupertino, CA 95014, USA',
      mapsUrl: 'https://maps.google.com/?cid=16954183089385756841',
      photoId: '503574d6-db6d-4be7-bec7-1c305686119e',
      photoUrl: '/uploads/503574d6-db6d-4be7-bec7-1c305686119e',
      rating: 0,
      description: '',
      dateAdded: restaurant.dateAdded,
      dishes: []
    }

    expect(restaurant).not.toBeNull();
    expect(restaurant).toEqual(expectedRestaurant);
  })

  it('update restaurant', async () => {
    const restaurant = await testDb.getRestaurant(newRestaurant._id);
    expect(restaurant).not.toBeNull();

    restaurant.rating = 5;
    restaurant.description = 'One of our go-to places for boba';
    await testDb.updateRestaurant(restaurant);

    const updatedRestaurant = await testDb.getRestaurant(newRestaurant._id);
    expect(updatedRestaurant.rating).toBe(5);
    expect(updatedRestaurant.description).toBe('One of our go-to places for boba');
  })

  it('delete restaurant', async () => {
    await testDb.deleteRestaurant(newRestaurant._id);
    const restaurant = await testDb.getRestaurant(newRestaurant._id);
    expect(restaurant).toBeNull();
  })
})

describe('Database dishes collection', async () => {
  it('add dish', async () => {
    await testDb.addDish(newRestaurant._id, newDish);

    const expectedDish = {
      _id: dishUuid,
      name: 'Strawberry Milk Tea w/ boba 50% sweet',
      note: 'Just ok',
      rating: 3,
      photoId: '1d14055a-8402-408a-a67c-800130874c2c',
      photoUrl: '/uploads/1d14055a-8402-408a-a67c-800130874c2c'
    }

    const dish = await testDb.getDish(dishUuid);
    expect(dish).not.toBeNull();
    expect(dish).toEqual(expectedDish);
  })

  it('update dish', async () => {
    const dish = await testDb.getDish(dishUuid);
    expect(dish).not.toBeNull();

    dish.rating = 4;
    dish.note = 'Omg, yum!';
    await testDb.updateDish(dish);

    const updatedDish = await testDb.getDish(dishUuid);
    expect(updatedDish.rating).toBe(4);
    expect(updatedDish.note).toBe('Omg, yum!');
  })

  it('delete restaurant', async () => {
    await testDb.deleteDish(dishUuid);
    const dish = await testDb.getDish(dishUuid)
    expect(dish).toBeNull();
  })
})