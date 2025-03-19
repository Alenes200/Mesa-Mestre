const usersRepository = require('../repositories/userRepository');

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
    const { nome, email, senha } = req.body;
    if (
      typeof nome !== 'string' ||
      typeof email !== 'string' ||
      typeof senha !== 'string'
    ) {
      return res.status(400).json({ message: 'Dados inválidos' });
    }
    const newUser = await userRepository.addUser(nome, email, senha);
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
      if (email && typeof email === 'string') dadosAtualizados.usr_email = email;
      if (senha && typeof senha === 'string') dadosAtualizados.usr_senha = senha;
      if (telefone && typeof telefone === 'string') dadosAtualizados.usr_telefone = telefone;
      if (funcao && typeof funcao === 'string') dadosAtualizados.usr_funcao = funcao;
      if (tipo !== undefined && [1, 2, 3].includes(tipo)) dadosAtualizados.usr_tipo = tipo;
      if (status !== undefined && typeof status === 'number' && status >= 0) dadosAtualizados.usr_status = status;
  
      if (Object.keys(dadosAtualizados).length === 0) {
        return res.status(400).json({ message: 'Pelo menos um campo deve ser fornecido para atualização.' });
      }
  
      const updatedUser = await userRepository.updateUser(id, dadosAtualizados);
      res.json(updatedUser);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
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
      console.error('Erro ao deletar usuário:', error);
      res.status(500).json({ message: 'Erro ao deletar usuário.' });
    }
  };

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser };
