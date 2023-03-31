const express = require('express');
const app = express();
require('dotenv').config();
const leaderboardRoute = require('./Routes/leaderboards.js');
const PORT = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;

const cors = require('cors');
app.use(cors(
    { origin: CLIENT_URL }
));


app.use('/leaderboard', leaderboardRoute);
app.use(express.json());




app.listen(PORT, () => {
    console.log(`🚀 Server listening on ${PORT}`);
});

