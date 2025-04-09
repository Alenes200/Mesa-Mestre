const pedidoProdutoRepository = require('../repositories/pedidoProdutoRepository');

const pedidoProdutoController = {
  // Lista todos os registros
  listAll: async (req, res) => {
    try {
      const registros = await pedidoProdutoRepository.getAll();
      res.json(registros);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao listar registros.' });
    }
  },

  // Busca por ID
  getById: async (req, res) => {
    try {
      const registro = await pedidoProdutoRepository.getById(req.params.id);
      registro
        ? res.json(registro)
        : res.status(404).json({ error: 'Registro não encontrado.' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar registro.' });
    }
  },

  // Lista produtos de um pedido
  getByPedidoId: async (req, res) => {
    try {
      const produtos = await pedidoProdutoRepository.getByPedidoId(
        req.params.pedidoId
      );
      res.json(produtos);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar produtos do pedido.' });
    }
  },

  // Cria novo registro
  create: async (req, res) => {
    try {
      const { ped_id, pro_id, ppr_quantidade } = req.body;

      if (!ped_id || !pro_id || !ppr_quantidade) {
        return res
          .status(400)
          .json({ error: 'Todos os campos são obrigatórios.' });
      }

      const novoRegistro = await pedidoProdutoRepository.create({
        ped_id,
        pro_id,
        ppr_quantidade,
      });
      res.status(201).json(novoRegistro);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar registro.' });
    }
  },

  // Atualiza registro
  update: async (req, res) => {
    try {
      const { ped_id, pro_id, ppr_quantidade } = req.body;

      if (Object.keys(req.body).length === 0) {
        return res
          .status(400)
          .json({ error: 'Nenhum campo fornecido para atualização.' });
      }

      const registroAtualizado = await pedidoProdutoRepository.update(
        req.params.id,
        {
          ped_id,
          pro_id,
          ppr_quantidade,
        }
      );

      registroAtualizado
        ? res.json(registroAtualizado)
        : res.status(404).json({ error: 'Registro não encontrado.' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar registro.' });
    }
  },

  // Remove registro
  delete: async (req, res) => {
    try {
      const registroDeletado = await pedidoProdutoRepository.delete(
        req.params.id
      );
      registroDeletado
        ? res.json({ message: 'Registro deletado com sucesso.' })
        : res.status(404).json({ error: 'Registro não encontrado.' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao deletar registro.' });
    }
  },
};

module.exports = pedidoProdutoController;
