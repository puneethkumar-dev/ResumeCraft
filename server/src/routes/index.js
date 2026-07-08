const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');

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

// Mount Auth router
router.use('/auth', authRoutes);

module.exports = router;
