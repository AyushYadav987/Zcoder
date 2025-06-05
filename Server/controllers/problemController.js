// controllers/problemController.js

const Problem = require('../models/problemModel');
const Comment = require('../models/commentModel');
const { ObjectId } = require('mongodb');

exports.addProblem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { question, answer, isPublic } = req.body;
    const problem = new Problem(userId, question, answer, isPublic);
    const result = await problem.save();
    res.status(201).json({ ...problem, _id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.Getproblem = async (req, res) => {
  try {
    // Fetch all problems belonging to the authenticated user
    const problems = await Problem.findByUserId(req.user._id);
    res.status(200).json(problems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getPublic = async (req, res) => {
  try {
    const questions = await Problem.findPublicProblems();
    // Get comments for each problem
    const questionsWithComments = await Promise.all(
      questions.map(async (question) => {
        const comments = await Comment.findByProblemId(question._id);
        return { ...question, comments };
      })
    );
    res.json(questionsWithComments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch public questions' });
  }
};

exports.getProblem = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }
    if (!problem.isPublic && problem.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }
    // Get comments for the problem
    const comments = await Comment.findByProblemId(problem._id);
    res.status(200).json({ ...problem, comments });
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
    const updateData = {
      ...(question && { question }),
      ...(answer && { answer }),
      ...(isPublic !== undefined && { isPublic })
    };
    await Problem.updateById(req.params.id, updateData);
    const updatedProblem = await Problem.findById(req.params.id);
    res.status(200).json(updatedProblem);
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
    await Problem.deleteById(req.params.id);
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

    const comment = new Comment(userId, problemId, text);
    const result = await comment.save();
    
    await Problem.addCommentToProblem(problemId, result.insertedId);

    res.status(201).json({ ...comment, _id: result.insertedId });
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

    const comments = await Comment.findByProblemId(problemId);
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
