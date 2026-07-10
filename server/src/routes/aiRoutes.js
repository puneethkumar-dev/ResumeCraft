const express = require('express');
const router = express.Router();
const { generateAIResume, analyzeAIResume, atsAnalyzeResume } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');
const { validate } = require('../validators/resumeValidator');
const { body } = require('express-validator');

const rateLimit = require('express-rate-limit');

// AI requests rate limiter: 5 requests per minute per authenticated user (or IP)
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'Too many AI generation attempts, please try again after 1 minute'
  },
  keyGenerator: (req) => {
    return req.user._id.toString();
  },
  standardHeaders: true,
  legacyHeaders: false,
  validate: { default: false }
});

// Validation rules for generating resume content
const generateRules = [
  body('resumeId')
    .isMongoId()
    .withMessage('Invalid resume ID format')
];

// Validation rules for ATS analysis
const atsRules = [
  body('resumeId')
    .isMongoId()
    .withMessage('Invalid resume ID format'),
  body('jobDescription')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Job description is required')
];

// POST /api/ai/generate - protected, rate limited, and validated
router.post('/generate', protect, aiLimiter, generateRules, validate, generateAIResume);

// POST /api/ai/analyze - protected, rate limited, and validated
router.post('/analyze', protect, aiLimiter, generateRules, validate, analyzeAIResume);

// POST /api/ai/ats-analyze - protected, rate limited, and validated
router.post('/ats-analyze', protect, aiLimiter, atsRules, validate, atsAnalyzeResume);

module.exports = router;
