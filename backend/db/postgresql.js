require('dotenv').config({ path: './.env' });
const { Client } = require('pg');
const { Client: SSHClient } = require('ssh2');

// Configurações do SSH
const sshConfig = {
  host: process.env.SSH_HOST,
  port: 22,
  username: process.env.SSH_USER,
  password: process.env.SSH_PASSWORD,
};

// Configurações do PostgreSQL
const dbConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
};

// Função para inicializar a conexão com o banco de dados
const initializeDBClient = () => {
  return new Promise((resolve, reject) => {
    const sshClient = new SSHClient();
    sshClient
      .on('ready', () => {
        console.log('Conexão SSH estabelecida.');

        const dbClient = new Client(dbConfig);
        dbClient
          .connect()
          .then(() => {
            console.log('Conectado ao banco de dados via SSH.');
            resolve(dbClient); // Resolve a Promise com o cliente conectado
          })
          .catch((err) => {
            console.error('Erro de conexão ao banco de dados:', err.stack);
            reject(err);
          });
      })
      .on('error', (err) => {
        console.error('Erro na conexão SSH:', err);
        reject(err);
      })
      .connect(sshConfig);
  });
};

// Exporta a Promise que resolve com o dbClient conectado
module.exports = initializeDBClient();