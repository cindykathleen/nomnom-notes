import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { Database } from './database';

const db = new Database('nomnom_notes_auth_test');

export const auth = betterAuth({
  database: mongodbAdapter(db.db),
  emailAndPassword: {
    enabled: true
  }
});