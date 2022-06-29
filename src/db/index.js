const knex = require('knex');
require('dotenv').config();

const db = knex.default({
    client: 'mysql2',
    connection: {
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_DATABASE,
        timezone: '+00:00'
    }
});

module.exports = db; 