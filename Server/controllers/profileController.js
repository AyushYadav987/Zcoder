// controllers/profileController.js

const User = require('../models/userModel');
const { ObjectId } = require('mongodb');

exports.getProfile = async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      username: user.username,
      techStack: user.techStack,
      competitiveRating: user.competitiveRating,
      favoriteLanguage: user.favoriteLanguage,
      codeforcesUsername: user.codeforcesUsername
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  const userId = req.user._id;
  const { techStack, competitiveRating, favoriteLanguage, codeforcesUsername } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updateData = {
      ...(techStack && { techStack }),
      ...(competitiveRating && { competitiveRating }),
      ...(favoriteLanguage && { favoriteLanguage }),
      ...(codeforcesUsername !== undefined && { codeforcesUsername })
    };

    await User.updateById(userId, updateData);
    const updatedUser = await User.findById(userId);

    res.json({
      username: updatedUser.username,
      techStack: updatedUser.techStack,
      competitiveRating: updatedUser.competitiveRating,
      favoriteLanguage: updatedUser.favoriteLanguage,
      codeforcesUsername: updatedUser.codeforcesUsername
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
