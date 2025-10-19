const { errorResponse } = require("../utils/response.util");

// Handle 404 - Not Found
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Global Error Handler
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  return errorResponse(
    res,
    err.message || "Internal Server Error",
    statusCode,
    process.env.NODE_ENV === "development" ? err.stack : undefined
  );
};

module.exports = {
  notFound,
  errorHandler,
};
