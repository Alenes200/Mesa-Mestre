const usersRepository = require('../repositories/userRepository');

const usersController = {
  getUsers: async (req, res) => {
    try {
      const users = await usersRepository.getAll();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar usuários' });
    }
  },

  getUserById: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
      }
      const user = await usersRepository.getById(id);
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar usuário' });
    }
  },

  createUser: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      if (
        typeof name !== 'string' ||
        typeof email !== 'string' ||
        typeof password !== 'string'
      ) {
        return res.status(400).json({ message: 'Dados inválidos' });
      }
      const newUser = await usersRepository.create(name, email, password);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao adicionar usuário' });
    }
  },

  updateUser: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
      }
      const { name, email, password } = req.body;
      if (
        typeof name !== 'string' ||
        typeof email !== 'string' ||
        typeof password !== 'string'
      ) {
        return res.status(400).json({ message: 'Dados inválidos' });
      }
      const updatedUser = await usersRepository.update(
        id,
        name,
        email,
        password
      );
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar usuário' });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
      }
      const message = await usersRepository.delete(id);
      res.json(message);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao desativar usuário' });
    }
  },
};

module.exports = usersController;
