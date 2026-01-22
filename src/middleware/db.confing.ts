import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUrl = process.env.MONGO_URL;
    if (!mongoUrl) {
      throw new Error("❌ MONGO_URL is not defined in environment variables");
    }
    await mongoose.connect(mongoUrl);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};
