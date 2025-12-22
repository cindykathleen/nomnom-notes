import clientPromise from './mongoDb';
import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { nextCookies } from 'better-auth/next-js';

const client = await clientPromise;
const db = client.db(
  'nomnom_notes_auth' + (process.env.MONGODB_DBNAME_SUFFIX || '')
);

export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true
  },
  plugins: [nextCookies()],
  secret: process.env.BETTER_AUTH_SECRET
});