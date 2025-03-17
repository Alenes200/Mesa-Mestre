const { Client } = require('pg');

async function connectToDatabase() {
    const client = new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    });

    try {
        await client.connect();
        console.log('Conexão bem sucedida!');
        return client;
    } catch (error) {
        console.error('Erro de conexão:', error.message);
        console.error('Verifique as credenciais no arquivo .env');
        throw error;
    }
}

module.exports = {
    connectToDatabase,
};