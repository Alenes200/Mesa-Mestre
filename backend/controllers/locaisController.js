const locaisRepository = require('../repositories/locaisRepository');
const path = require('path');
const fs = require('fs');

const locaisController = {
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
      console.error('Erro ao criar local:', error);
      res.status(500).json({ error: 'Erro ao criar local.' });
    }
  },
};

module.exports = locaisController;
