// script.js
let roomId = null;
let socket = null;

document.getElementById("enter-chat").addEventListener("click", function() {
    const username = document.getElementById("username").value;
    if (!username) {
        alert("Please enter your name");
        return;
    }

    // Generate a unique room id or retrieve it from the URL
    roomId = Math.random().toString(36).substring(2, 9);

    // Display the chat section and hide the username section
    document.getElementById("username-section").style.display = "none";
    document.getElementById("chat-section").style.display = "block";

    // Set the room link
    const roomLink = window.location.href + "?room=" + roomId;
    document.getElementById("room-link").value = roomLink;

    // Initialize the chat
    initChat(username);
});

function initChat(username) {
    // Establish connection to the server using Socket.IO
    socket = io();

    // Join the room
    socket.emit('joinRoom', roomId);

    // Listen for incoming messages
    socket.on('message', (message) => {
        displayMessage(message, false);
    });

    // Send message when the button is clicked
    document.getElementById("send-message").addEventListener("click", function() {
        sendMessage(username);
    });

    // Send message when 'Enter' key is pressed
    document.getElementById("message").addEventListener("keypress", function(event) {
        if (event.key === 'Enter') {
            sendMessage(username);
        }
    });
}

function sendMessage(username) {
    const message = document.getElementById("message").value;
    if (message) {
        // Send message to the server
        socket.emit('chatMessage', { room: roomId, username, message });
        displayMessage(`${username}: ${message}`, true);
        document.getElementById("message").value = "";
    }
}

function displayMessage(message, isOwnMessage) {
    const chatBox = document.getElementById("chat-box");
    const messageElement = document.createElement("p");

    // Add appropriate class for styling
    if (isOwnMessage) {
        messageElement.classList.add("user-message");
    } else {
        messageElement.classList.add("received-message");
    }

    messageElement.textContent = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Check if there's a room in the URL
const urlParams = new URLSearchParams(window.location.search);
const room = urlParams.get("room");
if (room) {
    roomId = room;
    document.getElementById("username-section").style.display = "none";
    document.getElementById("chat-section").style.display = "block";
    document.getElementById("room-link").value = window.location.href;

    const username = prompt("Enter your name:");
    if (username) {
        initChat(username);
    }
}


//copy button//



document.getElementById("copy-link").addEventListener("click", function() {
    // Get the room link from the input field
    const roomLink = document.getElementById("room-link");

    // Select the room link text
    roomLink.select();
    roomLink.setSelectionRange(0, 99999); // For mobile devices

    // Copy the text inside the input field
    document.execCommand("copy");

    // Provide feedback (you can modify this to show in UI instead of alert)
    alert("Room link copied to clipboard!");
});
