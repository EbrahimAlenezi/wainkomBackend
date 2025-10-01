import mongoose from "mongoose";
import dotenv from "dotenv";
import { env } from "../config/config";

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;
