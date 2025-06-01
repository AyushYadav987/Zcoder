// index.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const profileRoutes = require('./routes/profileRoutes');
const problemRoutes = require('./routes/problemRoutes');
const cors = require('cors');
const fetchAllContests = require('./fetchContests');
const Contest = require('./models/Contest');

const app = express();
app.use(cors());

mongoose.connect('mongodb+srv://molik28:molik%402801@cluster0.hffl48d.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(error => {
  console.error('Error connecting to MongoDB:', error.message);
});

app.use(bodyParser.json());
app.use('/api/contests', require('./routes/contests'));
app.get('/api/contests/fetch', async (req, res) => {
  try {
      const contests = await fetchAllContests();
      res.json(contests);
  } catch (error) {
      res.status(500).json({ error: 'Failed to fetch contests' });
  }
});


// Define your routes
app.use('/users', userRoutes);
app.use('/profile', profileRoutes);
app.use('/problems', problemRoutes);
// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
