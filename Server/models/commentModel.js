const { getDB } = require('../utils/databaseUtils');
const { ObjectId } = require('mongodb');

class Comment {
  constructor(userId, problemId, text) {
    this.userId = new ObjectId(userId);
    this.problemId = new ObjectId(problemId);
    this.text = text;
    this.createdAt = new Date();
  }

  save() {
    const db = getDB();
    return db.collection('comments').insertOne(this);
  }

  static findById(id) {
    const db = getDB();
    return db.collection('comments').findOne({ _id: new ObjectId(id) });
  }

  static findByProblemId(problemId) {
    const db = getDB();
    return db.collection('comments')
      .find({ problemId: new ObjectId(problemId) })
      .toArray();
  }

  static deleteById(id) {
    const db = getDB();
    return db.collection('comments').deleteOne({ _id: new ObjectId(id) });
  }
}

module.exports = Comment;
