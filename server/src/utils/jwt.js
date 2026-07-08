const jwt = require('jsonwebtoken');

/**
 * Generates a JSON Web Token for the user.
 * @param {string} userId - The user's ID.
 * @returns {string} The signed JWT.
 */
const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured in environment variables.');
  }

  return jwt.sign({ id: userId }, secret, {
    expiresIn: '7d'
  });
};

/**
 * Verifies a JSON Web Token.
 * @param {string} token - The JWT token to verify.
 * @returns {object} The decoded token payload.
 */
const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured in environment variables.');
  }

  return jwt.verify(token, secret);
};

module.exports = {
  generateToken,
  verifyToken
};
