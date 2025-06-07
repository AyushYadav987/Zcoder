const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getAllPosts,
  createPost,
  getPost,
  updatePost,
  deletePost,
  likePost,
  addComment,
  hasUserLiked
} = require('../controllers/postController');

// Public routes
router.get('/', getAllPosts);
router.get('/:id', getPost);

// Protected routes
router.post('/', protect, createPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);
router.post('/:id/like', protect, likePost);
router.get('/:id/hasLiked', protect, hasUserLiked);
router.post('/:id/comments', protect, addComment);

module.exports = router; 