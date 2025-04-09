const pedidoProdutoRepository = require('../repositories/pedidoProdutoRepository');

const isPositiveInteger = (value) => Number.isInteger(value) && value > 0;

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
    const id = parseInt(req.params.id, 10);
    if (!isPositiveInteger(id)) {
      return res.status(400).json({ error: 'ID inválido.' });
    }

    try {
      const registro = await pedidoProdutoRepository.getById(id);
      registro
        ? res.json(registro)
        : res.status(404).json({ error: 'Registro não encontrado.' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar registro.' });
    }
  },

  // Lista produtos de um pedido
  getByPedidoId: async (req, res) => {
    const pedidoId = parseInt(req.params.pedidoId, 10);
    if (!isPositiveInteger(pedidoId)) {
      return res.status(400).json({ error: 'ID do pedido inválido.' });
    }

    try {
      const produtos = await pedidoProdutoRepository.getByPedidoId(pedidoId);
      res.json(produtos);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar produtos do pedido.' });
    }
  },

  // Cria novo registro
  create: async (req, res) => {
    const { ped_id, pro_id, ppr_quantidade } = req.body;

    if (
      !isPositiveInteger(ped_id) ||
      !isPositiveInteger(pro_id) ||
      !isPositiveInteger(ppr_quantidade)
    ) {
      return res.status(400).json({
        error:
          'Campos ped_id, pro_id e ppr_quantidade devem ser números inteiros positivos.',
      });
    }

    try {
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
    const { ped_id, pro_id, ppr_quantidade } = req.body;
    const id = parseInt(req.params.id, 10);

    if (!isPositiveInteger(id)) {
      return res.status(400).json({ error: 'ID inválido.' });
    }

    if (
      (ped_id !== undefined && !isPositiveInteger(ped_id)) ||
      (pro_id !== undefined && !isPositiveInteger(pro_id)) ||
      (ppr_quantidade !== undefined && !isPositiveInteger(ppr_quantidade))
    ) {
      return res.status(400).json({
        error:
          'Campos ped_id, pro_id e ppr_quantidade devem ser números inteiros positivos.',
      });
    }

    if (!ped_id && !pro_id && !ppr_quantidade) {
      return res
        .status(400)
        .json({ error: 'Nenhum campo fornecido para atualização.' });
    }

    try {
      const registroAtualizado = await pedidoProdutoRepository.update(id, {
        ped_id,
        pro_id,
        ppr_quantidade,
      });

      registroAtualizado
        ? res.json(registroAtualizado)
        : res.status(404).json({ error: 'Registro não encontrado.' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar registro.' });
    }
  },

  // Remove registro
  delete: async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (!isPositiveInteger(id)) {
      return res.status(400).json({ error: 'ID inválido.' });
    }

    try {
      const registroDeletado = await pedidoProdutoRepository.delete(id);
      registroDeletado
        ? res.json({ message: 'Registro deletado com sucesso.' })
        : res.status(404).json({ error: 'Registro não encontrado.' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao deletar registro.' });
    }
  },
};

module.exports = pedidoProdutoController;
