/**
 * 🧠 Async Handler Wrapper
 * Eliminates repetitive try/catch in controllers
 */

const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default asyncHandler;