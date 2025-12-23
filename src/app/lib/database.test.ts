import { describe, it, expect, beforeAll } from 'vitest'
import { Database } from './dbFunctions';

const testDb = new Database('nomnom_notes_test');

// Clear the database before running tests
beforeAll(async () => {
  await testDb.db.dropDatabase();
})

describe('Test database creation', async () => {
  it('add users', async () => {
    await testDb.addUser('user-1-test', 'Test User 1', 'test1@test.com');
    await testDb.addUser('user-2-test', 'Test User 2', 'test2@test.com');
    await testDb.addUser('user-3-test', 'Test User 3', 'test3@test.com');

    await testDb.addTimestamp('user-1-test', 'search', new Date());
    await testDb.addTimestamp('user-1-test', 'map', new Date());
    await testDb.addTimestamp('user-2-test', 'search', new Date());
    await testDb.addTimestamp('user-2-test', 'search', new Date());

    const user1 = await testDb.getUser('user-1-test');
    const user2 = await testDb.getUser('user-2-test');
    const user3 = await testDb.getUser('user-3-test');
    expect(user1).not.toBeNull();
    expect(user2).not.toBeNull();
    expect(user3).not.toBeNull();
  })
  it('add lists', async () => {
    const testList1 = {
      _id: 'list-1-test',
      owner: 'user-1-test',
      visibility: 'private' as 'private',
      name: 'Boba',
      description: 'Rating all of the boba drinks we have tried',
      photoUrl: '',
      restaurants: []
    }

    const testList2 = {
      _id: 'list-2-test',
      owner: 'user-1-test',
      visibility: 'public' as 'public',
      name: 'Michelin',
      description: 'Keeping track of all of the Michelin restaurants we have eaten at',
      photoUrl: '',
      restaurants: []
    }

    await testDb.addList('user-1-test', testList1);
    await testDb.addList('user-1-test', testList2);

    const list1 = await testDb.getList('list-1-test');
    const list2 = await testDb.getList('list-2-test');
    expect(list1).not.toBeNull();
    expect(list2).not.toBeNull();
  })
  it('add restaurant', async () => {
    const testRestaurant = {
      _id: 'restaurant-test',
      name: 'TP Tea',
      type: 'Tea house',
      rating: 4.4,
      address: '10787 S Blaney Ave, Cupertino, CA 95014, USA',
      location: {
        latitude: 37.311288,
        longitude: -122.023624,
      },
      mapsUrl: 'https://maps.google.com/?cid=16954183089385756841',
      photoUrl: '',
      reviews: [],
      dishes: [],
      dateAdded: new Date()
    }

    await testDb.addRestaurant('list-1-test', testRestaurant);

    const restaurant = await testDb.getRestaurant('restaurant-test');
    expect(restaurant).not.toBeNull();
  })
  it('add dishes', async () => {
    const testDish1 = {
      _id: 'dish-1-test',
      index: 1,
      name: 'Strawberry Milk Tea w/ boba 50% sweet',
      reviews: [],
      photoUrl: ''
    }

    const testDish2 = {
      _id: 'dish-2-test',
      index: 2,
      name: 'Milk Tea w/ boba 50% sweet',
      reviews: [],
      photoUrl: ''
    }

    const testDish3 = {
      _id: 'dish-3-test',
      index: 3,
      name: 'Peach Milk Tea w/ boba 50% sweet',
      reviews: [],
      photoUrl: ''
    }

    await testDb.addDish('restaurant-test', testDish1);
    await testDb.addDish('restaurant-test', testDish2);
    await testDb.addDish('restaurant-test', testDish3);

    const dish1 = await testDb.getDish('dish-1-test');
    const dish2 = await testDb.getDish('dish-2-test');
    const dish3 = await testDb.getDish('dish-3-test');
    expect(dish1).not.toBeNull();
    expect(dish2).not.toBeNull();
    expect(dish3).not.toBeNull();

    const highestIndex = await testDb.getHighestDishIndex('restaurant-test');
    expect(highestIndex).toEqual(3);
  })
  it('add search results', async () => {
    const testSearchResults = [
      {
        _id: 'ChIJTRDQZ_K1j4ARqdjFU7FbSes',
        name: 'TP Tea',
        type: 'Tea house',
        rating: 4.4,
        address: '10787 S Blaney Ave, Cupertino, CA 95014, USA',
        location: {
          latitude: 37.311288,
          longitude: -122.023624,
        },
        mapsUrl: 'https://maps.google.com/?cid=16954183089385756841',
        photoUrl: ''
      },
      {
        _id: 'ChIJZ0uK75gzjoARCoIgh3aIO1M',
        name: 'TP TEA – San Jose Oakridge',
        type: 'Tea house',
        rating: 4.3,
        address: '925 Blossom Hill Rd #1228, San Jose, CA 95123, USA',
        location: {
          latitude: 37.2520873,
          longitude: -121.86302269999997,
        },
        mapsUrl: 'https://maps.google.com/?cid=5997537371428520458',
        photoUrl: ''
      }
    ]

    await testDb.addSearchResult('tp tea', testSearchResults);

    const searchResults = await testDb.getSearchResults('tp tea');
    expect(searchResults).not.toBeNull();
  })
  // it('upload photo', async () => {
  //   const url = 'https://placehold.co/400';
  //   const response = await fetch(url);
  //   const bytes = await response.arrayBuffer();
  //   const buffer = Buffer.from(bytes);

  //   await testDb.uploadPhoto('photo-test', buffer);

  //   const photo = await testDb.getPhoto('photo-test');
  //   expect(photo).not.toBeNull();
  // })
  it('create invitation', async () => {
    const testInvitation1 = {
      _id: 'invitation-1-test',
      listId: 'list-1-test',
      invitedBy: 'user-1-test',
      token: 'invitation-1-test-token',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      usedBy: ''
    }

    const testInvitation2 = {
      _id: 'invitation-2-test',
      listId: 'list-2-test',
      invitedBy: 'user-1-test',
      token: 'invitation-2-test-token',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      usedBy: ''
    }

    await testDb.addInvitation(testInvitation1);
    await testDb.addInvitation(testInvitation2);

    const invitation1 = await testDb.getInvitationByToken('invitation-1-test-token');
    const invitation2 = await testDb.getInvitationByToken('invitation-2-test-token');
    expect(invitation1).not.toBeNull();
    expect(invitation2).not.toBeNull();
  })
  it('accept invitation', async () => {
    await testDb.acceptInvitation('user-2-test', 'invitation-1-test-token');

    const user = await testDb.getUser('user-2-test');
    if (!user) return;

    expect(user.lists).toContain('list-1-test');
  })
  it('decline invitation', async () => {
    await testDb.declineInvitation('user-3-test', 'invitation-2-test-token');

    const user = await testDb.getUser('user-3-test');
    if (!user) return;

    expect(user.lists).not.toContain('list-2-test');
  })
})

describe('Get database information', async () => {
  it('user', async () => {
    const name = await testDb.getUserName('user-1-test');
    expect(name).toBe('Test User 1');

    const users = await testDb.getUsers('list-1-test');
    expect(users.length).toBe(2);

    const searchRate = await testDb.getRate('user-2-test', 'search');
    const mapRate = await testDb.getRate('user-1-test', 'map');
    expect(searchRate.length).toBe(2);
    expect(mapRate.length).toBe(1);
  })
  it('list', async () => {
    let list;

    list = await testDb.getListByRestaurantId('restaurant-test');
    expect(list?._id).toBe('list-1-test');

    list = await testDb.getListByToken('invitation-1-test-token');
    expect(list?._id).toBe('list-1-test');

    const visibility = await testDb.getListVisibility('list-1-test');
    expect(visibility).toBe('private');

    expect(await testDb.isOwner('user-1-test', 'list-2-test')).toBe(true);
    expect(await testDb.isOwner('user-2-test', 'list-2-test')).toBe(false);

    expect(await testDb.isOwnerOrCollaborator('user-2-test', 'list-1-test')).toBe(true);
    expect(await testDb.isOwnerOrCollaborator('user-2-test', 'list-1-test')).toBe(true);
  })
  it('invitation', async () => {
    const user = await testDb.getOwnerByToken('invitation-1-test-token');
    expect(user?._id).toBe('user-1-test');
  })
})

describe('Update database', async () => {
  it('update list', async () => {
    const list = await testDb.getList('list-1-test');
    if (!list) return;

    list.description = 'Updated description for boba drinks';
    await testDb.updateList(list);

    const updatedList = await testDb.getList('list-1-test');
    if (!updatedList) return;

    expect(updatedList.description).toBe('Updated description for boba drinks');
  })
  it('move list', async () => {
    await testDb.moveList('user-1-test', 1, 0);

    const lists = await testDb.getListIds('user-1-test');
    if (!lists) return;

    expect(lists[0]).toEqual('list-2-test');
  })
  it('update restaurant', async () => {
    const restaurant = await testDb.getRestaurant('restaurant-test');
    if (!restaurant) return;

    const review = {
      _id: 'restaurant-review-test',
      createdBy: 'user-1-test',
      name: 'Test User 1',
      rating: 4,
      note: 'One of our go-to places for boba'
    }

    restaurant.reviews.push(review);
    await testDb.updateRestaurant(restaurant);

    const updatedReview = await testDb.getExistingRestaurantReview('user-1-test', 'restaurant-test');
    if (!updatedReview) return;

    expect(updatedReview.rating).toBe(4);
    expect(updatedReview.note).toBe('One of our go-to places for boba');
  })
  it('update dish', async () => {
    const dish = await testDb.getDish('dish-1-test');
    if (!dish) return;

    const review = {
      _id: 'dish-review-test',
      createdBy: 'user-1-test',
      name: 'Test User 1',
      rating: 4.5,
      note: 'Omg, yum!'
    }

    dish.reviews.push(review);
    await testDb.updateDish(dish);

    const updatedReview = await testDb.getExistingDishReview('user-1-test', 'dish-1-test');
    if (!updatedReview) return;

    expect(updatedReview.rating).toBe(4.5);
    expect(updatedReview.note).toBe('Omg, yum!');
  })
  it('move dish', async () => {
    await testDb.moveDish(3, 2);

    const dish = await testDb.getDish('dish-3-test');
    if (!dish) return;

    expect(dish.index).toEqual(2);
  })
  it('remove list', async () => {
    await testDb.removeList('user-3-test', 'list-1-test');
    expect(await testDb.isOwnerOrCollaborator('user-3-test', 'list-1-test')).toBe(false);
  })
  it('remove user from list', async () => {
    await testDb.removeUser('user-2-test', 'list-2-test');
    expect(await testDb.isOwnerOrCollaborator('user-2-test', 'list-2-test')).toBe(false);
  })
})

describe('Delete from database', async () => {
  it('delete dish', async () => {
    await testDb.deleteDish('restaurant-test', 'dish-3-test');
    const dish = await testDb.getDish('dish-3-test')
    expect(dish).toBeNull();
  })
  it('delete restaurant', async () => {
    await testDb.deleteRestaurant('list-1-test', 'restaurant-test');
    const restaurant = await testDb.getRestaurant('restaurant-test');
    expect(restaurant).toBeNull();
  })
  it('delete list', async () => {
    await testDb.deleteList('list-1-test');
    const list = await testDb.getList('list-1-test');
    expect(list).toBeNull();
  })
})