
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

const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

const io = socketIo(server, { transports: ['websocket', 'polling'] });

io.on('connection', client => {
    console.log("User connected")
    client.on('EXAMPLE', (data, data2) => {
        console.log(data, data2)
    });
    client.on('disconnect', () => { /* … */ });
});

console.log(" Sockets engaged ");


app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));

app.use('/leaderboard', leaderboardRoute);
app.use('/login', loginRoute); // Add this line
app.use('/register', registerRoute); // Add this line
