const User = require('../models/User');
const { verifyToken } = require('../utils/jwt');

/**
 * Middleware to protect routes and verify JWT tokens.
 * Attaches the authenticated user to req.user (excluding password).
 */
const protect = async (req, res, next) => {
  let token;

  // Check for Token in the Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = verifyToken(token);

      // Get user from database (omit password) and attach to request object
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized, user not found'
        });
      }

      return next();
    } catch (error) {
      console.error('Authentication Error:', error.message);
      
      let message = 'Not authorized, token failed';
      if (error.name === 'TokenExpiredError') {
        message = 'Not authorized, token expired';
      } else if (error.name === 'JsonWebTokenError') {
        message = 'Not authorized, invalid token';
      }

      return res.status(401).json({
        success: false,
        message
      });
    }
  }

  // If no token was provided in header
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided'
    });
  }
};

module.exports = {
  protect
};
