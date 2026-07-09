const express = require('express');
const router = express.Router();

const { registerUser, loginUser, getUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { registerRules, loginRules, validate } = require('../validators/authValidator');

// Public route: User registration
router.post('/register', registerRules, validate, registerUser);

// Public route: User login
router.post('/login', loginRules, validate, loginUser);

// Private route: Retrieve user profile
router.get('/profile', protect, getUserProfile);

module.exports = router;
