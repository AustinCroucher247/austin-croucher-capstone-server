const express = require('express');
const router = express.Router();
const { postTetrisScore, getTetrisLeaderboard } = require('../controllers/leaderboardController');

router.route('/leaderboard')
    .post(postTetrisScore)
    .get(getTetrisLeaderboard);

module.exports = router;