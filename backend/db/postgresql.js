const { Client } = require('pg');
require('dotenv').config({ path: './.env' });

const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

client.connect()
    .then(() => console.log('Conexão bem sucedida!'))
    .catch(err => console.error('Erro de conexão:', err.stack));

module.exports = client;