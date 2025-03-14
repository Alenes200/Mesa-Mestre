const userRepository = require('../repositories/userRepository');

const getUsers = async (req, res) => {
    try {
        const users = await userRepository.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar usuários' });
    }
};

const getUserById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'ID inválido' });
        }
        const user = await userRepository.getUserById(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar usuário' });
    }
};

const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
            return res.status(400).json({ message: 'Dados inválidos' });
        }
        const newUser = await userRepository.addUser(name, email, password);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao adicionar usuário' });
    }
};

const updateUser = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'ID inválido' });
        }
        const { name, email, password } = req.body;
        if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
            return res.status(400).json({ message: 'Dados inválidos' });
        }
        const updatedUser = await userRepository.updateUser(id, name, email, password);
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar usuário' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'ID inválido' });
        }
        const message = await userRepository.deleteUser(id);
        res.json(message);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao remover usuário' });
    }
};

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser };