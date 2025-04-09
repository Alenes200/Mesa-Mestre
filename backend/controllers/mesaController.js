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

  listInativas: async (req, res) => {
    try {
      const mesas = await mesasRepository.getInativas();
      res.json(mesas);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao listar mesas.' });
    }
  },

  get: async (req, res) => {
    try {
      const { id } = req.params;

      if (isNaN(id) || id <= 0) {
        return res
          .status(400)
          .json({ error: 'ID inválido. Deve ser um número inteiro positivo.' });
      }

      const mesa = await mesasRepository.getById(id);

      if (mesa) {
        res.json(mesa);
      } else {
        res.status(404).json({ error: 'Mesa não encontrada.' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar mesa.' });
    }
  },

  getLocaisRestritos: async (req, res) => {
    try {
      const locais = await mesasRepository.getLocaisRestritos();
      res.json(locais);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao listar os locais.' });
    }
  },

  getTodosLocais: async (req, res) => {
    try {
      const locais = await mesasRepository.getTodosLocais();
      res.json(locais);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao listar os locais.' });
    }
  },

  create: async (req, res) => {
    try {
      const { nome, codigo, status, capacidade, descricao, local } = req.body;

      if (
        typeof nome !== 'string' ||
        nome.trim() === '' ||
        typeof codigo !== 'string' ||
        codigo.trim() === '' ||
        typeof descricao !== 'string' ||
        descricao.trim() === '' ||
        typeof capacidade !== 'number' ||
        capacidade <= 0 ||
        typeof local !== 'number' ||
        isNaN(local) ||
        typeof status !== 'number' ||
        ![0, 1].includes(status)
      ) {
        return res.status(400).json({
          error:
            'Campos inválidos. Verifique se nome, código, descrição são strings, capacidade e local são números válidos, e status é 0 ou 1.',
        });
      }

      // Verificar se o código já está em uso
      const mesaExistente = await mesasRepository.getByCode(codigo);
      if (mesaExistente) {
        return res
          .status(409)
          .json({ error: 'Já existe uma mesa com esse código.' });
      }

      const novaMesa = await mesasRepository.create({
        nome,
        codigo,
        status,
        capacidade,
        descricao,
        local,
      });

      res.status(201).json(novaMesa);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar mesa.' });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;

      if (isNaN(id) || id <= 0) {
        return res
          .status(400)
          .json({ error: 'ID inválido. Deve ser um número inteiro positivo.' });
      }

      const { nome, codigo, capacidade, descricao, local, status } = req.body;

      const mesaExistente = await mesasRepository.getByIdIgnoreStatus(id);
      if (!mesaExistente) {
        return res.status(404).json({ error: 'Mesa não encontrada.' });
      }

      // Se o código foi alterado, verificar se já existe outra mesa com esse mesmo código
      if (codigo && codigo !== mesaExistente.mes_codigo) {
        const mesaComMesmoCodigo = await mesasRepository.getByCode(codigo);
        if (mesaComMesmoCodigo && mesaComMesmoCodigo.mes_id !== parseInt(id)) {
          return res
            .status(409)
            .json({ error: 'Código já está em uso por outra mesa.' });
        }
      }

      const atualizacao = {
        nome:
          typeof nome === 'string' && nome.trim() !== ''
            ? nome
            : mesaExistente.mes_nome,
        codigo:
          typeof codigo === 'string' && codigo.trim() !== ''
            ? codigo
            : mesaExistente.mes_codigo,
        capacidade:
          typeof capacidade === 'number' && capacidade > 0
            ? capacidade
            : mesaExistente.mes_capacidade,
        descricao:
          typeof descricao === 'string' && descricao.trim() !== ''
            ? descricao
            : mesaExistente.mes_descricao,
        local:
          typeof local === 'number' && !isNaN(local)
            ? local
            : mesaExistente.mes_local,
        status:
          typeof status === 'number' && [0, 1].includes(status)
            ? status
            : mesaExistente.mes_status,
      };

      const mesaAtualizada = await mesasRepository.update(id, atualizacao);

      res.status(200).json(mesaAtualizada);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar mesa.' });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;

      if (isNaN(id) || id <= 0) {
        return res
          .status(400)
          .json({ error: 'ID inválido. Deve ser um número inteiro positivo.' });
      }

      const mesaAtualizada = await mesasRepository.delete(id);

      if (mesaAtualizada) {
        res.status(200).json({
          message: 'Mesa desativada com sucesso.',
          mesa: mesaAtualizada,
        });
      } else {
        res.status(404).json({ error: 'Mesa não encontrada.' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Erro ao desativar mesa.' });
    }
  },

  getByLocal: async (req, res) => {
    try {
      const { local } = req.params;

      if (!local || typeof local !== 'string' || local.trim() === '') {
        return res
          .status(400)
          .json({ error: 'Local inválido. Deve ser uma string não vazia.' });
      }

      const mesas = await mesasRepository.getByLocal(local);

      if (mesas.length > 0) {
        res.status(200).json(mesas);
      } else {
        res.status(404).json({
          error: 'Nenhuma mesa encontrada para o local especificado.',
        });
      }
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar mesas por local.' });
    }
  },

  getLocalById: async (req, res) => {
    try {
      const id = Number(req.params.id);

      if (!id || isNaN(id) || id <= 0) {
        return res
          .status(400)
          .json({ error: 'ID inválido. Deve ser um número inteiro positivo.' });
      }

      const descricao = await mesasRepository.getLocalById(id);

      if (descricao) {
        res.status(200).json(descricao);
      } else {
        res
          .status(404)
          .json({ error: 'Nenhum local encontrado para esse ID.' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar local por ID.' });
    }
  },

  getPesquisaArea: async (req, res) => {
    try {
      const { mes_id, mes_descricao, loc_descricao } = req.query;

      // Chama o repositório passando os parâmetros
      const mesas = await mesasRepository.getPesquisaArea(
        mes_id,
        mes_descricao,
        loc_descricao
      );
      res.json(mesas);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao listar mesas.' });
    }
  },

  getPesquisaAtivas: async (req, res) => {
    try {
      const { mes_id, mes_descricao } = req.query;
      const mesas = await mesasRepository.getPesquisaAtivas(
        mes_id,
        mes_descricao
      );
      res.json(mesas);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao listar mesas.' });
    }
  },

  getPesquisaInativas: async (req, res) => {
    try {
      const { mes_id, mes_descricao } = req.query;
      const mesas = await mesasRepository.getPesquisaInativas(
        mes_id,
        mes_descricao
      );
      res.json(mesas);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao listar mesas.' });
    }
  },

  getByCode: async (req, res) => {
    try {
      const { codigo } = req.params;

      if (!codigo || typeof codigo !== 'string') {
        return res.status(400).json({ error: 'Código da mesa é obrigatório.' });
      }

      const mesa = await mesasRepository.getByCode(codigo);

      if (mesa) {
        res.status(200).json(mesa);
      } else {
        res.status(404).json({ error: 'Mesa não encontrada.' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar mesa pelo código.' });
    }
  },
};

module.exports = mesasController;
