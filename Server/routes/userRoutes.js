// routes/userRoutes.js

const express = require('express');
const { signup, login, logout, verify } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', protect, logout);
router.get('/verify', verify);

module.exports = router;
