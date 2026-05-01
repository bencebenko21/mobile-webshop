const express = require('express');
const { authenticateToken } = require('../middlewares/authMiddleware');
const router = express.Router();
const userService = require('../services/userService');

router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password, phoneNumber, zipCode, city, streetName, floorFlat } = req.body;
        const newUser = await userService.registerUser(firstName, lastName, email, password, phoneNumber, zipCode, city, streetName, floorFlat);
        res.status(201).json(newUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Registration failed' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await userService.loginUser(email, password);
        res.status(200).json({ message: 'Login successful', user, token });
    } catch (err) {
        console.error(err);
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

router.get('/me', authenticateToken, (req, res) => {
    res.status(200).json({ message: 'Token valid', user: req.user });
});

module.exports = router;