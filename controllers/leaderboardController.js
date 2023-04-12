const knex = require("knex")(require("../knexfile"));
const { v4: uuidv4 } = require('uuid');


exports.getLeaderboard = async (_req, res) => {

    try {
        const scores = await knex('leaderboards').orderBy('score', 'desc');
        res.json(scores);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};



exports.postScore = async (req, res) => {
    const { username, score } = req.body;

    if (!username || !score) {
        return res.status(400).json({ message: 'Please provide a username and score' });
    }

    try {
        const newScore = {
            username: username,
            score: score
        };

        await knex('leaderboards').insert(newScore);

        res.status(201).json(newScore);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.postTetrisScore = async (req, res) => {
    const { username, score } = req.body;

    try {
        await knex('TetrisLeaderboards').insert({
            id: uuidv4(),
            username,
            score,
        });

        res.status(201).json({ message: 'Score posted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getTetrisLeaderboard = async (_req, res) => {
    try {
        const scores = await knex('TetrisLeaderboards').orderBy('score', 'desc');
        res.json(scores);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};