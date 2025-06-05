// models/problemModel.js

const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  isPublic: { type: Boolean, default: false },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
}, {
  timestamps: true // Automatically add createdAt and updatedAt fields
});

const Problem = mongoose.model('Problem', problemSchema);

module.exports = Problem;
