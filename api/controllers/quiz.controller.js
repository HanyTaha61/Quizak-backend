import QuizService from "../services/quiz.service.js";

/**
 * ⚠️ Controller rule:
 * NO business logic here.
 * Only request orchestration + response shaping.
 */

class QuizController {
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