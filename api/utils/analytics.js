import Quiz from "../models/quiz.model.js";
import Result from "../models/result.model.js";

/**
 * 🧠 Analytics Utility Layer
 * Converts raw engagement data → actionable signals
 */

class Analytics {
  /**
   * 📊 Compute basic engagement metrics for a quiz
   */
  static async computeQuizMetrics(quizId) {
    const quiz = await Quiz.findById(quizId).lean();
    const results = await Result.find({ quizId }).lean();

    if (!quiz) throw new Error("Quiz not found");

    const plays = quiz.plays || 0;
    const shares = quiz.shares || 0;
    const completions = results.length;

    const avgTime =
      completions > 0
        ? results.reduce((acc, r) => acc + (r.timeSpent || 0), 0) /
          completions
        : 0;

    const avgScore =
      completions > 0
        ? results.reduce((acc, r) => acc + (r.score || 0), 0) /
          completions
        : 0;

    return {
      plays,
      shares,
      completions,
      avgTimeSpent: Number(avgTime.toFixed(2)),
      avgScore: Number(avgScore.toFixed(2)),
    };
  }

  /**
   * 🔥 Virality index (core business metric)
   * Simple but powerful heuristic
   */
  static async computeViralityIndex(quizId) {
    const { plays, shares, completions } =
      await this.computeQuizMetrics(quizId);

    if (plays === 0) return 0;

    /**
     * Core idea:
     * - shares = amplification
     * - completions = engagement quality
     * - plays = reach
     */
    const shareRate = shares / plays;
    const completionRate = completions / plays;

    const viralityIndex =
      shareRate * 0.6 + completionRate * 0.4;

    return Number((viralityIndex * 100).toFixed(2));
  }

  /**
   * 📈 Trend momentum indicator
   * Helps decide "trending vs dying content"
   */
  static async computeTrendMomentum(quizId) {
    const quiz = await Quiz.findById(quizId).lean();

    if (!quiz) throw new Error("Quiz not found");

    const ageHours =
      (Date.now() - new Date(quiz.createdAt)) /
      (1000 * 60 * 60);

    const plays = quiz.plays || 0;
    const shares = quiz.shares || 0;

    /**
     * Momentum = engagement density over time decay
     */
    const rawMomentum = (plays + shares * 3) / (ageHours + 2);

    return Number(rawMomentum.toFixed(2));
  }

  /**
   * 🚀 Predict trending potential (rule-based scoring)
   */
  static async predictTrendScore(quizId) {
    const virality = await this.computeViralityIndex(quizId);
    const momentum = await this.computeTrendMomentum(quizId);

    /**
     * Weighted hybrid model (no ML needed yet)
     */
    const trendScore = virality * 0.6 + momentum * 0.4;

    return Number(trendScore.toFixed(2));
  }

  /**
   * 📊 Global dashboard overview (admin use)
   */
  static async getPlatformOverview() {
    const quizzes = await Quiz.find().lean();

    const totalPlays = quizzes.reduce(
      (acc, q) => acc + (q.plays || 0),
      0
    );

    const totalShares = quizzes.reduce(
      (acc, q) => acc + (q.shares || 0),
      0
    );

    const trendingCount = quizzes.filter(
      (q) => q.isTrending
    ).length;

    return {
      totalQuizzes: quizzes.length,
      totalPlays,
      totalShares,
      trendingCount,
      avgEngagement:
        quizzes.length > 0
          ? (totalPlays + totalShares) / quizzes.length
          : 0,
    };
  }
}

export default Analytics;