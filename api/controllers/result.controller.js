import QuizService from "../services/quiz.service.js";
import Quiz from "../models/quiz.model.js";
import resultService from "../models/result.model.js";
/**
 * ⚠️ Controller rule:
 * - No business logic
 * - No scoring decisions
 * - Just orchestration + response shaping
 */

class ResultController {
  /**
   * POST /api/v1/results/submit
   * (Alternative endpoint if you separate results domain)
   */
static async submitResult(req, res) {
  try {
    const { quizId, answers, timeSpent } = req.body

    const result = await QuizService.submitResult({
      quizId,
      answers,
      timeSpent
    })

    return res.status(200).json({
      success: true,
      data: result
    })

  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    })
  }
}

  /**
   * GET /api/v1/results/:quizId
   * (analytics view - lightweight aggregation entry)
   */
  static async getResultsByQuiz(req, res) {
    try {
      const { quizId } = req.params;

      const results = await ResultService.getResultsByQuiz(quizId);

      return res.status(200).json({
        success: true,
        data: results,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message || "Failed to fetch results",
      });
    }
  }

  /**
   * GET /api/v1/results/:quizId/stats
   * (basic analytics endpoint for dashboard)
   */
  static async getResultStats(req, res) {
    try {
      const { quizId } = req.params;

      const stats = await ResultService.getResultStats(quizId);

      return res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message || "Failed to fetch stats",
      });
    }
  }
}

export default ResultController;