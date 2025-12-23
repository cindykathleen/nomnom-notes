import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('Please define MONGODB_URI');
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// In dev, reuse the global promise to avoid multiple connections
if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }

  clientPromise = global._mongoClientPromise;
}
// In prod, rely on module scope
else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;