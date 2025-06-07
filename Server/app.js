const { mongoConnect } = require('./utils/databaseUtils');
const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const profileRoutes = require('./routes/profileRoutes');
const problemRoutes = require('./routes/problemRoutes');
const postRoutes = require('./routes/postRoutes');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MongoDBStore = require('connect-mongodb-session')(session);
const fetchAllContests = require('./fetchContests');
const Contest = require('./models/Contest');

const app = express();


const store = new MongoDBStore({
  uri: "mongodb+srv://aditya:CwRW3eWAewFvYRcN@mongotry.1jvor4b.mongodb.net/ZCoder?retryWrites=true&w=majority&appName=MongoTry",
  collection: 'sessions'
});

store.on('error', function(error) {
  console.error('Session Store Error:', error);
});

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));

app.use(cookieParser());
app.use(bodyParser.json());


app.use(session({
  secret: 'your_session_secret',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24*30, 
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  },
  store: store,
  resave: false,
  saveUninitialized: false,
  name: 'sessionId' 
}));

app.use('/api/contests', require('./routes/contests'));
app.get('/api/contests/fetch', async (req, res) => {
  try {
      const contests = await fetchAllContests();
      res.json(contests);
  } catch (error) {
      res.status(500).json({ error: 'Failed to fetch contests' });
  }
});


app.use('/users', userRoutes);
app.use('/profile', profileRoutes);
app.use('/problems', problemRoutes);
app.use('/posts', postRoutes);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
mongoConnect(() => {
  console.log("Mongo Started Successfully");
  app.listen(PORT, () => {
    console.log(`Server running on address http://localhost:${PORT}`);
  });
});
