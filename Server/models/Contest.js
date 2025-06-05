const { getDB } = require('../utils/databaseUtils');
const { ObjectId } = require('mongodb');

class Contest {
  constructor(name, date, link) {
    this.name = name;
    this.date = new Date(date);
    this.link = link;
    this.createdAt = new Date();
  }

  save() {
    const db = getDB();
    return db.collection('contests').insertOne(this);
  }

  static findById(id) {
    const db = getDB();
    return db.collection('contests').findOne({ _id: new ObjectId(id) });
  }

  static findAll() {
    const db = getDB();
    return db.collection('contests')
      .find()
      .sort({ date: 1 })
      .toArray();
  }

  static findUpcoming() {
    const db = getDB();
    const now = new Date();
    return db.collection('contests')
      .find({ date: { $gte: now } })
      .sort({ date: 1 })
      .toArray();
  }

  static async addMany(contests) {
    const db = getDB();
    const contestsWithTimestamp = contests.map(contest => ({
      ...contest,
      createdAt: new Date()
    }));
    return db.collection('contests').insertMany(contestsWithTimestamp);
  }

  static async deleteOldContests() {
    const db = getDB();
    const now = new Date();
    return db.collection('contests').deleteMany({
      date: { $lt: now }
    });
  }
}

module.exports = Contest;