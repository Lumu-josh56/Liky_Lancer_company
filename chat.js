document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendButton');

    // Fetch initial messages from the server
    const fetchMessages = async () => {
        try {
            const response = await fetch('http://localhost:5000/chat', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
            });

            if (response.ok) {
                const messages = await response.json();
                chatMessages.innerHTML = ''; // Clear existing messages

                // Append each message dynamically
                messages.forEach((message) => {
                    const messageDiv = document.createElement('div');
                    messageDiv.classList.add('message', message.sender === 'you' ? 'sent' : 'received');
                    messageDiv.innerHTML = `
                        <p><strong>${message.sender}</strong>: ${message.text}</p>
                    `;
                    chatMessages.appendChild(messageDiv);
                });

                // Scroll to the latest message
                chatMessages.scrollTop = chatMessages.scrollHeight;
            } else {
                alert('Failed to load messages.');
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
            alert('An error occurred. Please try again later.');
        }
    };

    // Send a new message
    sendButton.addEventListener('click', async () => {
        const messageText = chatInput.value.trim();

        if (!messageText) return;

        try {
            const response = await fetch('http://localhost:5000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
                body: JSON.stringify({ text: messageText }),
            });

            if (response.ok) {
                chatInput.value = ''; // Clear the input field
                fetchMessages(); // Refresh messages
            } else {
                alert('Failed to send message.');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            alert('An error occurred. Please try again later.');
        }
    });

    // Initialize the chat by fetching messages
    fetchMessages();
    
    // Periodically check for new messages (real-time experience)
    setInterval(fetchMessages, 5000);  // Check every 5 seconds
});
// backend
const express = require('express');
const jwt = require('jsonwebtoken');
const Message = require('./models/Message');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

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

// Fetch chat messages
app.get('/chat', authenticateToken, async (req, res) => {
    try {
        const messages = await Message.find({}).sort({ createdAt: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

// Send a new message
app.post('/chat', authenticateToken, async (req, res) => {
    const { text } = req.body;

    try {
        const newMessage = new Message({
            sender: req.user.username,
            text,
            createdAt: new Date(),
        });

        await newMessage.save();

        // Emit a real-time event to all connected clients
        io.emit('newMessage', newMessage);

        res.status(201).json({ message: 'Message sent' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send message' });
    }
});

// Socket.IO connection for real-time updates
io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Start the server
const PORT = 5000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// server js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: { type: String, required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Message', messageSchema);
