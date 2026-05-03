import express from "express";
import QuizController from "../controllers/quiz.controller.js";

const router = express.Router();

/**
 * ⚠️ Rule:
 * Routes = pure mapping layer
 * No logic. No DB. No calculations.
*/

// // 📌 Trending feed
// router.get("/trending/list", QuizController.getTrending);

// 📌 Get all quizzes
router.get("/", QuizController.getAllQuizzes);

// 📌create new quiz (by admin only)
router.post("/", QuizController.createQuiz);

// 📌 Get quiz by slug (frontend main entry)
router.get("/:slug", QuizController.getQuizBySlug);

// 📌 Submit quiz result
router.post("/:id/submit", QuizController.submitResult);


// 📌 Share tracking (viral loop)
router.post("/:id/share", QuizController.incrementShare);

export default router;