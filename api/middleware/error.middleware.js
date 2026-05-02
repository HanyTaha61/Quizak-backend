import Response from "../utils/response.js";

/**
 * 🚨 Global Error Handler
 * Single source of truth for all API errors
 */

const errorMiddleware = (err, req, res, next) => {
  console.error("🔥 Error:", err);

  // default values
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // handle mongoose validation errors
  if (err.name === "ValidationError") {
    statusCode = 422;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  // handle duplicate keys (MongoDB)
  if (err.code === 11000) {
    statusCode = 409;
    message = "Duplicate key error";
  }

  // handle invalid ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  return Response.error(res, message, statusCode);
};

export default errorMiddleware;