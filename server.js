import app from "./app.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 5000;

/**
 * ⚠️ DB connection is part of infrastructure, not business logic
 */
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("🟢 MongoDB connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("🔴 Failed to start server:", err);
    process.exit(1);
  }
};

startServer();