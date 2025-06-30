import { MongoClient, Db, Binary } from 'mongodb';
import { List, Restaurant, Dish, Place, SearchResult, Photo } from "@/app/interfaces/interfaces";

export class Database {
  client: MongoClient;
  db: Db;

  constructor(databaseName: string) {
    this.client = new MongoClient('mongodb://localhost:27017');
    this.db = this.client.db(databaseName);
  }

  // Lists function
  async getLists() {
    return await this.db.collection<List>('lists').find({}).sort({ index: 1 }).toArray();
  }

  // List functions
  async getList(listId: string) {
    return await this.db.collection<List>('lists').findOne({ _id: listId });
  }

  async getListByRestaurantId(restaurantId: string) {
    return await this.db.collection<List>('lists').findOne({ restaurants: restaurantId });
  }

  async addList(list: List) {
    await this.db.collection<List>('lists').insertOne(list);
  }

  async updateList(list: List) {
    await this.db.collection<List>('lists').updateOne(
      { _id: list._id },
      {
        $set: {
          name: list.name,
          description: list.description,
          photoId: list.photoId,
          photoUrl: list.photoUrl
        }
      }
    );
  }

  async deleteList(listId: string) {
    await this.db.collection<List>('lists').deleteOne({ _id: listId });
  }

  // Restaurant functions
  async getRestaurant(restaurantId: string) {
    return await this.db.collection<Restaurant>('restaurants').findOne({ _id: restaurantId });
  }

  async addRestaurant(listId: string, restaurant: Restaurant) {
    // Only add the restaurant if it doesn't already exist inside of the restaraunts collection
    await this.db.collection<Restaurant>('restaurants').updateOne(
      { _id: restaurant._id },
      { $setOnInsert: restaurant },
      { upsert: true }
    )

    // Add the restaurant ID to the specified list
    await this.db.collection<List>('lists').updateOne(
      { _id: listId },
      { $push: { restaurants: restaurant._id } }
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

  async deleteRestaurant(listId: string, restaurantId: string) {
    // Delete the restaurant ID from the specified list
    await this.db.collection<List>('lists').updateOne(
      { _id: listId },
      { $pull: { restaurants: restaurantId } }
    );

    // Only delete the restaurant if the ID is not found in any list
    const foundList = await this.db.collection<List>('lists').findOne({ restaurants: restaurantId });

    if (!foundList) {
      await this.db.collection<Restaurant>('restaurants').deleteOne({ _id: restaurantId });
    }
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

  async moveList(collectionName: string, dragIndex: number, hoverIndex: number) {
    let collection = null;

    if (collectionName === 'lists') {
      collection = this.db.collection<List>('lists');
    } else if (collectionName === 'dishes') {
      collection = this.db.collection<Dish>('dishes');
    } else {
      return;
    }

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
    // If dragIndex and hoverIndex are the same, it is already being taken care of in ListCard.tsx and DishCard.tsx

    // Update the item to its new index position
    await collection.updateOne(
      { _id: dragItem._id },
      { $set: { index: hoverIndex } }
    )
  }

  // Search functions
  async getSearchResults() {
    return await this.db.collection<SearchResult>('places').find({}).toArray();
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