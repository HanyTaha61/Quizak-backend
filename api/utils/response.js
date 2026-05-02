class Response {
  /**
   * ✅ Success response wrapper
   */
  static success(res, data = null, message = "Success", statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  /**
   * ❌ Error response wrapper
   */
  static error(res, message = "Internal Server Error", statusCode = 500, errors = null) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
    });
  }

  /**
   * ⚠️ Validation error (clean frontend handling)
   */
  static validation(res, errors, message = "Validation Error") {
    return res.status(422).json({
      success: false,
      message,
      errors,
    });
  }

  /**
   * 🚫 Not found
   */
  static notFound(res, message = "Resource not found") {
    return res.status(404).json({
      success: false,
      message,
    });
  }

  /**
   * 🔐 Unauthorized
   */
  static unauthorized(res, message = "Unauthorized access") {
    return res.status(401).json({
      success: false,
      message,
    });
  }

  /**
   * ⛔ Forbidden
   */
  static forbidden(res, message = "Forbidden") {
    return res.status(403).json({
      success: false,
      message,
    });
  }
}

export default Response;