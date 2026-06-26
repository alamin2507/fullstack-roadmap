import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.warn("WARNING: MONGODB_URI is not defined in environment variables. Local progress saving won't persist to DB.");
}

let isConnected = false;

export async function connectToDatabase() {
  if (isConnected) {
    return;
  }

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is required to connect to MongoDB.");
  }

  try {
    const db = await mongoose.connect(MONGODB_URI);
    isConnected = db.connections[0].readyState === 1;
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}
