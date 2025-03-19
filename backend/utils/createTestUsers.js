const bcrypt = require('bcrypt');
const hashPassword = require('../utils/hashPassword');

// Função para verificar se o usuário já existe
async function userExists(client, email) {
    const query = 'SELECT * FROM TBL_USERS WHERE USR_EMAIL = $1';
    const result = await client.query(query, [email]);
    return result.rows.length > 0;
  }
  
  // Função para criar um usuário de teste
  async function createTestUser(client, nome, email, password, userType) {
    const userAlreadyExists = await userExists(client, email);
  
    if (userAlreadyExists) {
    //   console.log(`Usuário com e-mail ${email} já existe.`);
      return;
    }
  
    const hashedPassword = await hashPassword(password);
  
    const query = `
      INSERT INTO TBL_USERS (USR_NOME, USR_EMAIL, USR_SENHA, USR_TIPO)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
  
    const result = await client.query(query, [nome, email, hashedPassword, userType]);
    console.log('Usuário criado:', result.rows[0]);
  }
  
  // Exporta a função principal para criar usuários de teste
  module.exports = async function createTestUsers(client) {
    try {
      // Cria um usuário admin (user_type = 1)
      await createTestUser(client, 'Admin', 'admin@example.com', process.env.SENHA_SECRETA_1, 1);
  
      // Cria um usuário funcionário (user_type = 2)
      await createTestUser(client, 'Funcionário', 'funcionario@example.com', process.env.SENHA_SECRETA_2, 2);
  
      // Cria um usuário comum (user_type = 3)
      await createTestUser(client, 'Usuário Comum', 'usuario@example.com', process.env.SENHA_SECRETA_3, 3);
    } catch (error) {
      console.error('Erro ao criar usuários de teste:', error);
    }
  };