const { body, validationResult } = require('express-validator');

/**
 * Validation rules for registration endpoint.
 */
const registerRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
];

/**
 * Validation rules for login endpoint.
 */
const loginRules = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

/**
 * Middleware to check validation rules results.
 * Returns the first validation error in the standardized JSON failure format.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Get the first validation error message
    const firstErrorMsg = errors.array()[0].msg;
    return res.status(400).json({
      success: false,
      message: firstErrorMsg
    });
  }
  next();
};

module.exports = {
  registerRules,
  loginRules,
  validate
};
