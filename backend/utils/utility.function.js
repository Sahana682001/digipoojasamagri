const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT } = require('../config/config');

// Password verification
const checkPassword = async (password, passwordHash) => {
  try {
    return await bcrypt.compare(password, passwordHash);
  } catch (err) {
    console.error('Password check error:', err);
    throw new Error('Password comparison failed');
  }
};

// Token generation
const newToken = (user) => {
  if (!user?._id) {
    throw new Error('User ID is required for token generation');
  }
  
  return jwt.sign(
    {
      id: user._id.toString(), // Ensure _id is string
      email: user.email        // Add additional claims if needed
    }, 
    JWT.jwt, 
    {
      expiresIn: JWT.jwtExp,
      algorithm: 'HS256'       // Explicitly specify algorithm
    }
  );
};

// Token verification
const verifyToken = async (token) => {
  if (!token) {
    throw new Error('No token provided');
  }

  try {
    return await jwt.verify(token, JWT.jwt, { algorithms: ['HS256'] });
  } catch (err) {
    console.error('Token verification error:', err.message);
    
    // Specific error messages
    if (err.name === 'JsonWebTokenError') {
      throw new Error('Invalid token format');
    }
    if (err.name === 'TokenExpiredError') {
      throw new Error('Token expired');
    }
    
    throw new Error('Token verification failed');
  }
};

module.exports = { checkPassword, newToken, verifyToken };