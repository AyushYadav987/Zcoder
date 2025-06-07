const { getDB } = require('../utils/databaseUtils');
const bcrypt = require('bcryptjs');
const { ObjectId } = require('mongodb');

module.exports = class User {
  constructor(username, password, techStack = [], competitiveRating = 0, favoriteLanguage = '', codeforcesUsername = '') {
    this.username = username;
    this.password = password;
    this.techStack = techStack;
    this.competitiveRating = competitiveRating;
    this.favoriteLanguage = favoriteLanguage;
    this.codeforcesUsername = codeforcesUsername;
  }

  save() {
    const db = getDB();
    return db.collection('users').insertOne(this);
  }

  static findByUsername(username) {
    const db = getDB();
    return db.collection('users').findOne({ username: username });
  }

  static findById(id) {
    const db = getDB();
    return db.collection('users').findOne({ _id: new ObjectId(id) });
  }

  static updateById(id, updateData) {
    const db = getDB();
    return db.collection('users').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
  }

  static deleteById(id) {
    const db = getDB();
    return db.collection('users').deleteOne({ _id: new ObjectId(id) });
  }

  static async updateCodeforcesUsername(id, codeforcesUsername) {
    const db = getDB();
    try {
      const result = await db.collection('users').updateOne(
        { _id: new ObjectId(id) },
        { $set: { codeforcesUsername } }
      );
      return result.modifiedCount === 1;
    } catch (error) {
      console.error('Error updating Codeforces username:', error);
      return false;
    }
  }
}
