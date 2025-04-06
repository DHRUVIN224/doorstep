const jwt = require('jsonwebtoken');
const loginModel = require('../models/loginModel');

module.exports = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const token = req.headers.authorization.split(' ')[1]; 
    if (!token) {
      return res.status(401).json({
        message: 'Authentication failed - No token provided',
        success: false,
        error: true
      });
    }

    // Verify token
    const decodedToken = jwt.verify(token, 'this_is_an_encrypt_key');
    req.userData = { 
      username: decodedToken.username,
      userId: decodedToken.userId
    };

    // Check if user exists and is admin
    const user = await loginModel.findById(decodedToken.userId);
    if (!user) {
      return res.status(401).json({
        message: 'User not found',
        success: false,
        error: true
      });
    }

    // Verify the user is an admin
    if (user.role !== 'admin') {
      return res.status(403).json({
        message: 'Access denied - Admin rights required',
        success: false,
        error: true
      });
    }

    // Admin authentication successful
    next();
    
  } catch (error) {
    console.error('Admin auth error:', error);
    return res.status(401).json({
      message: 'Authentication failed',
      success: false,
      error: true
    });
  }
}; 