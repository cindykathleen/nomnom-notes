import clientPromise from './mongoDb';
import type { Db } from 'mongodb';

declare global {
  var _db: Db | undefined;
}

export default async function getDb(): Promise<Db> {
  if (global._db) return global._db;

  const client = await clientPromise;
  global._db = client.db(
    'nomnom_notes' + (process.env.MONGODB_DBNAME_SUFFIX || '')
  );

  return global._db;
}