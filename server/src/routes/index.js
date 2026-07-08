const express = require('express');
const router = express.Router();

/**
 * @route   GET /
 * @desc    API Root Health Check
 * @access  Public
 */
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'ResumeCraft API Running'
  });
});

module.exports = router;
