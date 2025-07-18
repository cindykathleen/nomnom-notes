import { describe, it, expect, beforeAll } from 'vitest'
import { Database } from './database';
import { v4 as uuidv4 } from 'uuid';

const testDb = new Database('nomnom_notes_test');
const listUuid = uuidv4();
const dishUuid = uuidv4();
const photoUuid = uuidv4();

const newList = {
  _id: listUuid,
  index: 0,
  name: 'Boba',
  description: 'Rating all of the boba drinks we have tried',
  photoId: '48f7b0c4-dfc7-46c4-b85c-c834767e2850',
  photoUrl: '/uploads/48f7b0c4-dfc7-46c4-b85c-c834767e2850',
  restaurants: []
}

const newRestaurant = {
  _id: 'ChIJTRDQZ_K1j4ARqdjFU7FbSes',
  name: 'TP Tea',
  type: 'Tea house',
  address: '10787 S Blaney Ave, Cupertino, CA 95014, USA',
  mapsUrl: 'https://maps.google.com/?cid=16954183089385756841',
  photoId: '503574d6-db6d-4be7-bec7-1c305686119e',
  photoUrl: '/uploads/503574d6-db6d-4be7-bec7-1c305686119e',
  rating: 0,
  description: '',
  dateAdded: new Date(),
  dishes: []
}

const newDish = {
  _id: dishUuid,
  index: 0,
  name: 'Strawberry Milk Tea w/ boba 50% sweet',
  note: 'Just ok',
  rating: 3,
  photoId: '1d14055a-8402-408a-a67c-800130874c2c',
  photoUrl: '/uploads/1d14055a-8402-408a-a67c-800130874c2c'
}

const searchResults = [
  {
    _id: 'ChIJTRDQZ_K1j4ARqdjFU7FbSes',
    name: 'TP Tea',
    type: 'Tea house',
    address: '10787 S Blaney Ave, Cupertino, CA 95014, USA',
    mapsUrl: 'https://maps.google.com/?cid=16954183089385756841',
    photoId: '503574d6-db6d-4be7-bec7-1c305686119e'
  },
  {
    _id: 'ChIJZ0uK75gzjoARCoIgh3aIO1M',
    name: 'TP TEA – San Jose Oakridge',
    type: 'Tea house',
    address: '925 Blossom Hill Rd #1228, San Jose, CA 95123, USA',
    mapsUrl: 'https://maps.google.com/?cid=5997537371428520458',
    photoId: 'AXQCQNSkq6kDl4fjCcYGXnnxXS5LvC22oEDkMLOqnRniVljSUe0cV5x'
  }
]

beforeAll(async () => {
  await testDb.db.dropDatabase();
})

describe('Database lists collection', async () => {
  it('add list', async () => {
    await testDb.addList(newList);

    const expectedList = {
      _id: listUuid,
      index: 0,
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
    if (!list) return;

    list.description = 'Updated description for boba drinks';
    await testDb.updateList(list);

    const updatedList = await testDb.getList(listUuid);
    if (!updatedList) return;

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
      dateAdded: newRestaurant.dateAdded,
      dishes: []
    }

    expect(restaurant).not.toBeNull();
    expect(restaurant).toEqual(expectedRestaurant);
  })

  it('update restaurant', async () => {
    const restaurant = await testDb.getRestaurant(newRestaurant._id);
    if (!restaurant) return;

    restaurant.rating = 5;
    restaurant.description = 'One of our go-to places for boba';
    await testDb.updateRestaurant(restaurant);

    const updatedRestaurant = await testDb.getRestaurant(newRestaurant._id);
    if (!updatedRestaurant) return;

    expect(updatedRestaurant.rating).toBe(5);
    expect(updatedRestaurant.description).toBe('One of our go-to places for boba');
  })

  it('delete restaurant', async () => {
    await testDb.deleteRestaurant(listUuid, newRestaurant._id);
    const restaurant = await testDb.getRestaurant(newRestaurant._id);
    expect(restaurant).toBeNull();
  })
})

describe('Database dishes collection', async () => {
  it('add dish', async () => {
    await testDb.addDish(newRestaurant._id, newDish);

    const expectedDish = {
      _id: dishUuid,
      index: 0,
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
    if (!dish) return;

    dish.rating = 4;
    dish.note = 'Omg, yum!';
    await testDb.updateDish(dish);

    const updatedDish = await testDb.getDish(dishUuid);
    if (!updatedDish) return;

    expect(updatedDish.rating).toBe(4);
    expect(updatedDish.note).toBe('Omg, yum!');
  })

  it('delete dish', async () => {
    await testDb.deleteDish(newRestaurant._id, dishUuid);
    const dish = await testDb.getDish(dishUuid)
    expect(dish).toBeNull();
  })
})

describe('Database drag & drop', async () => {
  const restaurant = {
    _id: 'test-restaurant',
    name: 'TP Tea',
    type: 'Tea house',
    address: '10787 S Blaney Ave, Cupertino, CA 95014, USA',
    mapsUrl: 'https://maps.google.com/?cid=16954183089385756841',
    photoId: '503574d6-db6d-4be7-bec7-1c305686119e',
    photoUrl: '/uploads/503574d6-db6d-4be7-bec7-1c305686119e',
    rating: 0,
    description: '',
    dateAdded: new Date(),
    dishes: ['test0', 'test1']
  }

  const dish0 = {
    _id: 'test0',
    index: 1,
    name: 'Strawberry Milk Tea w/ boba 50% sweet',
    note: 'Yum',
    rating: 5,
    photoId: '1d14055a-8402-408a-a67c-800130874c2c',
    photoUrl: '/uploads/1d14055a-8402-408a-a67c-800130874c2c'
  }

  const dish1 = {
    _id: 'test1',
    index: 2,
    name: 'Milk Tea w/ boba 50% sweet',
    note: 'Just ok',
    rating: 3,
    photoId: '1d14055a-8402-408a-a67c-800130874c2c',
    photoUrl: '/uploads/1d14055a-8402-408a-a67c-800130874c2c'
  }

  const dish2 = {
    _id: 'test2',
    index: 3,
    name: 'Peach Milk Tea w/ boba 50% sweet',
    note: 'Pretty good',
    rating: 4,
    photoId: '1d14055a-8402-408a-a67c-800130874c2c',
    photoUrl: '/uploads/1d14055a-8402-408a-a67c-800130874c2c'
  }

  it('get highest index of an array of dish IDs', async () => {
    await testDb.addRestaurant(listUuid, restaurant);
    await testDb.addDish('test-restaurant', dish0);
    await testDb.addDish('test-restaurant', dish1);
    await testDb.addDish('test-restaurant', dish2);

    const highestIndex = await testDb.getHighestDishIndex('test-restaurant');
    expect(highestIndex).toEqual(3);
  })

  it('update collection after drag & drop feature', async () => {
    await testDb.moveList('dishes', 3, 2);
    
    const dish = await testDb.getDish('test2');
    if (!dish) return;
    
    expect(dish.index).toEqual(2);
  })
})

describe('Database search', async () => {
  it('add & get search result', async () => {
    await testDb.addSearchResult('TP Tea', searchResults);

    const expectedResults = [
      {
        '_id': 'TP Tea',
        'result': [
          {
            _id: 'ChIJTRDQZ_K1j4ARqdjFU7FbSes',
            name: 'TP Tea',
            type: 'Tea house',
            address: '10787 S Blaney Ave, Cupertino, CA 95014, USA',
            mapsUrl: 'https://maps.google.com/?cid=16954183089385756841',
            photoId: '503574d6-db6d-4be7-bec7-1c305686119e'
          },
          {
            _id: 'ChIJZ0uK75gzjoARCoIgh3aIO1M',
            name: 'TP TEA – San Jose Oakridge',
            type: 'Tea house',
            address: '925 Blossom Hill Rd #1228, San Jose, CA 95123, USA',
            mapsUrl: 'https://maps.google.com/?cid=5997537371428520458',
            photoId: 'AXQCQNSkq6kDl4fjCcYGXnnxXS5LvC22oEDkMLOqnRniVljSUe0cV5x'
          }
        ]
      }
    ]

    const results = await testDb.getSearchResults();
    expect(results).not.toBeNull();
    expect(results).toEqual(expectedResults);
  })
})

describe('Database photos', async () => {
  it('upload & get photo', async () => {
    const url = 'https://placehold.co/400';
    const response = await fetch(url);
    const bytes = await response.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await testDb.uploadPhoto(photoUuid, buffer);

    const photo = await testDb.getPhoto(photoUuid);
    expect(photo).not.toBeNull();

    if (!photo) return;

    expect(photo._id).toEqual(photoUuid);
    expect(photo.data.value()).toEqual(buffer);
  })
})