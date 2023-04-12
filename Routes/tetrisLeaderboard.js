const express = require('express');
const router = express.Router();
const { postTetrisScore, getTetrisLeaderboard } = require('../controllers/leaderboardController');

router.route('/tetris/leaderboard')
    .post(postTetrisScore)
    .get(getTetrisLeaderboard);

module.exports = router;