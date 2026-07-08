/**
 * Centralized error handling middleware.
 * Catches errors, normalizes them, and returns JSON responses.
 */
const errorHandler = (err, req, res, next) => {
  // If response headers have already been sent, delegate to Express default handler
  if (res.headersSent) {
    return next(err);
  }

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';

  // Mongoose validation error handling
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(val => val.message).join(', ');
  } 
  // Mongoose cast error handling (e.g. invalid ObjectId)
  else if (err.name === 'CastError') {
    statusCode = 400;
    message = `Resource not found or invalid ID format for: ${err.path}`;
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
};

module.exports = errorHandler;
