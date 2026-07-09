const { body, param, validationResult } = require('express-validator');

/**
 * Validation rules for creating/updating a resume.
 */
const resumeRules = [
  body('personalInfo.fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required'),
  body('personalInfo.email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('education')
    .isArray({ min: 1 })
    .withMessage('At least one education entry is required')
];

/**
 * Validation rules for route parameters containing an ID (e.g. resumeId).
 */
const idParamRules = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format')
];

/**
 * Middleware to check validation rules results.
 * Returns the first validation error in the standardized JSON failure format.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstErrorMsg = errors.array()[0].msg;
    return res.status(400).json({
      success: false,
      message: firstErrorMsg
    });
  }
  next();
};

module.exports = {
  resumeRules,
  idParamRules,
  validate
};
