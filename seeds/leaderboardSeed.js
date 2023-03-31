/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
    // Deletes ALL existing entries
    await knex('leaderboards').del();
    await knex('leaderboards').insert([
        {
            id: '1',
            username: 'Michael',
            score: '300',

        },
        {
            id: '2',
            username: 'Omar',
            score: '100',

        },
        {
            id: '3',
            username: 'Richard',
            score: '9001',

        },
    ]);
};
