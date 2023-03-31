const express = require('express');
const router = express.Router();
const knex = require('knex')(require('../knexfile'))
const { v4: uuidv4 } = require('uuid');
const { getLeaderboard } = require('../controllers/leaderboardController');

router.route('/')
    .get(getLeaderboard)

module.exports = router;