const { client } = require('../db/postgresql.js');
const hashPassword = require('../utils/hashPassword');

const usersRepository = {
  getAll: async () => {
    try {
      const query = 'SELECT id, nome, email FROM users WHERE status >= 1';
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      throw new Error('Erro ao buscar usuários');
    }
  },

  getById: async (id) => {
    if (!Number.isInteger(id)) {
      throw new Error('ID inválido');
    }
    try {
      const query =
        'SELECT id, nome, email FROM users WHERE id = $1 AND status >= 1';
      const result = await client.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw new Error('Erro ao buscar usuário');
    }
  },

  userExists: async (email) => {
    const query = 'SELECT id FROM users WHERE email = $1';
    const result = await client.query(query, [email]);
    return result.rows.length > 0;
  },

  create: async (name, email, password, userType = 3) => {
    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof password !== 'string'
    ) {
      throw new Error('Dados inválidos');
    }

    const userAlreadyExists = await usersRepository.userExists(email);
    if (userAlreadyExists) {
      console.log(`Usuário com e-mail ${email} já existe.`);
      return;
    }

    const hashedPassword = await hashPassword(password);

    try {
      const query =
        'INSERT INTO users (nome, email, senha, status, user_type) VALUES ($1, $2, $3, 1, $4) RETURNING id, nome, email, user_type';
      const result = await client.query(query, [
        name,
        email,
        hashedPassword,
        userType,
      ]);
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao adicionar usuário:', error);
      throw new Error('Erro ao adicionar usuário');
    }
  },

  update: async (id, name, email, password) => {
    if (
      !Number.isInteger(id) ||
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof password !== 'string'
    ) {
      throw new Error('Dados inválidos');
    }

    const hashedPassword = await hashPassword(password);

    try {
      const query =
        'UPDATE users SET nome = $1, email = $2, senha = $3 WHERE id = $4 RETURNING id, nome, email';
      const result = await client.query(query, [
        name,
        email,
        hashedPassword,
        id,
      ]);
      return result.rows[0];
    } catch (error) {
      throw new Error('Erro ao atualizar usuário');
    }
  },

  delete: async (id) => {
    if (!Number.isInteger(id)) {
      throw new Error('ID inválido');
    }
    try {
      const query =
        'UPDATE users SET status = -1 WHERE id = $1 RETURNING id, nome, email, status';
      const result = await client.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw new Error('Erro ao desativar usuário');
    }
  },
};

async function initializeUsers() {
  try {
    await usersRepository.create(
      'Admin',
      'admin@example.com',
      process.env.SENHA_SECRETA_1,
      1
    );
    await usersRepository.create(
      'Funcionário',
      'funcionario@example.com',
      process.env.SENHA_SECRETA_2,
      2
    );
    await usersRepository.create(
      'Usuário Comum',
      'usuario@example.com',
      process.env.SENHA_SECRETA_3,
      3
    );
    console.log('Usuários iniciais criados com sucesso.');
  } catch (error) {
    console.error('Erro ao criar usuários iniciais:', error);
  }
}

module.exports = { usersRepository, initializeUsers };
