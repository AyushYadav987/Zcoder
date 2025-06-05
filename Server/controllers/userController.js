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
      expiresIn: '30d',
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

    res.status(201).json({
      status: 'success',
      data: {
        _id: result.insertedId.toString(),
        username: user.username,
        token
      }
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

    res.json({
      status: 'success',
      data: {
        _id: user._id.toString(),
        username: user.username,
        token
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error during login'
    });
  }
};
