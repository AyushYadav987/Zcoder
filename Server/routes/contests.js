const express = require('express');
const router = express.Router();
const Contest = require('../models/Contest');

// Get all contests
router.get('/all', async (req, res) => {
    try {
        const contests = await Contest.find();
        res.json(contests);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Add a new contest
router.post('/add', async (req, res) => {
    const { name, date, link } = req.body;
    try {
        const newContest = new Contest({ name, date, link });
        await newContest.save();
        res.status(201).json(newContest);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;