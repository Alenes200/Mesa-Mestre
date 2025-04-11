const client = require('../db/postgresql.js');
const hashPassword = require('../utils/hashPassword');

const getAllUsers = async () => {
  try {
    const query = 'SELECT * FROM TBL_USERS WHERE USR_STATUS >= 1';
    const result = await client.query(query);
    return result.rows;
  } catch (error) {
    throw new Error('Erro ao buscar usuários');
  }
};

const getAllUsersIgnoreStatus = async (userId) => {
  try {
    const query = `
      SELECT * 
      FROM TBL_USERS 
      WHERE USR_ID != $1
      ORDER BY USR_ID ASC;
    `;
    const result = await client.query(query, [userId]);
    return result.rows;
  } catch (error) {
    throw new Error('Erro ao buscar usuários');
  }
};

const getUserById = async (id) => {
  if (!Number.isInteger(id)) {
    throw new Error('ID inválido');
  }
  try {
    const query =
      'SELECT * FROM TBL_USERS WHERE USR_ID = $1 AND USR_STATUS >= 1';
    const result = await client.query(query, [id]);
    return result.rows[0];
  } catch (error) {
    throw new Error('Erro ao buscar usuário');
  }
};

const getUserByIdIgnoreStatus = async (id) => {
  if (!Number.isInteger(id)) {
    throw new Error('ID inválido');
  }
  try {
    const query = 'SELECT * FROM TBL_USERS WHERE USR_ID = $1';
    const result = await client.query(query, [id]);
    return result.rows[0];
  } catch (error) {
    throw new Error('Erro ao buscar usuário (ignorando status)');
  }
};

const addUser = async (name, email, password, telefone, funcao) => {
  if (
    typeof name !== 'string' ||
    typeof email !== 'string' ||
    typeof password !== 'string'
  ) {
    throw new Error('Dados inválidos');
  }

  try {
    const hashedPassword = await hashPassword(password);
    if (!hashedPassword) {
      throw new Error('Erro ao criar hash da senha');
    }

    const result = await client.query(
      'INSERT INTO TBL_USERS (USR_NOME, USR_EMAIL, USR_SENHA, USR_TELEFONE, USR_FUNCAO) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, email, hashedPassword, telefone || null, funcao || null]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Erro ao adicionar usuário:', error);
    throw new Error('Erro ao adicionar usuário');
  }
};

const updateUser = async (id, dadosAtualizados) => {
  if (!Number.isInteger(id)) {
    throw new Error('ID inválido');
  }

  try {
    const query = `
      UPDATE TBL_USERS
      SET 
        USR_NOME = COALESCE($1, USR_NOME),
        USR_EMAIL = COALESCE($2, USR_EMAIL),
        USR_SENHA = COALESCE($3, USR_SENHA),
        USR_TELEFONE = COALESCE($4, USR_TELEFONE),
        USR_FUNCAO = COALESCE($5, USR_FUNCAO),
        USR_TIPO = COALESCE($6, USR_TIPO),
        USR_STATUS = COALESCE($7, USR_STATUS),
        USR_UPDATED_AT = NOW()
      WHERE USR_ID = $8
      RETURNING *;
    `;

    const values = [
      dadosAtualizados.usr_nome || null,
      dadosAtualizados.usr_email || null,
      dadosAtualizados.usr_senha || null,
      dadosAtualizados.usr_telefone || null,
      dadosAtualizados.usr_funcao || null,
      dadosAtualizados.usr_tipo || null,
      dadosAtualizados.usr_status || null,
      id,
    ];

    const result = await client.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    throw new Error('Erro ao atualizar usuário');
  }
};

const deleteUser = async (id) => {
  if (!Number.isInteger(id)) {
    throw new Error('ID inválido');
  }
  try {
    const query = `
      UPDATE TBL_USERS
      SET USR_STATUS = -1
      WHERE USR_ID = $1
      RETURNING *;
    `;
    const result = await client.query(query, [id]);
    return result.rows[0] || null;
  } catch (error) {
    throw new Error('Erro ao realizar delete lógico');
  }
};

const searchUsers = async (searchTerm) => {
  try {
    const query = `
      SELECT * 
      FROM TBL_USERS 
      WHERE USR_NOME ILIKE $1 OR USR_EMAIL ILIKE $1 OR USR_FUNCAO ILIKE $1
      ORDER BY USR_ID ASC;
    `;
    const result = await client.query(query, [`%${searchTerm}%`]);
    return result.rows;
  } catch (error) {
    throw new Error('Erro ao buscar usuários.');
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
  getUserByIdIgnoreStatus,
  getAllUsersIgnoreStatus,
  searchUsers,
};
