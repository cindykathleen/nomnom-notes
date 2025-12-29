import clientPromise from './mongoDb';
import type { Db } from 'mongodb';

declare global {
  var _db: Db | undefined;
}

export default async function getDb(dbType?: string): Promise<Db> {
  if (global._db) return global._db;

  let dbName = '';

  if (dbType === 'auth') {
    dbName = 'nomnom_notes_auth';
  } else if (dbType === 'test') {
    dbName = 'nomnom_notes_test';
  } else {
    dbName = 'nomnom_notes';
  }
  
  const client = await clientPromise;
  global._db = client.db(dbName + (process.env.MONGODB_DBNAME_SUFFIX || ''));

  return global._db;
}