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
    // 1. Extract token
    const token = extractToken(req.headers.authorization);
    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'No token provided. Please log in.'
      });
    }

    // 2. Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (jwtError) {
      console.error('JWT Verification Error:', jwtError);
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          status: 'error',
          message: 'Token has expired. Please log in again.'
        });
      }
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token. Please log in again.'
      });
    }

    // 3. Check if user exists
    try {
      const userId = new ObjectId(decoded.id);
      const user = await User.findById(userId);
      
      if (!user) {
        return res.status(401).json({
          status: 'error',
          message: 'User no longer exists.'
        });
      }

      // 4. Attach user to request
      req.user = {
        _id: user._id,
        username: user.username,
        techStack: user.techStack || [],
        competitiveRating: user.competitiveRating || 0,
        favoriteLanguage: user.favoriteLanguage || ''
      };

      next();
    } catch (dbError) {
      console.error('Database Error:', dbError);
      return res.status(500).json({
        status: 'error',
        message: 'Error retrieving user information.'
      });
    }
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error during authentication.'
    });
  }
};
