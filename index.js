const express = require('express');
const app = express();
require('dotenv').config();
const leaderboardRoute = require('./Routes/leaderboards.js');
const loginRoute = require('./Routes/login'); // Add this line
const registerRoute = require('./Routes/register'); // Add this line
const PORT = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;

app.use(express.json());

const cors = require('cors');
app.use(cors({ origin: CLIENT_URL }));

app.use('/leaderboard', leaderboardRoute);
app.use('/login', loginRoute); // Add this line
app.use('/register', registerRoute); // Add this line



app.listen(PORT, () => {
    console.log(`🚀 Server listening on ${PORT}`);
});