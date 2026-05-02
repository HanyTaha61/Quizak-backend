import express from "express";
import ResultController from "../controllers/result.controller.js";

const router = express.Router();

/**
 * ⚠️ Routes layer rule:
 * Pure mapping only. No logic. No DB. No services.
 */

// 📌 Submit quiz result
router.post("/submit", ResultController.submitResult);

// 📌 Get all results for a quiz
router.get("/:quizId", ResultController.getResultsByQuiz);

// 📌 Get analytics/stats for a quiz
router.get("/:quizId/stats", ResultController.getResultStats);

export default router;