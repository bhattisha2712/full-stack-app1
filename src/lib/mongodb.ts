import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {
  serverSelectionTimeoutMS: 5000, // 5 second timeout
  connectTimeoutMS: 10000, // 10 second connection timeout
  socketTimeoutMS: 45000, // 45 second socket timeout
  maxPoolSize: 10,
  retryWrites: true,
  retryReads: true,
};

// Removed unused variable 'client'
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!uri) {
  throw new Error("Please define the MONGODB_URI environment variable in your .env.local file");
}

const createConnection = async (): Promise<MongoClient> => {
  try {
    console.log("Attempting to connect to MongoDB Atlas...");
    const client = new MongoClient(uri!, options);
    await client.connect();
    console.log("Successfully connected to MongoDB Atlas");
    return client;
  } catch (error) {
    console.error("MongoDB Atlas connection failed:", error);
    throw new Error("MongoDB Atlas connection failed: " + (error instanceof Error ? error.message : String(error)));
  }
};

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = createConnection();
  }
  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = createConnection();
}

export default clientPromise;