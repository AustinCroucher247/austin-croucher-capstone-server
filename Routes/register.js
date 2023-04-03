const express = require('express');
const router = express.Router();
const knex = require('knex')(require('../knexfile'))

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/', async (req, res) => { // Change '/register' to '/'
    const { username, password } = req.body;

    try {
        // Check if the username is already taken
        const existingUser = await knex('users').where('username', username).first();

        if (existingUser) {
            return res.status(409).json({ error: 'Username is already taken' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user in the database
        await knex('users').insert({ username, password: hashedPassword });

        res.json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;