import { defineConfig } from 'cypress';
import { config } from 'dotenv';
import { MongoClient } from 'mongodb'
import { User, List } from './src/app/interfaces/interfaces'
import { v4 as uuidv4 } from 'uuid';

const env = config({ path: '.env.test' }).parsed;

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    env: env,
    setupNodeEvents(on, config) {
      on('task', {
        async clearTestDbs() {
          const client = new MongoClient('mongodb://localhost:27017');
          await client.connect();

          const mainDb = client.db('nomnom_notes_test');
          const authDb = client.db('nomnom_notes_auth_test');

          await mainDb.dropDatabase();
          await authDb.dropDatabase();

          await client.close();
          return null;
        },
        async clearSessions() {
          const client = new MongoClient('mongodb://localhost:27017');
          await client.connect();

          const db = client.db('nomnom_notes_auth_test');
          await db.collection('session').deleteMany({});

          await client.close();
          return null;
        },
        async clearData() {
          const client = new MongoClient('mongodb://localhost:27017');
          await client.connect();

          const db = client.db('nomnom_notes_test');

          await db.collection('users').updateMany(
            {},
            { $set: { lists: [], searchRate: [] } }
          );
          await db.collection('lists').deleteMany({});
          await db.collection('places').deleteMany({});
          await db.collection('restaurants').deleteMany({});
          await db.collection('photos').deleteMany({});

          await client.close();
          return null;
        },
        async 'db:seed'() {
          const client = new MongoClient('mongodb://localhost:27017');
          await client.connect();

          const db = client.db('nomnom_notes_test');

          const user = await db.collection<User>('users').findOne({});
          if (!user) return null;

          const list: List = {
            _id: uuidv4(),
            owner: user._id,
            visibility: 'private',
            name: 'Test List',
            description: 'This is a test list.',
            photoId: '',
            photoUrl: '/api/database/photos?id=',
            restaurants: []
          };

          await db.collection<List>('lists').insertOne(list);

          await db.collection<User>('users').updateOne(
            { _id: user._id },
            { $push: { lists: list._id } }
          );

          return null;
        },
        async addSearches() {
          const client = new MongoClient('mongodb://localhost:27017');
          await client.connect();

          const db = client.db('nomnom_notes_test');

          const searches = Array.from({ length: 100 }, () => new Date());

          await db.collection('users').updateOne(
            {},
            { $set: { searchRate: searches } }
          );

          return null;
        }
      });
    },
  },
});