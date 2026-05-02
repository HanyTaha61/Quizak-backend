import Quiz from "../models/quiz.model.js";
import Result from "../models/result.model.js";

/**
 * 🔥 VIRAL CORE ENGINE
 * كل القرارات الذكية هنا مش في controller
 */

class QuizService {

  // simple resolver based on most common answer (can be enhanced with ML later)
  static resolveResult(quiz, answers) {
    const countMap = {}

    answers.forEach((a) => {
      if (!a) return
      countMap[a] = (countMap[a] || 0) + 1
    })

    // get most frequent answer
    const topAnswer = Object.entries(countMap)
      .sort((a, b) => b[1] - a[1])[0]?.[0]

    // match result from DB
    const result = quiz.results.find(r => r.key === topAnswer)

    return {
      key: topAnswer,
      ...result
    }
  }

  /**
   * Save result + trigger analytics updates
   */
  static async submitResult({ quizId, answers, timeSpent }) {
    const quiz = await Quiz.findOne({ slug: quizId }) // ✅ fix

    if (!quiz) throw new Error("Quiz not found")

    const resolved = this.resolveResult(quiz, answers)

    await Result.create({
      quizId,
      answers,
      resultKey: resolved.key,
      resultTitle: resolved.title,
      resultDescription: resolved.description,
      resultImage: resolved.image,
      timeSpent
    })

    return resolved
  }

  /**
   * 🔥 VIRAL SCORING ALGORITHM
   * هنا السر الحقيقي
   */
  static async updateTrendingScore(quizId) {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return;

    // lightweight heuristic (not ML, but scalable)
    const ageInHours =
      (Date.now() - new Date(quiz.createdAt)) / (1000 * 60 * 60);

    const engagement =
      (quiz.plays || 0) * 1 + (quiz.shares || 0) * 3;

    // decay factor → newer quizzes get boost
    const freshnessBoost = 1 / Math.log(ageInHours + 2);

    const trendingScore = engagement * freshnessBoost;

    const isTrending = trendingScore > 50; // tunable threshold

    await Quiz.findByIdAndUpdate(quizId, {
      isTrending,
    });

    return trendingScore;
  }

  /**
   * Get quiz with enriched analytics (frontend ready)
   */
  static async getQuizBySlug(slug) {
    const quiz = await Quiz.findOne({ slug });

    if (!quiz) throw new Error("Quiz not found");

    return {
      ...quiz.toObject(),
      viral: {
        engagement: (quiz.plays || 0) + (quiz.shares || 0),
        isTrending: quiz.isTrending,
      },
    };
  }

  /**
   * Top trending quizzes feed (core viral feed)
   */
  static async getTrendingQuizzes(limit = 10) {
    return Quiz.find({ isPublished: true })
      .sort({ plays: -1, shares: -1 })
      .limit(limit);
  }

  /**
   * Share tracking (critical for virality loop)
   */
  static async incrementShare(quizId) {
    return Quiz.findByIdAndUpdate(
      quizId,
      { $inc: { shares: 1 } },
      { new: true }
    );
  }
}

export default QuizService;