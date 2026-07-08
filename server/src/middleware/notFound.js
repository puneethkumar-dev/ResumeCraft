/**
 * Middleware to handle routes that are not found.
 * Creates a 404 error and forwards it to the centralized error handler.
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = notFound;
