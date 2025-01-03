document.addEventListener('DOMContentLoaded', async () => {
    const usernameElement = document.getElementById('username');
    const emailElement = document.getElementById('email');
    const joinedDateElement = document.getElementById('joinedDate');
    const logoutButton = document.getElementById('logoutButton');

    // Fetch user data from the backend
    try {
        const response = await fetch('http://localhost:5000/profile', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Assuming token is stored in localStorage
            },
        });

        if (response.ok) {
            const userData = await response.json();

            // Populate the profile details
            usernameElement.textContent = userData.username;
            emailElement.textContent = userData.email;
            joinedDateElement.textContent = new Date(userData.joinedDate).toLocaleDateString();
        } else {
            alert('Failed to fetch profile details. Please log in again.');
            window.location.href = '/login.html';
        }
    } catch (error) {
        console.error('Error fetching profile:', error);
        alert('An error occurred. Please try again.');
    }

    // Logout functionality
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('authToken');
        window.location.href = '/login.html';
    });
});

// backend javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('./models/User'); // Assuming user model is in models/User

const app = express();

// Middleware to verify token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Token missing' });

    jwt.verify(token, 'your_secret_key', (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
};

// Profile endpoint
app.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            username: user.username,
            email: user.email,
            joinedDate: user.createdAt,
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
