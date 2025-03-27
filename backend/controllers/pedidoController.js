const pedidoRepository = require('../repositories/pedidoRepository');

const pedidoController = {
  // Lista todos os pedidos (ativos e inativos)
  listAll: async (req, res) => {
    try {
      const pedidos = await pedidoRepository.getAll();
      res.json(pedidos);
    } catch (error) {
      console.error('Erro ao listar todos os pedidos:', error);
      res.status(500).json({ error: 'Erro ao listar todos os pedidos.' });
    }
  },

  // Lista apenas os pedidos ativos
  listActive: async (req, res) => {
    try {
      const pedidos = await pedidoRepository.getActive();
      res.json(pedidos);
    } catch (error) {
      console.error('Erro ao listar pedidos ativos:', error);
      res.status(500).json({ error: 'Erro ao listar pedidos ativos.' });
    }
  },

  // Busca um pedido pelo ID
  get: async (req, res) => {
    try {
      const pedido = await pedidoRepository.getById(req.params.id);
      if (pedido) {
        res.json(pedido);
      } else {
        res.status(404).json({ error: 'Pedido não encontrado.' });
      }
    } catch (error) {
      console.error('Erro ao buscar pedido:', error);
      res.status(500).json({ error: 'Erro ao buscar pedido.' });
    }
  },

  // Cria um novo pedido
  create: async (req, res) => {
    try {
      const { com_id, ped_descricao, ped_status, ped_preco_total, fpa_id } =
        req.body;

      // Validação dos campos obrigatórios
      if (!com_id || !ped_descricao || !ped_preco_total) {
        return res.status(400).json({ error: 'Campos obrigatórios faltando.' });
      }

      const novoPedido = await pedidoRepository.create({
        com_id,
        ped_descricao,
        ped_status: ped_status || 1,
        ped_preco_total,
        fpa_id,
      });

      res.status(201).json(novoPedido);
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      res.status(500).json({ error: 'Erro ao criar pedido.' });
    }
  },

  // Atualiza um pedido (nenhum campo obrigatório)
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Verifica se há campos para atualizar
      if (Object.keys(updates).length === 0) {
        return res
          .status(400)
          .json({ error: 'Nenhum campo fornecido para atualização.' });
      }

      const pedidoAtualizado = await pedidoRepository.update(id, updates);

      if (pedidoAtualizado) {
        res.json(pedidoAtualizado);
      } else {
        res.status(404).json({ error: 'Pedido não encontrado.' });
      }
    } catch (error) {
      console.error('Erro ao atualizar pedido:', error);
      res.status(500).json({ error: 'Erro ao atualizar pedido.' });
    }
  },

  // Deleta logicamente um pedido
  delete: async (req, res) => {
    try {
      const pedidoDeletado = await pedidoRepository.delete(req.params.id);

      if (pedidoDeletado) {
        res.json({
          message: 'Pedido deletado com sucesso.',
          pedido: pedidoDeletado,
        });
      } else {
        res.status(404).json({ error: 'Pedido não encontrado.' });
      }
    } catch (error) {
      console.error('Erro ao deletar pedido:', error);
      res.status(500).json({ error: 'Erro ao deletar pedido.' });
    }
  },
};

module.exports = pedidoController;
