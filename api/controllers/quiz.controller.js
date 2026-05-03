import QuizService from "../services/quiz.service.js";
import Quiz from "../models/quiz.model.js"

/**
 * ⚠️ Controller rule:
 * NO business logic here.
 * Only request orchestration + response shaping.
 */

/**
 * GET /api/quizzes
 */
class QuizController {

  static async getAllQuizzes(req, res) {
    try {
      const quizzes = await Quiz.find().select("title slug image description shares createdAt");

      return res.status(200).json({
        quizzes,
        stats: {
          users: 15230 // mock أو من DB
        }
      });

    } catch (err) {
      return res.status(500).json({
        message: err.message
      });
    }
  }

  /**
   * GET /api/quizzes/:slug
   */
  static async getQuizBySlug(req, res) {
    try {
      const { slug } = req.params;

      const quiz = await QuizService.getQuizBySlug(slug);

      return res.status(200).json({
        success: true,
        data: quiz,
      });
    } catch (err) {
      return res.status(404).json({
        success: false,
        message: err.message || "Quiz not found",
      });
    }
  }

  // POST /api/quizzes
static async createQuiz(req, res) {
  try {
    const quiz = await QuizService.createQuiz(req.body);

    res.status(201).json({
      success: true,
      data: quiz
    });

  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
}

  /**
  * POST /api/quizzes/:id/submit
  */
  static async submitResult(req, res) {
    try {
      const {
        answers,
        score,
        resultData,
        timeSpent,
        userId,
        source,
      } = req.body;

      const { id: quizId } = req.params;

      const result = await QuizService.submitResult({
        quizId,
        answers,
        score,
        resultData,
        timeSpent,
        userId,
        source,
      });

      return res.status(201).json({
        success: true,
        data: result,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  /**
   * GET /api/quizzes/trending
   */
  static async getTrending(req, res) {
    try {
      const { limit } = req.query;

      const quizzes = await QuizService.getTrendingQuizzes(
        Number(limit) || 10
      );

      return res.status(200).json({
        success: true,
        data: quizzes,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  /**
   * POST /api/quizzes/:id/share
   */
  static async incrementShare(req, res) {
    try {
      const { id } = req.params;

      const quiz = await QuizService.incrementShare(id);

      return res.status(200).json({
        success: true,
        data: {
          shares: quiz.shares,
        },
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
}

export default QuizController;