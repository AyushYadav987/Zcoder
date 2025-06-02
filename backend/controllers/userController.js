// controllers/userController.js

const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const generateToken = (id) => {
  return jwt.sign({ id }, 'your_jwt_secret', { expiresIn: '30d' });
};

exports.signup = async (req, res) => {
  const { username, password } = req.body;
  try {
    const userExists = await User.findByUsername(username);

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User(username, password, techStack, competitiveRating, favoriteLanguage);
    await user.save();

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findByUsername(username);

    if (user && (await user.password === password)) {
      res.json({
        _id: user._id.toString(),
        username: user.username,
        token: generateToken(user._id.toString())
      });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
