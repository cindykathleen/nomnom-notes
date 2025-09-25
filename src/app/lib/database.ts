import { MongoClient, Db, Binary } from 'mongodb';
import { User, List, Restaurant, Dish, Place, SearchResult, Photo, Invitation } from "@/app/interfaces/interfaces";

export class Database {
  client: MongoClient;
  db: Db;

  constructor(databaseName: string) {
    this.client = new MongoClient('mongodb://localhost:27017');
    this.db = this.client.db(databaseName);
  }

  // Users functions
  async getUser(userId: string) {
    return await this.db.collection<User>('users').findOne({ _id: userId });
  }

  async getUsers(listId: string) {
    return await this.db.collection<User>('users').find({ lists: listId }).toArray();
  }

  async getUserName(userId: string) {
    const doc = await this.db.collection<User>('users').findOne({ _id: userId });
    return doc?.name ?? '';
  }

  async getListIds(userId: string) {
    const doc = await this.db.collection<User>('users').findOne({ _id: userId });
    return doc?.lists ?? [];
  }

  async addUser(userId: string, name: string, email: string) {
    await this.db.collection<User>('users').insertOne({ _id: userId, name: name, email: email, lists: [], searchRate: [], mapRate: [] });
  }

  async removeUser(userId: string, listId: string) {
    await this.db.collection<User>('users').updateOne(
      { _id: userId },
      { $pull: { lists: listId } }
    )
  }

  async getRate(userId: string, feature: 'search' | 'map') {
    const doc = await this.db.collection<User>('users').findOne({ _id: userId });

    if (feature === 'search') {
      return doc?.searchRate ?? [];
    } else {
      return doc?.mapRate ?? [];
    }
  }

  async addTimestamp(userId: string, feature: 'search' | 'map', timestamp: Date) {
    if (feature === 'search') {
      await this.db.collection<User>('users').updateOne(
        { _id: userId },
        { $push: { searchRate: timestamp } }
      );
    } else if (feature === 'map') {
      await this.db.collection<User>('users').updateOne(
        { _id: userId },
        { $push: { mapRate: timestamp } }
      );
    }
  }

  // Lists functions
  async getList(listId: string) {
    return await this.db.collection<List>('lists').findOne({ _id: listId });
  }

  async getListByRestaurantId(restaurantId: string) {
    return await this.db.collection<List>('lists').findOne({ restaurants: restaurantId });
  }

  async getListByToken(token: string) {
    const doc = await this.db.collection<Invitation>('invitations').findOne({ token: token });

    if (!doc) return null;

    return await this.getList(doc.listId);
  }

  async getListVisibility(listId: string) {
    const doc = await this.db.collection<List>('lists').findOne({ _id: listId });

    return doc?.visibility ?? null;
  }

  async isOwner(userId: string, listId: string) {
    const doc = await this.db.collection<List>('lists').findOne({ _id: listId });

    return doc?.owner === userId;
  }

  async isOwnerOrCollaborator(userId: string, listId: string) {
    const users = await this.db.collection<User>('users').find(
      { lists: listId },
      { projection: { _id: 1 } })
      .toArray();

    return users.some(user => user._id === userId);
  }

  async addList(userId: string, list: List) {
    await this.db.collection<List>('lists').insertOne(list);

    // Add the list ID to the specified user
    await this.db.collection<User>('users').updateOne(
      { _id: userId },
      { $push: { lists: list._id } }
    );
  }

  async updateList(list: List) {
    await this.db.collection<List>('lists').updateOne(
      { _id: list._id },
      {
        $set: {
          name: list.name,
          visibility: list.visibility,
          description: list.description,
          photoId: list.photoId,
          photoUrl: list.photoUrl
        }
      }
    );
  }

  async deleteList(listId: string) {
    await this.db.collection<List>('lists').deleteOne({ _id: listId });

    // Remove the list ID from ALL users
    await this.db.collection<User>('users').updateMany(
      {},
      { $pull: { lists: listId } }
    );
  }

  async removeList(userId: string, listId: string) {
    await this.db.collection<User>('users').updateOne(
      { _id: userId },
      { $pull: { lists: listId } }
    )
  }

  async moveList(userId: string, dragIndex: number, hoverIndex: number) {
    const user = await this.db.collection<User>('users').findOne({ _id: userId });

    if (!user) return null;

    // Make a copy of the user's lists to avoid mutating the original
    const lists = [...user.lists];

    // Remove the dragged item
    const [dragItem] = lists.splice(dragIndex, 1);

    // Insert the dragged item at the new position
    lists.splice(hoverIndex, 0, dragItem);

    // Save the reordered lists
    await this.db.collection<User>('users').updateOne(
      { _id: userId },
      { $set: { lists } }
    );
  }

  // Restaurant functions
  async getRestaurant(restaurantId: string) {
    return await this.db.collection<Restaurant>('restaurants').findOne({ _id: restaurantId });
  }

  async addRestaurant(listId: string, restaurant: Restaurant) {
    await this.db.collection<Restaurant>('restaurants').insertOne(restaurant);

    // Add the restaurant ID to the specified list
    await this.db.collection<List>('lists').updateOne(
      { _id: listId },
      { $push: { restaurants: restaurant._id } }
    );
  }

  async updateRestaurant(restaurant: Restaurant) {
    await this.db.collection<Restaurant>('restaurants').updateOne(
      { _id: restaurant._id },
      { $set: { reviews: restaurant.reviews } }
    );
  }

  async deleteRestaurant(listId: string, restaurantId: string) {
    await this.db.collection<Restaurant>('restaurants').deleteOne({ _id: restaurantId });

    // Delete the restaurant ID from the specified list
    await this.db.collection<List>('lists').updateOne(
      { _id: listId },
      { $pull: { restaurants: restaurantId } }
    );
  }

  // Dish functions
  async getDish(dishId: string) {
    return await this.db.collection<Dish>('dishes').findOne({ _id: dishId });
  }

  async addDish(restaurantId: string, dish: Dish) {
    await this.db.collection<Dish>('dishes').insertOne(dish);

    // Add the dish ID to the specified restaurant
    await this.db.collection<Restaurant>('restaurants').updateOne(
      { _id: restaurantId },
      { $push: { dishes: dish._id } }
    );
  }

  async updateDish(dish: Dish) {
    await this.db.collection<Dish>('dishes').updateOne(
      { _id: dish._id },
      {
        $set: {
          name: dish.name,
          reviews: dish.reviews,
          photoId: dish.photoId,
          photoUrl: dish.photoUrl
        }
      }
    );
  }

  async deleteDish(restaurantId: string, dishId: string) {
    await this.db.collection<Dish>('dishes').deleteOne({ _id: dishId });

    // Delete the restaurant ID from the specified list
    await this.db.collection<Restaurant>('restaurants').updateOne(
      { _id: restaurantId },
      { $pull: { dishes: dishId } }
    );
  }

  // Drag & Drop functions
  async getHighestDishIndex(restaurantId: string) {
    const restaurants = this.db.collection<Restaurant>('restaurants');

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
    console.log(result);

    return result.length > 0 ? result[0].maxIndex : null;
  }

  async moveDish(dragIndex: number, hoverIndex: number) {
    const collection = this.db.collection<Dish>('dishes');

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
  async getSearchResults(query: string) {
    const doc = await this.db.collection<SearchResult>('places').findOne(
      { _id: query },
      { projection: { result: 1, _id: 0 } }
    );

    return doc ? doc.result : null;
  }

  async addSearchResult(query: string, places: Place[]) {
    const newSearch = {
      _id: query,
      result: places
    }

    await this.db.collection<SearchResult>('places').updateOne(
      { _id: query },
      { $setOnInsert: newSearch },
      { upsert: true }
    );
  }

  // Photo functions
  async getPhoto(photoId: string) {
    return await this.db.collection<Photo>('photos').findOne({ _id: photoId });
  }

  async uploadPhoto(photoId: string, photoData: Buffer) {
    const newPhoto = {
      _id: photoId,
      data: new Binary(photoData)
    }

    await this.db.collection<Photo>('photos').insertOne(newPhoto);
  }

  // Invitation functions
  async getToken(invitation: Invitation) {
    await this.db.collection<Invitation>('invitations').insertOne(invitation);
  }

  async getInvitationByToken(token: string) {
    const invitation = await this.db.collection<Invitation>('invitations').findOne({ token: token });

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

  async getOwnerByToken(token: string) {
    const doc = await this.db.collection<Invitation>('invitations').findOne({ token: token });

    if (!doc) return null;

    return await this.db.collection<User>('users').findOne({ _id: doc.invitedBy });
  }

  async acceptInvitation(userId: string, token: string) {
    const invitation = await this.db.collection<Invitation>('invitations').findOne({ token: token });

    // Check to make sure the invitation exists
    if (!invitation) throw new Error('Invitation not found');

    // Check to make sure the user doesn't already collaborate on this list
    const user = await this.db.collection<User>('users').findOne({ _id: userId });

    if (user!.lists.includes(invitation.listId)) {
      throw new Error('You are already a collaborator on this list');
    }

    // Check to make sure the user hasn't already used this invitation
    if (invitation.usedBy === userId) {
      throw new Error('Invitation already used by this user');
    }

    // Add the user ID to the usedBy field of the invitation
    await this.db.collection<Invitation>('invitations').updateOne(
      { token: token },
      { $set: { usedBy: userId } }
    );

    // Add the list ID to the specified user's lists
    await this.db.collection<User>('users').updateOne(
      { _id: userId },
      { $push: { lists: invitation.listId } }
    );
  }

  async declineInvitation(userId: string, token: string) {
    const invitation = await this.db.collection<Invitation>('invitations').findOne({ token: token });

    // Check to make sure the invitation exists
    if (!invitation) throw new Error('Invitation not found');

    // Check to make sure the user doesn't already collaborate on this list
    const user = await this.db.collection<User>('users').findOne({ _id: userId });

    if (user!.lists.includes(invitation.listId)) {
      throw new Error('You are already a collaborator on this list');
    }

    // Void the invitation
    await this.db.collection<Invitation>('invitations').updateOne(
      { token: token },
      { $set: { usedBy: 'Declined' } }
    );

  }

  // Review functions
  async getExistingRestaurantReview(userId: string, restaurantId: string) {
    const doc = await this.db.collection<Restaurant>('restaurants').findOne(
      { _id: restaurantId, 'reviews.createdBy': userId },
      { projection: { 'reviews.$': 1 } }
    );

    return doc?.reviews?.[0] || null;
  }

  async getExistingDishReview(userId: string, dishId: string) {
    const doc = await this.db.collection<Dish>('dishes').findOne(
      { _id: dishId, 'reviews.createdBy': userId },
      { projection: { 'reviews.$': 1 } }
    );

    return doc?.reviews?.[0] || null;
  }
}

export const db = new Database('nomnom_notes');