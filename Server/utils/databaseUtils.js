const mongo = require('mongodb');
const session = require('express-session');
const MongoClient = mongo.MongoClient;
const MongoDBStore = require('connect-mongodb-session')(session);

const MONGO_URL = "mongodb+srv://aditya:CwRW3eWAewFvYRcN@mongotry.1jvor4b.mongodb.net/?retryWrites=true&w=majority&appName=MongoTry";

let _db;

// Create MongoDB session store
const store = new MongoDBStore({
  uri: MONGO_URL,
  databaseName: 'ZCoder',
  collection: 'sessions',
  expires: 1000 * 60 * 60 * 24, // 1 day
  connectionOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
});

store.on('error', function(error) {
  console.error('Session Store Error:', error);
});

const mongoConnect = (callback) => {
  MongoClient.connect(MONGO_URL)
    .then(client => {
      console.log("Connected to MongoDB");
      _db = client.db('ZCoder');
      console.log("Using database:", _db.databaseName);
      callback();
    })
    .catch(err => {
      console.error("Error while connecting to MongoDB:", err);
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
exports.store = store;