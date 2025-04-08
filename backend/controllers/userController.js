const userRepository = require('../repositories/userRepository');

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPhone = (phone) => /^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/.test(phone);
const isValidPassword = (senha) => {
  return /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(senha);
};

const getUsers = async (req, res) => {
  try {
    const users = await userRepository.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuários' });
  }
};

const getAllUsersIgnoreStatus = async (req, res) => {
  try {
    const userId = parseInt(req.query.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'ID do usuário inválido.' });
    }

    const users = await userRepository.getAllUsersIgnoreStatus(userId);
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

const getUserByIdIgnoreStatus = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const user = await userRepository.getUserByIdIgnoreStatus(id);
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
    const { nome, email, senha, telefone, funcao, tipo } = req.body;

    if (
      !nome ||
      typeof nome !== 'string' ||
      !email ||
      typeof email !== 'string' ||
      !isValidEmail(email) ||
      !senha ||
      typeof senha !== 'string' ||
      !isValidPassword(senha) ||
      (telefone && !isValidPhone(telefone)) ||
      (funcao && typeof funcao !== 'string') ||
      (tipo && ![1, 2, 3].includes(tipo))
    ) {
      return res
        .status(400)
        .json({ message: 'Dados inválidos ou incompletos' });
    }

    const users = await userRepository.getAllUsers();

    const emailExiste = users.some((user) => user.usr_email === email);

    if (emailExiste) {
      return res
        .status(409)
        .json({ message: 'Email já está em uso por outro usuário.' });
    }

    const newUser = await userRepository.addUser(
      nome,
      email,
      senha,
      telefone,
      funcao,
      tipo
    );
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao adicionar usuário' });
  }
};

const updateUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID inválido.' });
    }

    const userExistente = await userRepository.getUserByIdIgnoreStatus(id);

    if (!userExistente) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const { nome, email, senha, telefone, funcao, tipo, status } = req.body;

    const dadosAtualizados = {};

    if (nome && typeof nome === 'string') dadosAtualizados.usr_nome = nome;
    if (email && typeof email === 'string' && isValidEmail(email)) {
      dadosAtualizados.usr_email = email;
    } else {
      return res.status(400).json({
        message: 'Email inválido.',
      });
    }
    if (senha && typeof senha === 'string') {
      if (!isValidPassword(senha)) {
        return res.status(400).json({
          message:
            'Senha inválida. A senha deve conter ao menos 8 caracteres, 1 letra maiúscula e 1 número.',
        });
      }
      dadosAtualizados.usr_senha = senha;
    }

    if (telefone && typeof telefone === 'string') {
      if (!isValidPhone(telefone)) {
        return res
          .status(400)
          .json({ message: 'Telefone deve ter entre 10 e 11 dígitos.' });
      }
      dadosAtualizados.usr_telefone = telefone;
    }

    if (funcao && typeof funcao === 'string')
      dadosAtualizados.usr_funcao = funcao;
    if (tipo !== undefined && [1, 2, 3].includes(tipo))
      dadosAtualizados.usr_tipo = tipo;
    if (status !== undefined && typeof status === 'number' && status >= 0)
      dadosAtualizados.usr_status = status;

    const users = await userRepository.getAllUsers();

    if (email) {
      const emailExiste = users.some((user) => {
        return user.usr_email === email && user.usr_id != id;
      });

      if (emailExiste) {
        return res
          .status(409)
          .json({ message: 'Email já está em uso por outro usuário.' });
      }
    }

    if (Object.keys(dadosAtualizados).length === 0) {
      return res
        .status(400)
        .json({ message: 'Pelo menos um campo válido deve ser fornecido.' });
    }

    const updatedUser = await userRepository.updateUser(id, dadosAtualizados);
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar usuário.' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID inválido.' });
    }

    const usuarioAtualizado = await userRepository.deleteUser(id);

    if (usuarioAtualizado) {
      res.status(200).json({ message: 'Usuário deletado com sucesso.' });
    } else {
      res.status(404).json({ message: 'Usuário não encontrado.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar usuário.' });
  }
};

const searchUsers = async (req, res) => {
  try {
    const searchTerm = req.query.term;
    if (!searchTerm || typeof searchTerm !== 'string') {
      return res.status(400).json({ message: 'Termo de pesquisa inválido.' });
    }

    const users = await userRepository.searchUsers(searchTerm);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuários.' });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getAllUsersIgnoreStatus,
  getUserByIdIgnoreStatus,
  searchUsers,
};
