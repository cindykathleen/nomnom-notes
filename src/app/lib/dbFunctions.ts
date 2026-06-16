import getDb from '@/app/lib/db';
import { Db } from 'mongodb';
import { User, List, Restaurant, Dish, Place, SearchResult, Invitation, ProfileItem } from '@/app/interfaces/interfaces';

async function db() {
  return await getDb();
}

// Users functions
export async function getUser(userId?: string): Promise<User> {
  const database: Db = await db();

  if (!userId) {
    return await database.collection<User>('users').findOne({}) as User;
  }

  return await database.collection<User>('users').findOne({ _id: userId }) as User;
}

export async function getUsers(listId: string) {
  const database: Db = await db();

  return await database.collection<User>('users').find({ lists: listId }).toArray();
}

export async function getUserName(userId: string) {
  const database: Db = await db();

  const doc = await database.collection<User>('users').findOne({ _id: userId });
  return doc?.name ?? '';
}

export async function getListIds(userId: string) {
  const database: Db = await db();

  const doc = await database.collection<User>('users').findOne({ _id: userId });
  return doc?.lists ?? [];
}

export async function addUserDb(userId: string, name: string, email: string) {
  const database: Db = await db();

  await database.collection<User>('users').insertOne({
    _id: userId,
    name: name,
    email: email,
    lists: [],
    searchRate: [],
    mapRate: [],
    photoUrl: process.env.NEXT_PUBLIC_PLACEHOLDER_IMG_AVATAR!,
    location: '',
    profilePrivacy: true,
    photos: [],
    following: [],
    followers: [],
    followRequests: [],
  });
}

export async function getUsersByIds(userIds: string[]): Promise<User[]> {
  if (userIds.length === 0) {
    return [];
  }

  const database: Db = await db();

  return await database.collection<User>('users')
    .find({ _id: { $in: userIds } })
    .toArray();
}

export async function isFollowingDb(followerId: string, followeeId: string): Promise<boolean> {
  const database: Db = await db();

  const follower = await database.collection<User>('users').findOne(
    { _id: followerId },
    { projection: { following: 1 } }
  );

  return follower?.following?.includes(followeeId) ?? false;
}

export async function followUserDb(followerId: string, followeeId: string) {
  if (followerId === followeeId) {
    throw new Error('Cannot follow yourself');
  }

  const database: Db = await db();

  const [follower, followee] = await Promise.all([
    database.collection<User>('users').findOne({ _id: followerId }),
    database.collection<User>('users').findOne({ _id: followeeId }),
  ]);

  if (!follower || !followee) {
    throw new Error('User not found');
  }

  if (follower.following?.includes(followeeId)) {
    return;
  }

  await Promise.all([
    database.collection<User>('users').updateOne(
      { _id: followerId },
      { $addToSet: { following: followeeId } }
    ),
    database.collection<User>('users').updateOne(
      { _id: followeeId },
      { $addToSet: { followers: followerId } }
    ),
  ]);
}

export async function unfollowUserDb(followerId: string, followeeId: string) {
  if (followerId === followeeId) {
    throw new Error('Cannot unfollow yourself');
  }

  const database: Db = await db();

  const [follower, followee] = await Promise.all([
    database.collection<User>('users').findOne({ _id: followerId }),
    database.collection<User>('users').findOne({ _id: followeeId }),
  ]);

  if (!follower || !followee) {
    throw new Error('User not found');
  }

  if (!follower.following?.includes(followeeId)) {
    return;
  }

  await Promise.all([
    database.collection<User>('users').updateOne(
      { _id: followerId },
      { $pull: { following: followeeId } }
    ),
    database.collection<User>('users').updateOne(
      { _id: followeeId },
      { $pull: { followers: followerId } }
    ),
  ]);
}

export async function hasPendingFollowRequestDb(requesterId: string, followeeId: string): Promise<boolean> {
  const database: Db = await db();

  const followee = await database.collection<User>('users').findOne(
    { _id: followeeId },
    { projection: { followRequests: 1 } }
  );

  return followee?.followRequests?.includes(requesterId) ?? false;
}

export async function requestFollowDb(requesterId: string, followeeId: string) {
  if (requesterId === followeeId) {
    throw new Error('Cannot follow yourself');
  }

  const database: Db = await db();

  const [requester, followee] = await Promise.all([
    database.collection<User>('users').findOne({ _id: requesterId }),
    database.collection<User>('users').findOne({ _id: followeeId }),
  ]);

  if (!requester || !followee) {
    throw new Error('User not found');
  }

  if (requester.following?.includes(followeeId)) {
    return;
  }

  if (followee.followRequests?.includes(requesterId)) {
    return;
  }

  await database.collection<User>('users').updateOne(
    { _id: followeeId },
    { $addToSet: { followRequests: requesterId } }
  );
}

export async function approveFollowRequestDb(ownerId: string, requesterId: string) {
  const database: Db = await db();

  const owner = await database.collection<User>('users').findOne({ _id: ownerId });

  if (!owner) {
    throw new Error('User not found');
  }

  if (!owner.followRequests?.includes(requesterId)) {
    throw new Error('Follow request not found');
  }

  await database.collection<User>('users').updateOne(
    { _id: ownerId },
    { $pull: { followRequests: requesterId } }
  );

  await followUserDb(requesterId, ownerId);
}

export async function denyFollowRequestDb(ownerId: string, requesterId: string) {
  const database: Db = await db();

  const owner = await database.collection<User>('users').findOne({ _id: ownerId });

  if (!owner) {
    throw new Error('User not found');
  }

  await database.collection<User>('users').updateOne(
    { _id: ownerId },
    { $pull: { followRequests: requesterId } }
  );
}

export async function updateUserDb(user: User) {
  const database: Db = await db();

  await database.collection<User>('users').updateOne(
    { _id: user._id },
    {
      $set: {
        name: user.name,
        email: user.email,
        photoUrl: user.photoUrl,
        location: user.location,
        profilePrivacy: user.profilePrivacy,
        photos: user.photos,
      }
    }
  );
}

export async function removeUserDb(userId: string, listId: string) {
  const database: Db = await db();

  await database.collection<User>('users').updateOne(
    { _id: userId },
    { $pull: { lists: listId } }
  )
}

export async function getRate(userId: string, feature: 'search' | 'map') {
  const database: Db = await db();

  const doc = await database.collection<User>('users').findOne({ _id: userId });

  if (feature === 'search') {
    return doc?.searchRate ?? [];
  } else {
    return doc?.mapRate ?? [];
  }
}

export async function addTimestamp(userId: string, feature: 'search' | 'map', timestamp: Date) {
  const database: Db = await db();

  if (feature === 'search') {
    await database.collection<User>('users').updateOne(
      { _id: userId },
      { $push: { searchRate: timestamp } }
    );
  } else if (feature === 'map') {
    await database.collection<User>('users').updateOne(
      { _id: userId },
      { $push: { mapRate: timestamp } }
    );
  }
}

// Lists functions
export async function getList(listId: string) {
  const database: Db = await db();

  return await database.collection<List>('lists').findOne({ _id: listId });
}

export async function getListByRestaurantId(restaurantId: string) {
  const database: Db = await db();

  return await database.collection<List>('lists').findOne({ restaurants: restaurantId });
}

export async function getListByToken(token: string) {
  const database: Db = await db();

  const doc = await database.collection<Invitation>('invitations').findOne({ token: token });

  if (!doc) return null;

  return await getList(doc.listId);
}

export async function getListVisibility(listId: string) {
  const database: Db = await db();

  const doc = await database.collection<List>('lists').findOne({ _id: listId });

  return doc?.visibility ?? null;
}

export async function isOwnerDb(userId: string, listId: string) {
  const database: Db = await db();

  const doc = await database.collection<List>('lists').findOne({ _id: listId });

  return doc?.owner === userId;
}

export async function isOwnerOrCollaboratorDb(userId: string, listId: string) {
  const database: Db = await db();

  const users = await database.collection<User>('users').find(
    { lists: listId },
    { projection: { _id: 1 } })
    .toArray();

  return users.some(user => user._id === userId);
}

export async function addListDb(userId: string, list: List) {
  const database: Db = await db();

  await database.collection<List>('lists').insertOne(list);

  // Add the list ID to the specified user
  await database.collection<User>('users').updateOne(
    { _id: userId },
    { $push: { lists: list._id } }
  );
}

export async function updateListDb(list: List) {
  const database: Db = await db();

  await database.collection<List>('lists').updateOne(
    { _id: list._id },
    {
      $set: {
        name: list.name,
        visibility: list.visibility,
        description: list.description,
        photoUrl: list.photoUrl,
        dateUpdated: list.dateUpdated,
      }
    }
  );
}

export async function deleteListDb(listId: string) {
  const database: Db = await db();

  await database.collection<List>('lists').deleteOne({ _id: listId });

  // Remove the list ID from ALL users
  await database.collection<User>('users').updateMany(
    {},
    { $pull: { lists: listId } }
  );
}

export async function removeListDb(userId: string, listId: string) {
  const database: Db = await db();

  await database.collection<User>('users').updateOne(
    { _id: userId },
    { $pull: { lists: listId } }
  )
}

export async function moveListDb(userId: string, dragIndex: number, hoverIndex: number) {
  const database: Db = await db();

  const user = await database.collection<User>('users').findOne({ _id: userId });

  if (!user) return null;

  // Make a copy of the user's lists to avoid mutating the original
  const lists = [...user.lists];

  // Remove the dragged item
  const [dragItem] = lists.splice(dragIndex, 1);

  // Insert the dragged item at the new position
  lists.splice(hoverIndex, 0, dragItem);

  // Save the reordered lists
  await database.collection<User>('users').updateOne(
    { _id: userId },
    { $set: { lists } }
  );
}

// Restaurant functions
export async function getRestaurant(restaurantId: string) {
  const database: Db = await db();

  return await database.collection<Restaurant>('restaurants').findOne({ _id: restaurantId });
}

export async function addRestaurant(listId: string, restaurant: Restaurant) {
  const database: Db = await db();

  await database.collection<Restaurant>('restaurants').insertOne(restaurant);

  // Add the restaurant ID to the specified list
  await database.collection<List>('lists').updateOne(
    { _id: listId },
    { $push: { restaurants: restaurant._id } }
  );
}

export async function updateRestaurantDb(restaurant: Restaurant) {
  const database: Db = await db();

  await database.collection<Restaurant>('restaurants').updateOne(
    { _id: restaurant._id },
    {
      $set: {
        reviews: restaurant.reviews,
        dateUpdated: restaurant.dateUpdated,
      }
    }
  );
}

export async function deleteRestaurantDb(listId: string, restaurantId: string) {
  const database: Db = await db();

  await database.collection<Restaurant>('restaurants').deleteOne({ _id: restaurantId });

  // Delete the restaurant ID from the specified list
  await database.collection<List>('lists').updateOne(
    { _id: listId },
    { $pull: { restaurants: restaurantId } }
  );
}

// Dish functions
export async function getDish(dishId: string) {
  const database: Db = await db();

  return await database.collection<Dish>('dishes').findOne({ _id: dishId });
}

export async function addDishDb(restaurantId: string, dish: Dish) {
  const database: Db = await db();

  await database.collection<Dish>('dishes').insertOne(dish);

  // Add the dish ID to the specified restaurant
  await database.collection<Restaurant>('restaurants').updateOne(
    { _id: restaurantId },
    { $push: { dishes: dish._id } }
  );
}

export async function updateDishDb(dish: Dish) {
  const database: Db = await db();

  await database.collection<Dish>('dishes').updateOne(
    { _id: dish._id },
    {
      $set: {
        name: dish.name,
        reviews: dish.reviews,
        photoUrl: dish.photoUrl,
        dateUpdated: dish.dateUpdated,
      }
    }
  );
}

export async function deleteDishDb(restaurantId: string, dishId: string) {
  const database: Db = await db();

  await database.collection<Dish>('dishes').deleteOne({ _id: dishId });

  // Delete the restaurant ID from the specified list
  await database.collection<Restaurant>('restaurants').updateOne(
    { _id: restaurantId },
    { $pull: { dishes: dishId } }
  );
}

// Drag & Drop functions
export async function getHighestDishIndex(restaurantId: string) {
  const database: Db = await db();

  const restaurants = database.collection<Restaurant>('restaurants');

  const pipeline = [
    {
      $match: { _id: restaurantId }
    },
    {
      $lookup: {
        from: 'dishes',
        localField: 'dishes',
        foreignField: '_id',
        as: 'dishes'
      }
    },
    {
      $unwind: '$dishes'
    },
    {
      $group: {
        _id: '$_id',
        maxIndex: { $max: '$dishes.index' }
      }
    }
  ];

  const result = await restaurants.aggregate<{ _id: string, maxIndex: number }>(pipeline).toArray();

  return result.length > 0 ? result[0].maxIndex : null;
}

export async function moveDishDb(dragIndex: number, hoverIndex: number) {
  const database: Db = await db();

  const collection = database.collection<Dish>('dishes');

  const dragItem = await collection.findOne({ index: dragIndex });
  if (!dragItem) return;

  // Moving item from the right to the left
  if (dragIndex > hoverIndex) {
    await collection.updateMany(
      // Shift items from hoverIndex to dragIndex - 1
      { index: { $gte: hoverIndex, $lt: dragIndex } },
      { $inc: { index: 1 } }
    );
  }
  // Moving item from left to right
  else {
    await collection.updateMany(
      // Shift items from dragIndex + 1 to hoverIndex
      { index: { $gt: dragIndex, $lte: hoverIndex } },
      { $inc: { index: -1 } }
    );
  }
  // If dragIndex and hoverIndex are the same, it is already being taken care of in DishCard.tsx

  // Update the item to its new index position
  await collection.updateOne(
    { _id: dragItem._id },
    { $set: { index: hoverIndex } }
  )
}

// Search functions
export async function getSearchResults(query: string) {
  const database: Db = await db();

  const doc = await database.collection<SearchResult>('places').findOne(
    { _id: query },
    { projection: { result: 1, _id: 0 } }
  );

  return doc ? doc.result : null;
}

export async function addSearchResult(query: string, places: Place[]) {
  const database: Db = await db();

  const newSearch = {
    _id: query,
    result: places
  }

  await database.collection<SearchResult>('places').updateOne(
    { _id: query },
    { $setOnInsert: newSearch },
    { upsert: true }
  );
}

// Invitation functions
export async function addInvitation(invitation: Invitation) {
  const database: Db = await db();

  await database.collection<Invitation>('invitations').insertOne(invitation);
}

export async function getInvitationByToken(token: string) {
  const database: Db = await db();

  const invitation = await database.collection<Invitation>('invitations').findOne({ token: token });

  // Check to make sure the invitation exists
  if (!invitation) {
    throw new Error('Not a valid invitation link');
  }

  // Check to make sure the invitation hasn't already been used
  if (invitation.usedBy !== '') {
    throw new Error('Invitation link has already been used');
  }

  // Check to make sure the invitation hasn't expired
  if (new Date(invitation.expiresAt) < new Date()) {
    throw new Error('Invitation link has expired');
  }

  return invitation;
}

export async function getOwnerByToken(token: string) {
  const database: Db = await db();

  const doc = await database.collection<Invitation>('invitations').findOne({ token: token });

  if (!doc) return null;

  return await database.collection<User>('users').findOne({ _id: doc.invitedBy });
}

export async function acceptInvitationDb(userId: string, token: string) {
  const database: Db = await db();

  const invitation = await database.collection<Invitation>('invitations').findOne({ token: token });

  // Check to make sure the invitation exists
  if (!invitation) throw new Error('Invitation not found');

  // Check to make sure the user doesn't already collaborate on this list
  const user = await database.collection<User>('users').findOne({ _id: userId });

  if (user!.lists.includes(invitation.listId)) {
    throw new Error('You are already a collaborator on this list');
  }

  // Check to make sure the user hasn't already used this invitation
  if (invitation.usedBy === userId) {
    throw new Error('Invitation already used by this user');
  }

  // Add the user ID to the usedBy field of the invitation
  await database.collection<Invitation>('invitations').updateOne(
    { token: token },
    { $set: { usedBy: userId } }
  );

  // Add the list ID to the specified user's lists
  await database.collection<User>('users').updateOne(
    { _id: userId },
    { $push: { lists: invitation.listId } }
  );
}

export async function declineInvitationDb(userId: string, token: string) {
  const database: Db = await db();

  const invitation = await database.collection<Invitation>('invitations').findOne({ token: token });

  // Check to make sure the invitation exists
  if (!invitation) throw new Error('Invitation not found');

  // Check to make sure the user doesn't already collaborate on this list
  const user = await database.collection<User>('users').findOne({ _id: userId });

  if (user!.lists.includes(invitation.listId)) {
    throw new Error('You are already a collaborator on this list');
  }

  // Void the invitation
  await database.collection<Invitation>('invitations').updateOne(
    { token: token },
    { $set: { usedBy: 'Declined' } }
  );

}

// Review functions
export async function getExistingRestaurantReview(userId: string, restaurantId: string) {
  const database: Db = await db();

  const doc = await database.collection<Restaurant>('restaurants').findOne(
    { _id: restaurantId, 'reviews.createdBy': userId },
    { projection: { 'reviews.$': 1 } }
  );

  return doc?.reviews?.[0] || null;
}

export async function getExistingDishReview(userId: string, dishId: string) {
  const database: Db = await db();

  const doc = await database.collection<Dish>('dishes').findOne(
    { _id: dishId, 'reviews.createdBy': userId },
    { projection: { 'reviews.$': 1 } }
  );

  return doc?.reviews?.[0] || null;
}

// Profile function
export async function getProfileData(userId: string) {
  const database: Db = await db();

  const user = await database.collection<User>('users').findOne({ _id: userId });

  if (!user) {
    return {
      stats: { listsCount: 0, restaurantsCount: 0, reviewsCount: 0 },
      lists: [],
      restaurants: [],
      reviews: [],
    };
  }

  const listsCount = user.lists.length;

  const lists = await database
    .collection<List>('lists')
    .find({ _id: { $in: user.lists } })
    .project({ _id: 1, name: 1, photoUrl: 1, dateUpdated: 1, restaurants: 1 })
    .toArray();

  const profileLists: ProfileItem[] = lists
    .sort((a, b) => b.dateUpdated.getTime() - a.dateUpdated.getTime())
    .slice(0, 4)
    .map(list => ({
      _id: list._id.toString(),
      name: list.name,
      photoUrl: list.photoUrl,
    }));

  const restaurantIds = lists.flatMap(list => list.restaurants);
  const restaurantsCount = restaurantIds.length;

  if (restaurantIds.length === 0) {
    return {
      stats: { listsCount, restaurantsCount: 0, reviewsCount: 0 },
      lists: profileLists,
      restaurants: [],
      reviews: [],
    };
  }

  const restaurants = await database
    .collection<Restaurant>('restaurants')
    .find({ _id: { $in: restaurantIds } })
    .project({ _id: 1, name: 1, photoUrl: 1, dateUpdated: 1, dishes: 1 })
    .toArray();

  const profileRestaurants: ProfileItem[] = restaurants
    .sort((a, b) => b.dateUpdated.getTime() - a.dateUpdated.getTime())
    .slice(0, 4)
    .map(r => ({
      _id: r._id.toString(),
      name: r.name,
      photoUrl: r.photoUrl,
    }));

  const dishIds = restaurants.flatMap(r => r.dishes);

  if (dishIds.length === 0) {
    return {
      stats: { listsCount, restaurantsCount, reviewsCount: 0 },
      lists: profileLists,
      restaurants: profileRestaurants,
      reviews: [],
    };
  }

  const dishes = await database
    .collection<Dish>('dishes')
    .find({ _id: { $in: dishIds } })
    .project({ _id: 1, name: 1, dateUpdated: 1, reviews: 1 })
    .toArray();

  const reviews: ProfileItem[] = [];
  let reviewsCount = 0;

  for (const dish of dishes) {
    for (const review of dish.reviews) {
      if (review.createdBy === userId) {
        reviewsCount++;
        reviews.push({
          _id: review._id.toString(),
          name: dish.name,
          dateUpdated: dish.dateUpdated,
          rating: review.rating,
          note: review.note,
        });
      }
    }
  }

  const profileReviews = reviews
    .sort((a, b) => b.dateUpdated!.getTime() - a.dateUpdated!.getTime())
    .slice(0, 4);

  return {
    stats: {
      listsCount,
      restaurantsCount,
      reviewsCount,
    },
    lists: profileLists,
    restaurants: profileRestaurants,
    reviews: profileReviews,
  };
}