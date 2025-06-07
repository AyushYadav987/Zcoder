// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { ObjectId } = require('mongodb');

const JWT_SECRET = 'your_jwt_secret'; // TODO: Move this to environment variables

const extractToken = (authHeader) => {
  if (!authHeader) return null;
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  return parts[1];
};

exports.protect = async (req, res, next) => {
  try {
    // First check if user is authenticated via session
    if (req.session && req.session.user && req.session.isAuthenticated) {
      // Verify that the user still exists in the database
      const user = await User.findById(new ObjectId(req.session.user._id));
      if (!user) {
        req.session.destroy();
        return res.status(401).json({
          status: 'error',
          message: 'User no longer exists.'
        });
      }
      req.user = user;
      return next();
    }

    // If no session, try JWT authentication
    const token = extractToken(req.headers.authorization);
    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required. Please log in.'
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (jwtError) {
      console.error('JWT Verification Error:', jwtError);
      return res.status(401).json({
        status: 'error',
        message: 'Invalid or expired token. Please log in again.'
      });
    }

    // Check if user exists
    const user = await User.findById(new ObjectId(decoded.id));
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'User no longer exists.'
      });
    }

    // Create session if authenticated via JWT
    req.session.user = {
      _id: user._id.toString(),
      username: user.username
    };
    req.session.isAuthenticated = true;
    
    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error during authentication.'
    });
  }
};
