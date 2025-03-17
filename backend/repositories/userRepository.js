const { client } = require('../db/postgresql.js');

console.log('Client:', client);

const getAllUsers = async () => {
    try {
        const result = await client.query('SELECT * FROM users');
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
        const result = await client.query('SELECT * FROM users WHERE id = $1', [id]);
        return result.rows[0];
    } catch (error) {
        throw new Error('Erro ao buscar usuário');
    }
};

const addUser = async (name, email, password) => {
    if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
        throw new Error('Dados inválidos');
    }
    try {
        const result = await client.query(
            'INSERT INTO users (nome, email, senha) VALUES ($1, $2, $3) RETURNING *',
            [name, email, password]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Erro ao adicionar usuário:', error); // Adicione este log para depuração
        throw new Error('Erro ao adicionar usuário');
    }
};

const updateUser = async (id, name, email, password) => {
    if (!Number.isInteger(id) || typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
        throw new Error('Dados inválidos');
    }
    try {
        const result = await client.query(
            'UPDATE users SET nome = $1, email = $2, senha = $3 WHERE id = $4 RETURNING *',
            [name, email, password, id]
        );
        return result.rows[0];
    } catch (error) {
        throw new Error('Erro ao atualizar usuário');
    }
};

const deleteUser = async (id) => {
    if (!Number.isInteger(id)) {
        throw new Error('ID inválido');
    }
    try {
        await client.query('DELETE FROM users WHERE id = $1', [id]);
        return { message: 'Usuário removido com sucesso' };
    } catch (error) {
        throw new Error('Erro ao remover usuário');
    }
};

module.exports = { getAllUsers, getUserById, addUser, updateUser, deleteUser };