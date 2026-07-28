import dotenv from 'dotenv';

// Only load .env.test when running locally
if (!process.env.CI) {
  dotenv.config({ path: '.env.test' });
}

import { defineConfig } from 'cypress';
import clientPromise from './src/app/lib/mongoDb';
import {
  User,
  List,
  Restaurant,
  Dish,
  Review,
  ActivityItem,
  ActivityType,
} from './src/app/interfaces/interfaces';
import { v4 as uuidv4 } from 'uuid';

const PLACEHOLDER_IMG =
  'https://pub-ade72a2b901940aa8064a0e8a76b5b67.r2.dev/placeholder.jpg';

type SeedActivityInput = Omit<ActivityItem, '_id' | 'createdAt' | 'windowStartedAt'> & {
  _id?: string;
  createdAt: string | Date;
  windowStartedAt?: string | Date;
};

function dbName() {
  return 'nomnom_notes' + (process.env.MONGODB_DBNAME_SUFFIX || '');
}

export default defineConfig({
  e2e: {
    baseUrl: process.env.BASE_URL,
    env: {
      MONGODB_URI: process.env.MONGODB_URI,
      MONGODB_DBNAME_SUFFIX: process.env.MONGODB_DBNAME_SUFFIX,
      BETTER_AUTH_SESSION_TOKEN: process.env.BETTER_AUTH_SESSION_TOKEN,
      SIGNUP_ACCESS_SECRET: process.env.SIGNUP_ACCESS_SECRET,
      NEXT_PUBLIC_SOCIAL_FEATURE_FLAG: 'true',
    },
    setupNodeEvents(on, config) {
      on('task', {
        async clearAuth() {
          const client = await clientPromise;
          const mainDb = client.db(dbName());
          const authDb = client.db('nomnom_notes_auth' + (process.env.MONGODB_DBNAME_SUFFIX || ''));

          await mainDb.collection('users').deleteMany({});

          const authCollections = await authDb.collections();
          for (const col of authCollections) {
            await col.deleteMany({});
          }

          return null;
        },
        async clearSessions() {
          const client = await clientPromise;
          const db = client.db('nomnom_notes_auth' + (process.env.MONGODB_DBNAME_SUFFIX || ''));

          await db.collection('session').deleteMany({});

          return null;
        },
        async clearData() {
          const client = await clientPromise;
          const db = client.db(dbName());

          await db.collection('users').updateMany(
            {},
            { $set: { lists: [], searchRate: [], mapRate: [] } }
          );
          await db.collection('lists').deleteMany({});
          await db.collection('restaurants').deleteMany({});
          await db.collection('dishes').deleteMany({});
          await db.collection('activities').deleteMany({});

          return null;
        },
        async 'db:seed'() {
          const client = await clientPromise;
          const db = client.db(dbName());

          const user = await db.collection<User>('users').findOne({});
          if (!user) return null;

          const list: List = {
            _id: uuidv4(),
            owner: user._id,
            visibility: 'private',
            name: 'Test List',
            description: 'This is a test list.',
            photoUrl: PLACEHOLDER_IMG,
            restaurants: [],
            dateAdded: new Date(),
            dateUpdated: new Date(),
          };

          await db.collection<List>('lists').insertOne(list);

          await db.collection<User>('users').updateOne(
            { _id: user._id },
            { $push: { lists: list._id } }
          );

          const restaurant: Restaurant = {
            _id: '15ebb847-844b-433f-a343-e491ca8452d3',
            name: 'Chipotle Mexican Grill',
            type: 'Mexican restaurant',
            rating: 3.4,
            address: '1815 S Bascom Ave, Campbell, CA 95008, USA',
            location: {
              latitude: 37.29088,
              longitude: -121.9320587,
            },
            mapsUrl:
              'https://maps.google.com/?cid=5825659302684031711&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA',
            photoUrl: PLACEHOLDER_IMG,
            reviews: [],
            dishes: [],
            dateAdded: new Date(),
            dateUpdated: new Date(),
          };

          await db.collection<Restaurant>('restaurants').insertOne(restaurant);

          await db.collection<List>('lists').updateOne(
            { _id: list._id },
            { $push: { restaurants: restaurant._id } }
          );

          return null;
        },
        async addSearches() {
          const client = await clientPromise;
          const db = client.db(dbName());

          const searches = Array.from({ length: 100 }, () => new Date());

          await db.collection('users').updateOne({}, { $set: { searchRate: searches } });

          return null;
        },
        async addPrivateUser() {
          const client = await clientPromise;
          const db = client.db(dbName());

          const privateUser: User = {
            _id: uuidv4(),
            name: 'Private User',
            email: 'private@test.com',
            lists: [],
            searchRate: [],
            mapRate: [],
            photoUrl: PLACEHOLDER_IMG,
            location: 'San Jose, CA',
            profilePrivacy: true,
            photos: [],
            following: [],
            followers: [],
            followRequests: [],
          };

          await db.collection<User>('users').insertOne(privateUser);

          return privateUser._id;
        },
        async removePrivateUser(userId: string) {
          const client = await clientPromise;
          const db = client.db(dbName());

          await db.collection<User>('users').deleteOne({ _id: userId });
          return null;
        },
        async getUserIdByEmail(email: string) {
          const client = await clientPromise;
          const db = client.db(dbName());

          const user = await db.collection<User>('users').findOne({ email });
          return user?._id ?? null;
        },
        async requestFollow({
          requesterId,
          followeeId,
        }: {
          requesterId: string;
          followeeId: string;
        }) {
          const client = await clientPromise;
          const db = client.db(dbName());

          await db.collection<User>('users').updateOne(
            { _id: followeeId },
            { $addToSet: { followRequests: requesterId } }
          );
          return null;
        },
        async approveFollowRequest({
          ownerId,
          requesterId,
        }: {
          ownerId: string;
          requesterId: string;
        }) {
          const client = await clientPromise;
          const db = client.db(dbName());

          await db.collection<User>('users').updateOne(
            { _id: ownerId },
            { $pull: { followRequests: requesterId } }
          );
          await Promise.all([
            db.collection<User>('users').updateOne(
              { _id: requesterId },
              { $addToSet: { following: ownerId } }
            ),
            db.collection<User>('users').updateOne(
              { _id: ownerId },
              { $addToSet: { followers: requesterId } }
            ),
          ]);
          return null;
        },
        async resetUserSocial(userId: string) {
          const client = await clientPromise;
          const db = client.db(dbName());

          await db.collection<User>('users').updateOne(
            { _id: userId },
            { $set: { following: [], followers: [], followRequests: [] } }
          );

          return null;
        },
        async clearActivities() {
          const client = await clientPromise;
          const db = client.db(dbName());

          await db.collection('activities').deleteMany({});
          return null;
        },
        async addFeedActor(options: { name?: string; email?: string } | null = {}) {
          const client = await clientPromise;
          const db = client.db(dbName());
          const { name = 'Feed Actor', email } = options || {};

          const actor: User = {
            _id: uuidv4(),
            name,
            email: email || `feed-actor-${uuidv4()}@test.com`,
            lists: [],
            searchRate: [],
            mapRate: [],
            photoUrl: PLACEHOLDER_IMG,
            location: 'San Jose, CA',
            profilePrivacy: false,
            photos: [],
            following: [],
            followers: [],
            followRequests: [],
          };

          await db.collection<User>('users').insertOne(actor);
          return actor._id;
        },
        async removeFeedActor(userId: string) {
          const client = await clientPromise;
          const db = client.db(dbName());

          const user = await db.collection<User>('users').findOne({ _id: userId });
          if (user?.lists?.length) {
            const lists = await db
              .collection<List>('lists')
              .find({ _id: { $in: user.lists } })
              .toArray();
            const restaurantIds = lists.flatMap((list) => list.restaurants);
            const restaurants = restaurantIds.length
              ? await db
                  .collection<Restaurant>('restaurants')
                  .find({ _id: { $in: restaurantIds } })
                  .toArray()
              : [];
            const dishIds = restaurants.flatMap((restaurant) => restaurant.dishes);

            if (dishIds.length) {
              await db.collection<Dish>('dishes').deleteMany({ _id: { $in: dishIds } });
            }
            if (restaurantIds.length) {
              await db
                .collection<Restaurant>('restaurants')
                .deleteMany({ _id: { $in: restaurantIds } });
            }
            await db.collection<List>('lists').deleteMany({ _id: { $in: user.lists } });
          }

          await db.collection<ActivityItem>('activities').deleteMany({ userId });
          await db.collection<User>('users').deleteOne({ _id: userId });
          return null;
        },
        async seedFollowEdge({
          followerId,
          followeeId,
        }: {
          followerId: string;
          followeeId: string;
        }) {
          const client = await clientPromise;
          const db = client.db(dbName());

          await Promise.all([
            db.collection<User>('users').updateOne(
              { _id: followerId },
              { $addToSet: { following: followeeId } }
            ),
            db.collection<User>('users').updateOne(
              { _id: followeeId },
              { $addToSet: { followers: followerId } }
            ),
          ]);
          return null;
        },
        async unfollowEdge({
          followerId,
          followeeId,
        }: {
          followerId: string;
          followeeId: string;
        }) {
          const client = await clientPromise;
          const db = client.db(dbName());

          await Promise.all([
            db.collection<User>('users').updateOne(
              { _id: followerId },
              { $pull: { following: followeeId } }
            ),
            db.collection<User>('users').updateOne(
              { _id: followeeId },
              { $pull: { followers: followerId } }
            ),
          ]);
          return null;
        },
        async seedListForUser({
          userId,
          name = 'Actor List',
        }: {
          userId: string;
          name?: string;
        }) {
          const client = await clientPromise;
          const db = client.db(dbName());

          const list: List = {
            _id: uuidv4(),
            owner: userId,
            visibility: 'public',
            name,
            description: 'Feed test list',
            photoUrl: PLACEHOLDER_IMG,
            restaurants: [],
            dateAdded: new Date(),
            dateUpdated: new Date(),
          };

          await db.collection<List>('lists').insertOne(list);
          await db.collection<User>('users').updateOne(
            { _id: userId },
            { $push: { lists: list._id } }
          );

          return list._id;
        },
        async seedRestaurantWithDishes({
          listId,
          restaurantName = 'Heytea',
          dishNames = ['Milk Tea', 'Cheese Foam', 'Taro Fries'],
        }: {
          listId: string;
          restaurantName?: string;
          dishNames?: string[];
        }) {
          const client = await clientPromise;
          const db = client.db(dbName());

          const dishIds = dishNames.map(() => uuidv4());
          const dishes: Dish[] = dishNames.map((dishName, index) => ({
            _id: dishIds[index],
            index,
            name: dishName,
            reviews: [],
            photoUrl: PLACEHOLDER_IMG,
            dateAdded: new Date(),
            dateUpdated: new Date(),
          }));

          const restaurant: Restaurant = {
            _id: uuidv4(),
            name: restaurantName,
            type: 'Cafe',
            rating: 4.5,
            address: '123 Test St',
            location: { latitude: 37.33, longitude: -121.89 },
            mapsUrl: 'https://maps.google.com',
            photoUrl: PLACEHOLDER_IMG,
            reviews: [],
            dishes: dishIds,
            dateAdded: new Date(),
            dateUpdated: new Date(),
          };

          if (dishes.length) {
            await db.collection<Dish>('dishes').insertMany(dishes);
          }
          await db.collection<Restaurant>('restaurants').insertOne(restaurant);
          await db.collection<List>('lists').updateOne(
            { _id: listId },
            { $push: { restaurants: restaurant._id } }
          );

          return { restaurantId: restaurant._id, dishIds };
        },
        async seedActivities(activities: SeedActivityInput[]) {
          const client = await clientPromise;
          const db = client.db(dbName());

          const docs: ActivityItem[] = activities.map((activity) => {
            const doc: ActivityItem = {
              _id: activity._id || uuidv4(),
              userId: activity.userId,
              type: activity.type,
              createdAt: new Date(activity.createdAt),
            };

            if (activity.listId) doc.listId = activity.listId;
            if (activity.restaurantId) doc.restaurantId = activity.restaurantId;
            if (activity.dishId) doc.dishId = activity.dishId;
            if (activity.dishIds) doc.dishIds = activity.dishIds;
            if (activity.includesRestaurantReview !== undefined) {
              doc.includesRestaurantReview = activity.includesRestaurantReview;
            }
            if (activity.windowStartedAt) {
              doc.windowStartedAt = new Date(activity.windowStartedAt);
            }

            return doc;
          });

          if (docs.length) {
            await db.collection<ActivityItem>('activities').insertMany(docs);
          }

          return docs.map((doc) => doc._id);
        },
        async createRestaurantReviewActivity({
          userId,
          restaurantId,
          rating = 4,
          note = 'Great spot',
        }: {
          userId: string;
          restaurantId: string;
          rating?: number;
          note?: string;
        }) {
          const client = await clientPromise;
          const db = client.db(dbName());

          const existingRestaurant = await db
            .collection<Restaurant>('restaurants')
            .findOne({ _id: restaurantId });
          if (!existingRestaurant) {
            throw new Error('Restaurant not found');
          }

          const user = await db.collection<User>('users').findOne({ _id: userId });
          if (!user) {
            throw new Error('User not found');
          }

          const review: Review = {
            _id: uuidv4(),
            createdBy: userId,
            name: user.name,
            rating,
            note,
            dateAdded: new Date(),
            dateUpdated: new Date(),
          };

          await db.collection<Restaurant>('restaurants').updateOne(
            { _id: restaurantId },
            {
              $set: {
                reviews: [...existingRestaurant.reviews, review],
                dateUpdated: new Date(),
              },
            }
          );

          const activity: ActivityItem = {
            _id: uuidv4(),
            userId,
            type: ActivityType.RESTAURANT_REVIEWED,
            restaurantId,
            createdAt: new Date(),
          };

          await db.collection<ActivityItem>('activities').insertOne(activity);

          return null;
        },
      });
    },
  },
});
