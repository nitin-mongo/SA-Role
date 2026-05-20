import { MongoClient } from "mongodb";

// In development, reuse the connection across hot reloads
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function getClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI environment variable is not set.");
  }

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      const client = new MongoClient(uri);
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  }

  const client = new MongoClient(uri);
  return client.connect();
}

// Lazy promise — only connects when first awaited (not at build time)
const clientPromise: Promise<MongoClient> = new Promise((resolve, reject) => {
  Promise.resolve().then(() => getClientPromise()).then(resolve).catch(reject);
});

export default clientPromise;

export const DB_NAME = process.env.MONGODB_DB || "sa_framework";
export const COLLECTION = "framework_data";
