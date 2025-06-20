const User = require('../models/User');
const { verifyToken } = require('../utils/utility.function');

const sendResponseError = (statusCode, msg, res) => {
  return res.status(statusCode || 400).json({ 
    status: 'error',
    message: msg || 'Invalid input'
  });
};

const verifyUser = async (req, res, next) => {
  const { authorization } = req.headers;
  
  // Check authorization header exists
  if (!authorization) {
    return sendResponseError(401, 'Authorization header is required', res);
  }

  // Check Bearer token format
  if (!authorization.startsWith('Bearer ')) {
    return sendResponseError(401, 'Invalid authorization format', res);
  }

  const token = authorization.split(' ')[1];
  
  try {
    // Verify token
    const payload = await verifyToken(token);
    if (!payload?.id) {
      return sendResponseError(401, 'Invalid token payload', res);
    }

    // Find user and attach to request
    const user = await User.findById(payload.id).select('-password');
    if (!user) {
      return sendResponseError(401, 'User not found', res);
    }

    req.user = user;
    return next();

  } catch (err) {
    console.error('Authentication Error:', err.message);
    
    if (err.name === 'TokenExpiredError') {
      return sendResponseError(401, 'Token expired', res);
    }
    if (err.name === 'JsonWebTokenError') {
      return sendResponseError(401, 'Invalid token', res);
    }
    
    return sendResponseError(500, 'Authentication failed', res);
  }
};

module.exports = {
  sendResponseError,
  verifyUser,
};