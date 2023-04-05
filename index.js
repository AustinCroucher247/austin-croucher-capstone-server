
const express = require('express');
const app = express();
require('dotenv').config();
const leaderboardRoute = require('./Routes/leaderboards.js');
const loginRoute = require('./Routes/login'); // Add this line
const registerRoute = require('./Routes/register'); // Add this line
const PORT = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');


const rooms = {};


const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

const io = socketIo(server, { transports: ['websocket', 'polling'] });



io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('createRoom', () => {
        const roomId = socket.id;
        rooms[roomId] = { host: socket.id, players: [socket.id] };
        socket.join(roomId);
        io.emit('updateRooms', rooms);
        console.log(`Room ${roomId} created`);
    });

    socket.on('closeRoom', (roomId) => {
        // Add logic to remove the room from the list of active rooms
        delete rooms[roomId];
        io.emit('updateRooms', rooms); // Update the list of active rooms for all connected clients
    });
    socket.on('joinRoom', (roomId) => {
        if (rooms[roomId]) {
            rooms[roomId].players.push(socket.id);
            socket.join(roomId);
            io.emit('updateRooms', rooms);
            console.log(`User ${socket.id} joined room ${roomId}`);
        }
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

    socket.on('disconnect', () => {
        for (const roomId in rooms) {
            if (rooms[roomId].players.includes(socket.id)) {
                socket.emit('leaveRoom', roomId);
            }
        }
    });
});





// io.on('connection', client => {
//     console.log("User connected")
//     client.on('EXAMPLE', (data, data2) => {
//         console.log(data, data2)
//     });
//     client.on('disconnect', () => { /* … */ });
// });

// console.log(" Sockets engaged ");


app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));

app.use('/leaderboard', leaderboardRoute);
app.use('/login', loginRoute); // Add this line
app.use('/register', registerRoute); // Add this line
