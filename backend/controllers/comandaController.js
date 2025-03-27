const comandaRepository = require('../repositories/comandaRepository');

const comandaController = {
  // Lista todas as comandas (ativos e inativos)
  listAll: async (req, res) => {
    try {
      const comandas = await comandaRepository.getAll();
      res.json(comandas);
    } catch (error) {
      console.error('Erro ao listar todas as comandas:', error);
      res.status(500).json({ error: 'Erro ao listar todas as comandas.' });
    }
  },

  // Lista apenas as comandas ativas
  listActive: async (req, res) => {
    try {
      const comandas = await comandaRepository.getActive();
      res.json(comandas);
    } catch (error) {
      console.error('Erro ao listar comandas ativas:', error);
      res.status(500).json({ error: 'Erro ao listar comandas ativas.' });
    }
  },

  get: async (req, res) => {
    try {
      const comanda = await comandaRepository.getById(req.params.id);
      if (comanda) {
        res.json(comanda);
      } else {
        res.status(404).json({ error: 'Comanda não encontrada.' });
      }
    } catch (error) {
      console.error('Erro ao buscar comanda:', error);
      res.status(500).json({ error: 'Erro ao buscar comanda.' });
    }
  },

  create: async (req, res) => {
    try {
      const { mes_id, com_data_inicio, com_data_fim, com_status } = req.body;

      if (!mes_id || !com_data_inicio) {
        return res.status(400).json({ error: 'Campos obrigatórios faltando.' });
      }

      const novaComanda = await comandaRepository.create({
        mes_id,
        com_data_inicio,
        com_data_fim,
        com_status,
      });

      res.status(201).json(novaComanda);
    } catch (error) {
      console.error('Erro ao criar comanda:', error);
      res.status(500).json({ error: 'Erro ao criar comanda.' });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { mes_id, com_data_inicio, com_data_fim, com_status } = req.body;

      const comandaAtualizada = await comandaRepository.update(id, {
        mes_id,
        com_data_inicio,
        com_data_fim,
        com_status,
      });

      if (comandaAtualizada) {
        res.json(comandaAtualizada);
      } else {
        res.status(404).json({ error: 'Comanda não encontrada.' });
      }
    } catch (error) {
      console.error('Erro ao atualizar comanda:', error);
      res.status(500).json({ error: 'Erro ao atualizar comanda.' });
    }
  },

  delete: async (req, res) => {
    try {
      const comandaDeletada = await comandaRepository.delete(req.params.id);

      if (comandaDeletada) {
        res.json({
          message: 'Comanda deletada com sucesso.',
          comanda: comandaDeletada,
        });
      } else {
        res.status(404).json({ error: 'Comanda não encontrada.' });
      }
    } catch (error) {
      console.error('Erro ao deletar comanda:', error);
      res.status(500).json({ error: 'Erro ao deletar comanda.' });
    }
  },
};

module.exports = comandaController;
