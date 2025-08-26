import { Database } from './database';
import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { nextCookies } from 'better-auth/next-js';

const db = new Database('nomnom_notes_auth');

export const auth = betterAuth({
  database: mongodbAdapter(db.db),
  emailAndPassword: {
    enabled: true
  },
  plugins: [nextCookies()]
});