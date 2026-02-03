import { defineConfig } from 'cypress';
import { config as loadEnv } from 'dotenv';
import { MongoClient } from 'mongodb'
import { User, List, Restaurant } from './src/app/interfaces/interfaces'
import { v4 as uuidv4 } from 'uuid';

// Only load .env.test when running locally
if (!process.env.CI) {
  loadEnv({ path: '.env.test' });
}

export default defineConfig({
  e2e: {
    baseUrl: process.env.BASE_URL,
    env: {
      MONGODB_URI: process.env.MONGODB_URI,
      MONGODB_DBNAME_SUFFIX: process.env.MONGODB_DBNAME_SUFFIX,
      BETTER_AUTH_SESSION_TOKEN: process.env.BETTER_AUTH_SESSION_TOKEN,
      SIGNUP_ACCESS_SECRET: process.env.SIGNUP_ACCESS_SECRET,
    },
    setupNodeEvents(on, config) {
      on('task', {
        async clearTestDbs() {
          const client = new MongoClient(process.env.MONGODB_URI || '');
          await client.connect();

          const mainDb = client.db('nomnom_notes_test');
          const authDb = client.db('nomnom_notes_auth_test');

          const collections = await mainDb.collections();
          for (const col of collections) {
            await col.deleteMany({});
          }

          const authCollections = await authDb.collections();
          for (const col of authCollections) {
            await col.deleteMany({});
          }

          await client.close();
          return null;
        },
        async clearSessions() {
          const client = new MongoClient(process.env.MONGODB_URI || '');
          await client.connect();

          const db = client.db('nomnom_notes_auth_test');
          await db.collection('session').deleteMany({});

          await client.close();
          return null;
        },
        async clearData() {
          const client = new MongoClient(process.env.MONGODB_URI || '');
          await client.connect();

          const db = client.db('nomnom_notes_test');

          await db.collection('users').updateMany(
            {},
            { $set: { lists: [], searchRate: [], mapRate: [] } }
          );
          await db.collection('lists').deleteMany({});
          await db.collection('restaurants').deleteMany({});
          await db.collection('photos').deleteMany({});

          await client.close();
          return null;
        },
        async 'db:seed'() {
          const client = new MongoClient(process.env.MONGODB_URI || '');
          await client.connect();

          const db = client.db('nomnom_notes_test');

          const user = await db.collection<User>('users').findOne({});
          if (!user) return null;

          // Add a list
          const list: List = {
            _id: uuidv4(),
            owner: user._id,
            visibility: 'private',
            name: 'Test List',
            description: 'This is a test list.',
            photoUrl: '',
            restaurants: [],
            dateAdded: new Date,
            dateUpdated: new Date,
          };

          await db.collection<List>('lists').insertOne(list);

          await db.collection<User>('users').updateOne(
            { _id: user._id },
            { $push: { lists: list._id } }
          );

          // Add a restaurant
          const restaurant: Restaurant = {
            _id: "15ebb847-844b-433f-a343-e491ca8452d3",
            name: "Chipotle Mexican Grill",
            type: "Mexican restaurant",
            rating: 3.4,
            address: "1815 S Bascom Ave, Campbell, CA 95008, USA",
            location: {
              latitude: 37.29088,
              longitude: -121.9320587
            },
            mapsUrl: "https://maps.google.com/?cid=5825659302684031711&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
            photoUrl: '',
            reviews: [],
            dishes: [],
            dateAdded: new Date,
            dateUpdated: new Date,
          }

          await db.collection<Restaurant>('restaurants').insertOne(restaurant);

          await db.collection<List>('lists').updateOne(
            { _id: list._id },
            { $push: { restaurants: restaurant._id } }
          );

          return null;
        },
        async addSearches() {
          const client = new MongoClient(process.env.MONGODB_URI || '');
          await client.connect();

          const db = client.db('nomnom_notes_test');

          const searches = Array.from({ length: 100 }, () => new Date());

          await db.collection('users').updateOne(
            {},
            { $set: { searchRate: searches } }
          );

          return null;
        },
        async addMapViews() {
          const client = new MongoClient(process.env.MONGODB_URI || '');
          await client.connect();

          const db = client.db('nomnom_notes_test');

          const mapViews = Array.from({ length: 250 }, () => new Date());

          await db.collection('users').updateOne(
            {},
            { $set: { mapRate: mapViews } }
          );

          return null;
        }
      });
    },
  },
});