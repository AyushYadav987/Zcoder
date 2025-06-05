const express = require('express');
const router = express.Router();
const Contest = require('../models/Contest');
const fetchAllContests = require('../fetchContests');

// Get all contests (including manually added ones)
router.get('/all', async (req, res) => {
    try {
        // Delete old contests first
        await Contest.deleteOldContests();
        
        // Get remaining contests
        const contests = await Contest.findAll();
        res.json(contests);
    } catch (error) {
        console.error('Error fetching all contests:', error);
        res.status(500).json({ 
            status: 'error',
            message: 'Failed to fetch contests'
        });
    }
});

// Fetch and store contests from competitive programming sites
router.get('/fetch', async (req, res) => {
    try {
        // Fetch contests from all sources
        const newContests = await fetchAllContests();
        
        if (newContests.length > 0) {
            // Store new contests in database
            await Contest.addMany(newContests);
        }

        // Get all upcoming contests
        const allContests = await Contest.findUpcoming();
        
        // Sort by date
        const sortedContests = allContests.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        res.json(sortedContests);
    } catch (error) {
        console.error('Error fetching contests:', error);
        res.status(500).json({ 
            status: 'error',
            message: 'Failed to fetch contests from external sources'
        });
    }
});

// Add a new contest manually
router.post('/add', async (req, res) => {
    try {
        const { name, date, link } = req.body;
        
        // Validate input
        if (!name || !date || !link) {
            return res.status(400).json({
                status: 'error',
                message: 'Name, date, and link are required'
            });
        }

        const contest = new Contest(name, date, link);
        const result = await contest.save();
        
        res.status(201).json({
            status: 'success',
            data: { ...contest, _id: result.insertedId }
        });
    } catch (error) {
        console.error('Error adding contest:', error);
        res.status(500).json({ 
            status: 'error',
            message: 'Failed to add contest'
        });
    }
});

module.exports = router;