import Quiz from "../models/quiz.model.js";
import Result from "../models/result.model.js";

/**
 * 🔥 VIRAL CORE ENGINE
 * كل القرارات الذكية هنا مش في controller
 */

class QuizService {

  /* 🔹 CREATE QUIZ */
  static async createQuiz(payload) {

    const { title, slug, questions, results } = payload;

    // 🔥 Basic validation
    if (!title || !slug) {
      throw new Error("Title and slug are required");
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("Quiz must have at least one question");
    }

    if (!Array.isArray(results) || results.length === 0) {
      throw new Error("Quiz must have results");
    }

    // 🔥 Ensure result keys are unique
    const keys = results.map(r => r.key);
    const uniqueKeys = new Set(keys);

    if (keys.length !== uniqueKeys.size) {
      throw new Error("Result keys must be unique");
    }

    // 🔥 Validate that each option maps to a valid result key
    questions.forEach((q, qi) => {
      if (!q.text) {
        throw new Error(`Question missing at index ${qi}`);
      }

      if (!Array.isArray(q.options) || q.options.length < 2) {
        throw new Error(`Question ${qi} must have at least 2 options`);
      }

      q.options.forEach((opt, oi) => {
        if (!opt.text) {
          throw new Error(`Option text missing at Q${qi} O${oi}`);
        }

        if (!opt.value) {
          throw new Error(`Option at Q${qi} O${oi} has no result mapping`);
        }

        if (!keys.includes(opt.value)) {
          throw new Error(
            `Option value "${opt.value}" not mapped to any result key`
          );
        }

        if (!opt.value) {
          throw new Error(`Option at Q${qi} O${oi} has no result mapping`);
        }
      });
    });

    // 🔥 Prevent duplicate slug
    const exists = await Quiz.findOne({ slug });
    if (exists) {
      throw new Error("Slug already exists");
    }

    const quiz = await Quiz.create(payload);

    return quiz;
  }

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

    if (!result) {
      return { key: topAnswer }
    }

    return {
      key: result.key,
      title: result.title,
      description: result.description,
      image: result.image
    }
  }

  /**
   * Save result + trigger analytics updates
   */
  static async submitResult({ quizId, answers }) {
    const quiz = await Quiz.findOne({ slug: quizId })

    if (!quiz) throw new Error("Quiz not found")

    const resolved = this.resolveResult(quiz, answers)

    await Result.create({
      quizId,
      answers,
      resultKey: resolved.key,
      resultTitle: resolved.title,
      resultDescription: resolved.description,
      resultImage: resolved.image
    })

    return resolved
  }

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
      .sort({ shares: -1 })
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