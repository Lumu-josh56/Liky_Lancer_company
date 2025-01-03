document.addEventListener('DOMContentLoaded', () => {
    const notificationsList = document.getElementById('notificationsList');

    // Fetch notifications for the user
    const fetchNotifications = async () => {
        try {
            const response = await fetch('http://localhost:5000/notifications', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Token for authentication
                },
            });

            if (response.ok) {
                const notifications = await response.json();
                notificationsList.innerHTML = ''; // Clear existing notifications

                // Append each notification dynamically
                notifications.forEach((notification) => {
                    const notificationDiv = document.createElement('div');
                    notificationDiv.classList.add('notification-item');
                    notificationDiv.innerHTML = `
                        <div class="notification-title">${notification.title}</div>
                        <div class="notification-description">${notification.description}</div>
                        <div class="notification-time">${new Date(notification.timestamp).toLocaleString()}</div>
                    `;
                    notificationsList.appendChild(notificationDiv);
                });
            } else {
                alert('Failed to load notifications.');
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
            alert('An error occurred. Please try again later.');
        }
    };

    // Initialize the notifications by fetching them
    fetchNotifications();
});

// backend
const express = require('express');
const jwt = require('jsonwebtoken');
const Notification = require('./models/Notification'); // Notification model
const app = express();

// Middleware to authenticate token
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

// Fetch notifications for the logged-in user
app.get('/notifications', authenticateToken, async (req, res) => {
    try {
        // You could filter notifications based on user preferences, etc.
        const notifications = await Notification.find({}).sort({ timestamp: -1 });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// server part
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Notification', notificationSchema);

// news &message example
const createNotification = async () => {
    const newNotification = new Notification({
        title: "New Feature Released!",
        description: "We have added new functionalities to enhance your experience. Check them out now!",
    });

    await newNotification.save();
    console.log("Notification created!");
};
