// models/problemModel.js

const { getDB } = require('../utils/databaseUtils');
const { ObjectId } = require('mongodb');

class Problem {
  constructor(userId, question, answer, isPublic = false) {
    this.userId = new ObjectId(userId);
    this.question = question;
    this.answer = answer;
    this.isPublic = isPublic;
    this.comments = [];
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  save() {
    const db = getDB();
    return db.collection('problems').insertOne(this);
  }

  static findById(id) {
    const db = getDB();
    return db.collection('problems').findOne({ _id: new ObjectId(id) });
  }

  static findByUserId(userId) {
    const db = getDB();
    return db.collection('problems')
      .find({ userId: new ObjectId(userId) })
      .toArray();
  }

  static findPublicProblems() {
    const db = getDB();
    return db.collection('problems')
      .find({ isPublic: true })
      .toArray();
  }

  static async updateById(id, updateData) {
    const db = getDB();
    updateData.updatedAt = new Date();
    return db.collection('problems').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
  }

  static deleteById(id) {
    const db = getDB();
    return db.collection('problems').deleteOne({ _id: new ObjectId(id) });
  }

  static addCommentToProblem(problemId, commentId) {
    const db = getDB();
    return db.collection('problems').updateOne(
      { _id: new ObjectId(problemId) },
      { $push: { comments: new ObjectId(commentId) } }
    );
  }
}

module.exports = Problem;
