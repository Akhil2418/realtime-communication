const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Handle socket connections
io.on('connection', (socket) => {
    console.log('A user connected');

    // User joins a room
    socket.on('joinRoom', (room) => {
        socket.join(room);
        io.to(room).emit('message', 'A new user has joined the chat');
    });

    // Broadcast message to the room
    socket.on('chatMessage', (data) => {
        io.to(data.room).emit('message', `${data.username}: ${data.message}`);
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


function displayMessage(message, isOwnMessage) {
    const chatBox = document.getElementById("chat-box");
    const messageElement = document.createElement("div"); // Change to div for better styling

    // Add appropriate class for styling
    if (isOwnMessage) {
        messageElement.classList.add("user-message"); // Right side 
    } else {
        messageElement.classList.add("received-message"); // Left side 
    }

    messageElement.textContent = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}




