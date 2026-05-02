import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import errorMiddleware from "./api/middleware/error.middleware.js";
import quizRoutes from "./api/routes/quiz.routes.js";
import resultsRoutes from "./api/routes/results.routes.js";

/**
 * ⚠️ App layer rule:
 * This is orchestration only.
 * NO business logic. NO feature logic.
 */

const app = express();

/**
 * 🔐 Core Middlewares
 */
app.use(helmet()); // security headers
app.use(cors({
  origin: "*", // tighten later in production
  credentials: true,
}));

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

/**
 * 📊 Logging (dev visibility)
 */
app.use(morgan("dev"));

/**
 * 🧠 API Routes
 * Versioning-ready structure (important for scaling)
 */
app.use("/api/quizzes", quizRoutes);
app.use("/api/results", resultsRoutes);

/**
 * 🚨 Health check (for deployment + monitoring)
 */
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "quizak-api",
    timestamp: new Date().toISOString(),
  });
});

/**
 * ❌ 404 Handler (unknown routes)
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/**
 * 💥 Global Error Handler
 * Prevents silent crashes + standardizes responses
 */
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;