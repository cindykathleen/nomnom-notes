import getDb from '@/app/lib/db';
import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { nextCookies } from 'better-auth/next-js';

const db = await getDb('auth');

export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true
  },
  plugins: [nextCookies()],
  secret: process.env.BETTER_AUTH_SECRET
});