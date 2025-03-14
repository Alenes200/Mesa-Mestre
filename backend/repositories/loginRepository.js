const dbClientPromise = require('../db/postgresql'); // Importa a Promise que resolve com o dbClient

const loginRepository = {
  getUserByEmail: async (email) => {
    try {
      const client = await dbClientPromise; // Aguarda a conexão ser estabelecida
      const query = 'SELECT * FROM users WHERE email = $1';
      const result = await client.query(query, [email]);
      return result.rows[0];
    } catch (err) {
      console.error('Erro ao buscar usuário por email:', err);
      throw err;
    }
  },
};

module.exports = loginRepository;