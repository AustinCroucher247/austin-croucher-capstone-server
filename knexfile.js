require('dotenv').config();
// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
// module.exports = {
//     client: 'mysql2',
//     connection: {
//         host: '127.0.0.1',
//         database: process.env.DB_LOCAL_DBNAME,
//         user: process.env.DB_LOCAL_USER,
//         password: process.env.DB_LOCAL_PASSWORD,
//     },
// };



module.exports = {
    client: 'mysql2',
    connection: {
        host: process.env.DB_HOST,
        database: process.env.DB_DATABASE,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT || 3306 // default port is 3306
    }
};