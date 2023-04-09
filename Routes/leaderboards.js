const express = require('express');
const router = express.Router();
const knex = require('knex')(require('../knexfile'))
const { v4: uuidv4 } = require('uuid');
const { getLeaderboard } = require('../controllers/leaderboardController');
const { postScore } = require('../controllers/leaderboardController')

router.route('/')
    .get(getLeaderboard)

router.route('/')
    .post(postScore)

// router.get('/leaderboard', async (req, res) => {
//     const { username } = req.query;

//     try {
//         const scores = await knex('leaderboards')
//             .where('username', username)
//             .orderBy('score', 'desc');

//         res.json(scores);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Server error' });
//     }
// });

router.get('/leaderboard', async (req, res) => {

    try {
        const scores = await knex('leaderboards')

        res.json(scores);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;