const knex = require("knex")(require("../knexfile"));

exports.getLeaderboard = async (_req, res) => {

    try {
        const scores = await knex('leaderboards').orderBy('score', 'desc');
        res.json(scores);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};