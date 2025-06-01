// controllers/problemController.js

const Problem = require('../models/problemModel');
const Comment = require('../models/commentModel');

exports.addProblem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { question, answer, isPublic } = req.body;
    const problem = new Problem({
      userId,
      question,
      answer,
      isPublic: isPublic || false
    });
    await problem.save();
    res.status(201).json(problem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.Getproblem = async (req, res) => {
  try {
    // Fetch all problems belonging to the authenticated user
    const problem = await Problem.find({ userId: req.user.id });
    res.status(200).json(problem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getPublic = async (req, res) => {
  try {
    const questions = await Problem.find({ isPublic: true }).populate('comments');
    res.json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch public questions' });
  }
};





exports.getProblem = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id).populate('comments');
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }
    if (!problem.isPublic && problem.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }
    res.status(200).json(problem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProblem = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }
    if (problem.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }
    const { question, answer, isPublic } = req.body;
    problem.question = question || problem.question;
    problem.answer = answer || problem.answer;
    problem.isPublic = isPublic !== undefined ? isPublic : problem.isPublic;
    await problem.save();
    res.status(200).json(problem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProblem = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }
    if (problem.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }
    await problem.remove();
    res.status(200).json({ message: 'Problem deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addComment = async (req, res) => {
  try {
   const userId = req.user._id;
    const { text } = req.body;
    const problemId = req.params.id;

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }
    // if (!problem.isPublic && problem.userId.toString() !== req.user._id.toString()) {
    //   return res.status(403).json({ error: 'Access denied' });
    // }

    const comment = new Comment({
      userId,
      problemId,
      text
    });
    await comment.save();

    problem.comments.push(comment._id);
    await problem.save();

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getComments = async (req, res) => {
  try {
    const problemId = req.params.id;

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }
    if (!problem.isPublic && problem.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const comments = await Comment.find({ problemId });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
