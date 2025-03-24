const mesasRepository = require('../repositories/mesaRepository');
const path = require('path');
const fs = require('fs');

const mesasController = {
  list: async (req, res) => {
    try {
      const mesas = await mesasRepository.getAll();
      res.json(mesas);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao listar mesas.' });
    }
  },

  get: async (req, res) => {
    try {
      const mesa = await mesasRepository.getById(req.params.id);
      if (mesa) {
        res.json(mesa);
      } else {
        res.status(404).json({ error: 'Mesa não encontrado.' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar mesa.' });
    }
  },

  getLocais: async (req, res) => {
    try {
      const locais = await mesasRepository.getLocais();
      res.json(locais);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao listar os locais.' });
    }
  },

  create: async (req, res) => {
    try {
      const { capacidade, descricao, local } = req.body;

      if (!capacidade || !descricao || !local) {
        return res
          .status(400)
          .json({ error: 'Todos os campos são obrigatórios.' });
      }

      const novaMesa = await mesasRepository.create({
        capacidade,
        descricao,
        local,
      });

      res.status(201).json(novaMesa);
    } catch (error) {
      console.error('Erro ao criar mesa:', error);
      res.status(500).json({ error: 'Erro ao criar mesa.' });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { capacidade, descricao, local, status } = req.body;

      const mesaExistente = await mesasRepository.getByIdIgnoreStatus(id);

      if (!mesaExistente) {
        return res.status(404).json({ error: 'Mesa não encontrada.' });
      }
      if (mesaExistente.status < 1 && status < 1) {
        return res.status(400).json({
          error:
            'Mesa desativado. Para reativar, defina um status válido (>= 1).',
        });
      }

      const mesaAtualizada = await mesasRepository.update(id, {
        capacidade: capacidade || mesaExistente.mes_capacidade,
        descricao: descricao || mesaExistente.mes_descricao,
        local: local || mesaExistente.mes_local,
        status: status || mesaExistente.mes_status,
      });

      res.status(200).json(mesaAtualizada);
    } catch (error) {
      console.error('Erro ao atualizar mesa:', error);
      res.status(500).json({ error: 'Erro ao atualizar mesa.' });
    }
  },

  delete: async (req, res) => {
    try {
      const mesaAtualizada = await mesasRepository.delete(req.params.id);

      if (mesaAtualizada) {
        res.status(200).json({
          message: 'Mesa desativado com sucesso.',
          mesa: mesaAtualizada,
        });
      } else {
        res.status(404).json({ error: 'Mesa não encontrado.' });
      }
    } catch (error) {
      console.error('Erro ao desativar mesa:', error);
      res.status(500).json({ error: 'Erro ao desativar mesa.' });
    }
  },

  getByLocal: async (req, res) => {
    try {
      const { local } = req.params;
      const mesas = await mesasRepository.getByLocal(local);

      if (mesas.length > 0) {
        res.status(200).json(mesas);
      } else {
        res.status(404).json({
          error: 'Nenhuma mesa encontrada para o local especificado.',
        });
      }
    } catch (error) {
      console.error('Erro ao buscar mesas por local:', error);
      res.status(500).json({ error: 'Erro ao buscar mesas por local.' });
    }
  },

  getLocalById: async (req, res) => {
    try {
      const { id } = req.params;
      const descricao = await mesasRepository.getLocalById(id);

      if (descricao) {
        res.status(200).json(descricao);
      } else {
        res
          .status(404)
          .json({ error: 'Nenhum local encontrado para esse ID.' });
      }
    } catch (error) {
      console.error('Erro ao buscar local por ID:', error);
      res.status(500).json({ error: 'Erro ao buscar local por ID.' });
    }
  },
};

module.exports = mesasController;
