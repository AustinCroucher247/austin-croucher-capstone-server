const express = require('express');
const app = express();
require('dotenv').config();
const leaderboardRoute = require('./Routes/leaderboards.js');
const loginRoute = require('./Routes/login');
const registerRoute = require('./Routes/register');
const PORT = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');


const rooms = {};

const messages = {};

const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

const io = socketIo(server, { transports: ['websocket', 'polling'] });

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    io.emit('updateRooms', rooms);

    socket.on('createRoom', (callback) => {
        const roomId = socket.id;
        rooms[roomId] = { host: socket.id, players: [socket.id] };
        socket.join(roomId);
        io.emit('updateRooms', rooms);
        console.log(`Room ${roomId} created`);

        callback(roomId);
    });


    socket.on('requestChatHistory', (roomId) => {
        if (messages[roomId]) {
            socket.emit('chatHistory', messages[roomId]);
        }
    });


    socket.on('closeRoom', (roomId) => {
        delete rooms[roomId];
        io.emit('updateRooms', rooms);
    });

    socket.on('joinRoom', (roomId) => {
        if (rooms[roomId]) {
            rooms[roomId].players.push(socket.id);
            socket.join(roomId);
            io.emit('updateRooms', rooms);
            console.log(`User ${socket.id} joined room ${roomId}`);
        }
    });
    socket.on('message', (message) => {
        io.to(message.roomId).emit('chatMessage', message);
    });
    socket.on('leaveRoom', (roomId) => {
        if (rooms[roomId]) {
            rooms[roomId].players = rooms[roomId].players.filter((id) => id !== socket.id);
            if (rooms[roomId].players.length === 0) {
                delete rooms[roomId];
            }
            socket.leave(roomId);
            io.emit('updateRooms', rooms);
            console.log(`User ${socket.id} left room ${roomId}`);
        }
    });

    socket.on('chatMessage', ({ roomId, message }) => {
        const timestamp = new Date().getTime();
        if (!messages[roomId]) {
            messages[roomId] = [];
        }
        messages[roomId].push({
            user: socket.id,
            message,
            timestamp,
        });
        io.to(roomId).emit('chatMessage', { user: socket.id, message, timestamp });
    });


    socket.on('updateGameState', (data) => {
        if (rooms[socket.id]) {
            rooms[socket.id].players.forEach((playerId) => {
                io.to(playerId).emit('updateGameState', data);
            });
        }
        else {
            console.log(socket.id);
            console.log(rooms)
        }
    });

    socket.on('disconnect', () => {
        for (const roomId in rooms) {
            if (rooms[roomId].players.includes(socket.id)) {
                socket.emit('leaveRoom', roomId);
                rooms[roomId].players = rooms[roomId].players.filter((id) => id !== socket.id);
                if (rooms[roomId].players.length === 0) {
                    delete rooms[roomId];
                }
                io.to(roomId).emit('updateRooms', rooms);
                console.log(`User ${socket.id} left room ${roomId}`);
            }
        }
    });



    socket.on('disconnect', () => {
        for (const roomId in rooms) {
            if (rooms[roomId].players.includes(socket.id)) {
                socket.emit('leaveRoom', roomId);
            }
        }
    });
});



app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));

app.use('/leaderboard', leaderboardRoute);
app.use('/login', loginRoute);
app.use('/register', registerRoute);
