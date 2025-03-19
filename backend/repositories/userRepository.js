const client = require('../db/postgresql.js');
const hashPassword = require('../utils/hashPassword');

// console.log('Conectado ao banco de dados:', client);

const usersRepository = {
  getAll: async () => {
    try {
      const query =
        'SELECT usr_id AS id, usr_nome AS nome, usr_email AS email FROM TBL_USERS WHERE usr_status >= 1';
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
        'SELECT usr_id AS id, usr_nome AS nome, usr_email AS email FROM TBL_USERS WHERE usr_id = $1 AND usr_status >= 1';
      const result = await client.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw new Error('Erro ao buscar usuário');
    }
  },

  userExists: async (email) => {
    const query = 'SELECT usr_id FROM TBL_USERS WHERE usr_email = $1';
    const result = await client.query(query, [email]);
    return result.rows.length > 0;
  },

  create: async (name, email, password, userType = 3) => {
    console.log('Dados recebidos:', { name, email, password, userType });

    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof password !== 'string'
    ) {
      throw new Error('Dados inválidos');
    }

    const userAlreadyExists = await usersRepository.userExists(email);
    console.log('Usuário já existe?', userAlreadyExists);

    if (userAlreadyExists) {
      console.log(`Usuário com e-mail ${email} já existe.`);
      return;
    }

    const hashedPassword = await hashPassword(password);
    console.log('Senha criptografada:', hashedPassword);

    try {
      const query =
        'INSERT INTO TBL_USERS (usr_nome, usr_email, usr_senha, usr_status, usr_tipo) VALUES ($1, $2, $3, 1, $4) RETURNING usr_id AS id, usr_nome AS nome, usr_email AS email, usr_tipo AS user_type';
      const result = await client.query(query, [
        name,
        email,
        hashedPassword,
        userType,
      ]);
      console.log('Usuário criado com sucesso:', result.rows[0]);
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
        'UPDATE TBL_USERS SET usr_nome = $1, usr_email = $2, usr_senha = $3 WHERE usr_id = $4 RETURNING usr_id AS id, usr_nome AS nome, usr_email AS email';
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
        'UPDATE TBL_USERS SET usr_status = -1 WHERE usr_id = $1 RETURNING usr_id AS id, usr_nome AS nome, usr_email AS email, usr_status AS status';
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
