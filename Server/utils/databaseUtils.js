const mongo = require('mongodb');

const MongoClient = mongo.MongoClient;

const MONGO_URL = "mongodb+srv://aditya:CwRW3eWAewFvYRcN@mongotry.1jvor4b.mongodb.net/?retryWrites=true&w=majority&appName=MongoTry";

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(MONGO_URL)
    .then(client => {
      console.log("Connected to MongoDB"); // Log successful connection
      _db = client.db('ZCoder');
      console.log("Using database:", _db.databaseName); // Log the database name
      callback();
    })
    .catch(err => {
      console.error("Error while connecting to MongoDB:", err); // Log connection errors
    });
}

const getDB = () => {
  if (!_db) {
    throw new Error('Mongo not connected');
  }
  return _db;
}

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;