const { getDB } = require('../utils/databaseUtils');

const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem' },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
