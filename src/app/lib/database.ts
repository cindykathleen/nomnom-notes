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
    return await this.db.collection<List>('lists').find({}).toArray();
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
      {
        $set: {
          rating: restaurant.rating,
          description: restaurant.description
        }
      }
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
    const newDish = {
      _id: dish._id,
      name: dish.name,
      note: dish.note,
      rating: dish.rating,
      photoId: dish.photoId,
      photoUrl: dish.photoUrl
    }

    await this.db.collection<Dish>('dishes').insertOne(newDish);

    // Add the dish ID to the specified restaurant
    await this.db.collection<Restaurant>('restaurants').updateOne(
      { _id: restaurantId },
      { $push: { dishes: newDish._id } }
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
    return await this.db.collection<Photo>('photos').findOne({ _id: photoId});
  }
  
  async uploadPhoto(photoId: string, photoData: Buffer) {
    const newPhoto = {
      _id: photoId,
      data: new Binary(photoData)
    }

    await this.db.collection<Photo>('photos').insertOne(newPhoto);
  }
}