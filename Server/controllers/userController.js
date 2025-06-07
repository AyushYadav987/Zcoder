// controllers/userController.js

const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { ObjectId } = require('mongodb');

const JWT_SECRET = 'your_jwt_secret'; // TODO: Move this to environment variables

const generateToken = (id) => {
  try {
    // Ensure id is a string
    const idString = id instanceof ObjectId ? id.toString() : String(id);
    return jwt.sign({ id: idString }, JWT_SECRET, { 
      expiresIn: '24h',
      algorithm: 'HS256' // Explicitly specify the algorithm
    });
  } catch (error) {
    console.error('Token Generation Error:', error);
    throw new Error('Error generating authentication token');
  }
};

exports.signup = async (req, res) => {
  try {
    const { username, password, techStack = [], competitiveRating = 0, favoriteLanguage = '' } = req.body;

    // Validate required fields
    if (!username || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Username and password are required'
      });
    }

    const userExists = await User.findByUsername(username);
    if (userExists) {
      return res.status(400).json({
        status: 'error',
        message: 'Username already exists'
      });
    }

    const user = new User(username, password, techStack, competitiveRating, favoriteLanguage);
    const result = await user.save();

    if (!result.insertedId) {
      return res.status(400).json({
        status: 'error',
        message: 'Failed to create user'
      });
    }

    const token = generateToken(result.insertedId);

    // Initialize session
    req.session.user = {
      _id: result.insertedId.toString(),
      username: user.username
    };
    req.session.isAuthenticated = true;

    // Save session before sending response
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return res.status(500).json({
          status: 'error',
          message: 'Error creating session'
        });
      }

      res.status(201).json({
        status: 'success',
        data: {
          _id: result.insertedId.toString(),
          username: user.username,
          token
        }
      });
    });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error creating user account'
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate required fields
    if (!username || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Username and password are required'
      });
    }

    const user = await User.findByUsername(username);
    if (!user || user.password !== password) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid username or password'
      });
    }

    const token = generateToken(user._id);

    // Initialize session
    req.session.user = {
      _id: user._id.toString(),
      username: user.username
    };
    req.session.isAuthenticated = true;

    // Save session before sending response
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return res.status(500).json({
          status: 'error',
          message: 'Error creating session'
        });
      }

      res.json({
        status: 'success',
        data: {
          _id: user._id.toString(),
          username: user.username,
          token
        }
      });
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error during login'
    });
  }
};

exports.logout = async (req, res) => {
  try {
    // Destroy the session
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destruction error:', err);
        return res.status(500).json({
          status: 'error',
          message: 'Error during logout'
        });
      }
      
      // Clear the session cookie
      res.clearCookie('sessionId');
      
      res.json({
        status: 'success',
        message: 'Logged out successfully'
      });
    });
  } catch (error) {
    console.error('Logout Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error during logout'
    });
  }
};

exports.verify = async (req, res) => {
  try {
    if (!req.session || !req.session.user || !req.session.isAuthenticated) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authenticated'
      });
    }

    const user = await User.findById(new ObjectId(req.session.user._id));
    if (!user) {
      req.session.destroy();
      return res.status(401).json({
        status: 'error',
        message: 'User no longer exists'
      });
    }

    res.json({
      status: 'success',
      data: {
        user: {
          _id: user._id.toString(),
          username: user.username
        }
      }
    });
  } catch (error) {
    console.error('Verify Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error verifying authentication'
    });
  }
};
