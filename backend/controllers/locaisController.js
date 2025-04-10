const locaisRepository = require('../repositories/locaisRepository');
const path = require('path');
const fs = require('fs');

const locaisController = {
  // Lista todos os locais
  list: async (req, res) => {
    try {
      const locais = await locaisRepository.getAll();
      const formattedData = locais.map((item) => ({
        codigo: item.loc_id,
        descricao: item.loc_descricao,
      }));
      res.json(formattedData);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao listar locais.' });
    }
  },

  listTodasPrimeiro: async (req, res) => {
    try {
      const locais = await locaisRepository.getAllTodasPrimeiro();
      const formattedData = locais.map((item) => ({
        codigo: item.loc_id,
        descricao: item.loc_descricao,
      }));
      res.json(formattedData);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao listar locais.' });
    }
  },

  get: async (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido.' });
    }

    try {
      const locais = await locaisRepository.getById(id);
      if (locais) {
        res.json({
          codigo: locais.loc_id,
          descricao: locais.loc_descricao,
        });
      } else {
        res.status(404).json({ error: 'Local não encontrado.' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar local.' });
    }
  },

  // Cria um novo local
  create: async (req, res) => {
    try {
      const { descricao } = req.body;

      if (!descricao) {
        return res
          .status(400)
          .json({ error: 'Todos os campos são obrigatórios.' });
      }

      const novoLocal = await locaisRepository.create({
        descricao,
      });

      res.status(201).json(novoLocal);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar local.' });
    }
  },

  // Atualiza um local
  update: async (req, res) => {
    const { id } = req.params;
    const { descricao } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido.' });
    }

    const validationError = validateDescricao(descricao);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    try {
      const localAtualizado = await locaisRepository.update(id, descricao);
      if (localAtualizado) {
        res.json({
          codigo: localAtualizado.loc_id,
          descricao: localAtualizado.loc_descricao,
        });
      } else {
        res.status(404).json({ error: 'Local não encontrado.' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar local.' });
    }
  },

  delete: async (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido.' });
    }

    try {
      const localDeletado = await locaisRepository.delete(id);
      if (localDeletado) {
        res.json({
          message: 'Local removido com sucesso.',
          Local: {
            codigo: `LOC_${localDeletado.loc_id}`,
            descricao: localDeletado.loc_descricao,
          },
        });
      } else {
        res.status(404).json({ error: 'Local não encontrado.' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Erro ao remover local.' });
    }
  },
};

// Validador reutilizável
function validateDescricao(descricao) {
  if (!descricao || typeof descricao !== 'string') {
    return 'A descrição é obrigatória.';
  }

  const trimmed = descricao.trim();
  if (trimmed.length === 0) {
    return 'A descrição não pode estar em branco.';
  }

  if (trimmed.length < 3) {
    return 'A descrição deve ter no mínimo 3 caracteres.';
  }

  if (trimmed.length > 100) {
    return 'A descrição deve ter no máximo 100 caracteres.';
  }

  return null; // Sem erros
}

module.exports = locaisController;