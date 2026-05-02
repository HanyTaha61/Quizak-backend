import Response from "../utils/response.js";

/**
 * 🧠 Quiz Validation Layer
 * Protects service layer from bad input
 */

class QuizValidator {
  /**
   * Validate quiz submission payload
   */
  static validateSubmitResult(req, res, next) {
    const {
      quizId,
      answers,
      score,
      resultData,
      timeSpent,
    } = req.body;

    const errors = [];

    // 🔐 required fields
    if (!quizId) errors.push("quizId is required");

    if (!Array.isArray(answers))
      errors.push("answers must be an array");

    if (score === undefined || score === null)
      errors.push("score is required");

    // 🔐 type safety checks
    if (typeof score !== "number")
      errors.push("score must be a number");

    if (timeSpent && typeof timeSpent !== "number")
      errors.push("timeSpent must be a number");

    // 🔐 result structure check (viral mapping dependency)
    if (!resultData || typeof resultData !== "object") {
      errors.push("resultData must be an object");
    } else {
      if (!resultData.title)
        errors.push("resultData.title is required");
    }

    if (errors.length > 0) {
      return Response.validation(res, errors);
    }

    next();
  }

  /**
   * Validate quiz creation (future-proofing)
   */
  static validateCreateQuiz(req, res, next) {
    const { title, slug, questions } = req.body;

    const errors = [];

    if (!title || title.trim().length < 3) {
      errors.push("title must be at least 3 characters");
    }

    if (!slug || typeof slug !== "string") {
      errors.push("slug is required and must be string");
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      errors.push("questions must be a non-empty array");
    }

    if (questions?.length > 0) {
      questions.forEach((q, i) => {
        if (!q.text) {
          errors.push(`question text missing at index ${i}`);
        }

        if (!Array.isArray(q.options) || q.options.length < 2) {
          errors.push(`options must be at least 2 at index ${i}`);
        }
      });
    }

    if (errors.length > 0) {
      return Response.validation(res, errors);
    }

    next();
  }
}

export default QuizValidator;