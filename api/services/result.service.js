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

  /**
   * 🔥 Core analytics engine
   * transforms raw results → insights
   */
  static async getResultStats(quizId) {
    const results = await Result.find({ quizId }).lean();

    if (!results.length) {
      return {
        total: 0,
        avgScore: 0,
        avgTimeSpent: 0,
        shareRate: 0,
        scoreDistribution: [],
      };
    }

    const total = results.length;

    // 📊 averages
    const avgScore =
      results.reduce((acc, r) => acc + (r.score || 0), 0) / total;

    const avgTimeSpent =
      results.reduce((acc, r) => acc + (r.timeSpent || 0), 0) / total;

    // 🔥 viral signal: share rate
    const sharedCount = results.filter((r) => r.shared).length;
    const shareRate = sharedCount / total;

    // 📊 score distribution (for UX insights)
    const scoreBuckets = {};

    results.forEach((r) => {
      const bucket = Math.floor((r.score || 0) / 10) * 10; // 0-10, 10-20...
      scoreBuckets[bucket] = (scoreBuckets[bucket] || 0) + 1;
    });

    const scoreDistribution = Object.entries(scoreBuckets).map(
      ([range, count]) => ({
        range: `${range}-${Number(range) + 9}`,
        count,
      })
    );

    return {
      total,
      avgScore: Number(avgScore.toFixed(2)),
      avgTimeSpent: Number(avgTimeSpent.toFixed(2)),
      shareRate: Number(shareRate.toFixed(2)),
      scoreDistribution,
    };
  }

  /**
   * 🧠 Advanced: detect high-performing quiz patterns
   * (used later for trending + recommendation system)
   */
  static async getEngagementSignals(quizId) {
    const results = await Result.find({ quizId }).lean();
    const quiz = await Quiz.findById(quizId).lean();

    if (!quiz || !results.length) {
      return {
        engagementScore: 0,
        viralityScore: 0,
      };
    }

    const plays = quiz.plays || 0;
    const shares = quiz.shares || 0;

    const avgTime =
      results.reduce((acc, r) => acc + (r.timeSpent || 0), 0) /
      results.length;

    /**
     * 🔥 simple but effective heuristic model
     * (no ML, but scalable enough for MVP → growth stage)
     */
    const engagementScore =
      plays * 1 + shares * 4 - avgTime * 0.1;

    const viralityScore = (shares / (plays || 1)) * 100;

    return {
      engagementScore: Number(engagementScore.toFixed(2)),
      viralityScore: Number(viralityScore.toFixed(2)),
    };
  }

  /**
   * 📈 lightweight leaderboard logic (future-ready)
   */
  static async getTopResults(quizId, limit = 10) {
    return Result.find({ quizId })
      .sort({ score: -1, createdAt: -1 })
      .limit(limit)
      .lean();
  }
}

export default ResultService;