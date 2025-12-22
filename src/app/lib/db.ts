import clientPromise from './mongoDb';
import { Database } from './database';

let dbInstance: Database | null = null;

export default async function getDb() {
  if (dbInstance) return dbInstance;

  const client = await clientPromise;
  const db = client.db(
    'nomnom_notes' + (process.env.MONGODB_DBNAME_SUFFIX || '')
  );

  dbInstance = new Database(db);
  return dbInstance;
}