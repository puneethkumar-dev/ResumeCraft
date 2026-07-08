const express = require('express');
const router = express.Router();
const { generateAIResume } = require('../controllers/aiController');
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

// POST /api/ai/generate - protected, rate limited, and validated
router.post('/generate', protect, aiLimiter, generateRules, validate, generateAIResume);

module.exports = router;
