import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

/**
 * 🧠 MongoDB Connection Layer (Production-grade)
 */

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
    });

    console.log(`🟢 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("🔴 MongoDB Connection Failed:", error.message);

    // fail fast (correct for backend services)
    process.exit(1);
  }
};

/**
 * 🔥 Connection lifecycle monitoring
 * مهم جدًا في production debugging
 */

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB disconnected");
});

mongoose.connection.on("reconnected", () => {
  console.log("🟢 MongoDB reconnected");
});

mongoose.connection.on("error", (err) => {
  console.error("🔥 MongoDB runtime error:", err);
});

export default connectDB;