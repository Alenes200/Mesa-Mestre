const client = require('../db/postgresql');
const createTestUsers = require('../utils/createTestUsers');

const loginRepository = {
  getUserByEmail: async (email) => {
    try {
      const query = 'SELECT * FROM TBL_USERS WHERE USR_EMAIL = $1';
      const result = await client.query(query, [email]);
      return result.rows[0];
    } catch (err) {
      console.error('Erro ao buscar usuário por email:', err);
      throw err;
    }
  },
  // Função para inicializar usuários de teste
  initializeTestUsers: async () => {
    await createTestUsers(client);
  },
};

module.exports = loginRepository;
