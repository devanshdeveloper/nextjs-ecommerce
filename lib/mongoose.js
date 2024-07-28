import mongoose from "mongoose";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error(
    "Please define the DATABASE_URL environment variable inside .env.local"
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    console.log("Using existing database connection");
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(DATABASE_URL, {
        useNewUrlParser: true,
      })
      .then((mongoose) => {
        console.log("New database connection established");
        return mongoose;
      })
      .catch((error) => {
        console.error("Database connection error:", error);
        throw error;
      });
  }
  try {
    cached.conn = await cached.promise;
    console.log("Database connection successful");
  } catch (error) {
    console.error("Error awaiting database connection:", error);
  }
  return cached.conn;
}

export default connectDB;
