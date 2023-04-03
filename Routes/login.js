const express = require('express');
const router = express.Router();
const knex = require('knex')(require('../knexfile'))

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Get the user with the provided username
        const user = await knex('users').where('username', username).first();

        // Check if the user exists and the password is correct
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Incorrect username or password' });
        }

        // Generate a JWT token and send it back to the client
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;