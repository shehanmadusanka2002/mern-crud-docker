/**
 * Standard success response format
 * @param {Object} res - Express response object
 * @param {*} data - Response data
 * @param {String} message - Success message
 * @param {Number} statusCode - HTTP status code (default: 200)
 */
const successResponse = (res, data = null, message = "Success", statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Standard error response format
 * @param {Object} res - Express response object
 * @param {String} message - Error message
 * @param {Number} statusCode - HTTP status code (default: 500)
 * @param {String} stack - Error stack trace (only in development)
 */
const errorResponse = (res, message = "Error", statusCode = 500, stack = null) => {
  const response = {
    success: false,
    message,
  };

  // Include stack trace only in development mode
  if (stack && process.env.NODE_ENV === "development") {
    response.stack = stack;
  }

  return res.status(statusCode).json(response);
};

module.exports = {
  successResponse,
  errorResponse,
};
