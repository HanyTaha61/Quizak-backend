import express from "express";
import QuizController from "../controllers/quiz.controller.js";

const router = express.Router();

/**
 * ⚠️ Rule:
 * Routes = pure mapping layer
 * No logic. No DB. No calculations.
 */

// 📌 Get quiz by slug (frontend main entry)
router.get("/:slug", QuizController.getQuizBySlug);

// 📌 Submit quiz result
router.post("/:id/submit", QuizController.submitResult);

// 📌 Trending feed
router.get("/trending/list", QuizController.getTrending);

// 📌 Share tracking (viral loop)
router.post("/:id/share", QuizController.incrementShare);

export default router;