const { NODE_ENV } = require('../config/env');

// Handle 404 - Route not found
const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Global error handler
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    message: err.message,
    stack: NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };
