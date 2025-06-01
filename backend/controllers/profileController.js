// controllers/profileController.js

const User = require('../models/userModel');

exports.getProfile = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      username: user.username,
      techStack: user.techStack,
      competitiveRating: user.competitiveRating,
      favoriteLanguage: user.favoriteLanguage
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  const userId = req.user.id;
  const { techStack, competitiveRating, favoriteLanguage } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.techStack = techStack || user.techStack;
    user.competitiveRating = competitiveRating || user.competitiveRating;
    user.favoriteLanguage = favoriteLanguage || user.favoriteLanguage;

    const updatedUser = await user.save();

    res.json({
      username: updatedUser.username,
      techStack: updatedUser.techStack,
      competitiveRating: updatedUser.competitiveRating,
      favoriteLanguage: updatedUser.favoriteLanguage
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
