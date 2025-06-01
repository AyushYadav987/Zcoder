// routes/problemRoutes.js

const express = require('express');
const {
  addProblem,
  Getproblem,
  getPublic,
  getProblem,
  updateProblem,
  deleteProblem,
  addComment,
  getComments
} = require('../controllers/problemController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, addProblem);
router.get('/', protect, Getproblem);
router.get('/public',getPublic);
router.get('/:id', protect, getProblem);
router.put('/:id', protect, updateProblem);
router.delete('/:id', protect, deleteProblem);
router.post('/:id/comments',protect, addComment);
router.get('/:id/comments', protect, getComments);

module.exports = router;
