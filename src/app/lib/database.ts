import { MongoClient, Db, Binary } from 'mongodb';
import { Lists, List, Restaurant, Dish, Place, SearchResult, Photo } from "@/app/interfaces/interfaces";

export class Database {
  client: MongoClient;
  db: Db;

  constructor(databaseName: string) {
    this.client = new MongoClient('mongodb://localhost:27017');
    this.db = this.client.db(databaseName);
  }

  // Lists function
  async getLists(userId: string) {
    const doc = await this.db.collection<Lists>('lists').findOne({ userId });
    return doc?.lists?.sort((a, b) => a.index - b.index) ?? [];
  }

  // List functions
  async getList(userId: string, listId: string) {
    const doc = await this.db.collection<Lists>('lists').findOne(
      { userId, 'lists._id': listId },
      { projection: { 'lists.$': 1 } }
    );

    return doc?.lists?.[0] ?? null;
  }

  async getListByRestaurantId(userId: string, restaurantId: string) {
    const doc = await this.db.collection<Lists>('lists').findOne(
      { userId, 'lists.restaurants': restaurantId },
      { projection: { 'lists.$': 1 } }
    );

    return doc?.lists?.[0] ?? null;
  }

  async addList(userId: string, list: List) {
    await this.db.collection<Lists>('lists').updateOne(
      { userId },
      { $push: { lists: list } },
      { upsert: true }
    );
  }

  async updateList(userId: string, list: List) {
    await this.db.collection<Lists>('lists').updateOne(
      { userId, 'lists._id': list._id },
      {
        $set: {
          'lists.$.name': list.name,
          'lists.$.description': list.description,
          'lists.$.photoId': list.photoId,
          'lists.$.photoUrl': list.photoUrl
        }
      }
    );
  }

  async deleteList(userId: string, listId: string) {
    await this.db.collection<Lists>('lists').updateOne(
      { userId },
      { $pull: { lists: { _id: listId } } }
    );
  }

  async moveList(userId: string, dragIndex: number, hoverIndex: number) {
    const collection = this.db.collection<Lists>('lists');

    const dragItem = await collection.findOne(
      { userId, 'lists.index': dragIndex },
      { projection: { 'lists.$': 1 } }
    );

    await collection.updateMany(
      { userId },
      dragIndex > hoverIndex
        // Moving item from the right to the left
        ? { $inc: { 'lists.$[elem].index': 1 } }
        // Moving item from left to right
        : { $inc: { 'lists.$[elem].index': -1 } },
      {
        arrayFilters: dragIndex > hoverIndex
          // Shift items from hoverIndex to dragIndex - 1
          ? [{ 'elem.index': { $gte: hoverIndex, $lt: dragIndex } }]
          // Shift items from dragIndex + 1 to hoverIndex
          : [{ 'elem.index': { $gt: dragIndex, $lte: hoverIndex } }]
      }
    )
    // If dragIndex and hoverIndex are the same, it is already being taken care of in ListCard.tsx

    // Update the item to its new index position
    await collection.updateOne(
      { userId, 'lists._id': dragItem?.lists?.[0]._id },
      { $set: { 'lists.$.index': hoverIndex } }
    )
  }

  // Restaurant functions
  async getRestaurant(restaurantId: string) {
    return await this.db.collection<Restaurant>('restaurants').findOne({ _id: restaurantId });
  }

  async addRestaurant(userId: string, listId: string, restaurant: Restaurant) {
    // Only add the restaurant if it doesn't already exist inside of the restaraunts collection
    await this.db.collection<Restaurant>('restaurants').updateOne(
      { _id: restaurant._id },
      { $setOnInsert: restaurant },
      { upsert: true }
    )

    // Add the restaurant ID to the specified list
    await this.db.collection<List>('lists').updateOne(
      { userId, 'lists._id': listId },
      { $push: { 'lists.$.restaurants': restaurant._id } }
    );
  }

  async updateRestaurant(restaurant: Restaurant) {
    await this.db.collection<Restaurant>('restaurants').updateOne(
      { _id: restaurant._id },
      {
        $set: {
          rating: restaurant.rating,
          description: restaurant.description
        }
      }
    );
  }

  async deleteRestaurant(userId: string, listId: string, restaurantId: string) {
    await this.db.collection<Restaurant>('restaurants').deleteOne({ _id: restaurantId });
    
    // Delete the restaurant ID from the specified list
    await this.db.collection<List>('lists').updateOne(
      { userId, 'lists._id': listId },
      { $pull: { 'lists.$.restaurants': restaurantId } }
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
          note: dish.note,
          rating: dish.rating,
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

    await this.db.collection<SearchResult>('places').insertOne(newSearch);
  }

  //Photo functions
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
}

export const db = new Database('nomnom_notes');