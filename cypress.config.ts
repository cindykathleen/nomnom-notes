import { defineConfig } from 'cypress';
import { config } from 'dotenv';
import { MongoClient } from 'mongodb';

const env = config({path: '.env.test'}).parsed;

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
        }
      });
    },
  },
});