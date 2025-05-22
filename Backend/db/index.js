import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Make sure this is here

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URL;
    const connectionInstance = await mongoose.connect(mongoURI);
    console.log(`MongoDB connected: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
