const express = require('express');
const router = express.Router();

const { registerUser, loginUser, getUserProfile, updateUserProfile, updateUserPassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { registerRules, loginRules, updateProfileRules, updatePasswordRules, validate } = require('../validators/authValidator');

// Public route: User registration
router.post('/register', registerRules, validate, registerUser);

// Public route: User login
router.post('/login', loginRules, validate, loginUser);

// Private route: Retrieve user profile
router.get('/profile', protect, getUserProfile);

// Private route: Update user profile details
router.put('/profile', protect, updateProfileRules, validate, updateUserProfile);

// Private route: Change user password
router.put('/password', protect, updatePasswordRules, validate, updateUserPassword);

module.exports = router;
