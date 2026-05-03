import Result from "../models/result.model.js";
import Quiz from "../models/quiz.model.js";

/**
 * 🧠 RESULT SERVICE = ANALYTICS ENGINE
 * مش مجرد DB access layer
 */

class ResultService {
  /**
   * Get all results for a quiz (raw + structured)
   */
  static async getResultsByQuiz(quizId) {
    const results = await Result.find({ quizId })
      .sort({ createdAt: -1 })
      .lean();

    return {
      total: results.length,
      data: results,
    };
  }
}

export default ResultService;