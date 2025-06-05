const { mongoConnect } = require('./utils/databaseUtils');
const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const profileRoutes = require('./routes/profileRoutes');
const problemRoutes = require('./routes/problemRoutes');
const cors = require('cors');
const fetchAllContests = require('./fetchContests');
const Contest = require('./models/Contest');

const app = express();
app.use(cors());

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
mongoConnect(() => {
  console.log("Mongo Started Successfully");
  app.listen(PORT, () => {
    console.log(`Server running on address http://localhost:${PORT}`);
  });
})
