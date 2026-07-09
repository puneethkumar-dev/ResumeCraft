const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const resumeRoutes = require('./resumeRoutes');
const aiRoutes = require('./aiRoutes');

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

// Mount Resume router
router.use('/resumes', resumeRoutes);

// Mount AI router
router.use('/ai', aiRoutes);

module.exports = router;
