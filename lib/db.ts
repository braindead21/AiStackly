import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  console.warn("MONGODB_URI is not set. Database features will be disabled.");
}

let cached = (global as any).mongoose as { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is missing; set it in .env.local");
  }
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { dbName: process.env.MONGODB_DB || undefined });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// Alias for compatibility
export const connectDB = dbConnect;