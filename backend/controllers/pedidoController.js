const pedidoRepository = require('../repositories/pedidoRepository');

const pedidoController = {
  // Lista todos os pedidos (ativos e inativos)
  listAll: async (req, res) => {
    try {
      const pedidos = await pedidoRepository.getAll();
      res.json(pedidos);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao listar todos os pedidos.' });
    }
  },

  // Lista apenas os pedidos ativos
  listActive: async (req, res) => {
    try {
      const pedidos = await pedidoRepository.getActive();
      res.json(pedidos);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao listar pedidos ativos.' });
    }
  },

  // Busca um pedido pelo ID
  get: async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) {
      return res
        .status(400)
        .json({ error: 'ID inválido. Deve ser um número inteiro positivo.' });
    }

    try {
      const pedido = await pedidoRepository.getById(id);
      if (pedido) {
        res.json(pedido);
      } else {
        res.status(404).json({ error: 'Pedido não encontrado.' });
      }
    } catch (error) {
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
        return res.status(400).json({
          error:
            'Campos obrigatórios faltando: com_id, ped_descricao e ped_preco_total.',
        });
      }

      // Validação do preco_total
      const preco = Number(ped_preco_total);
      if (isNaN(preco) || preco <= 0) {
        return res
          .status(400)
          .json({ error: 'ped_preco_total deve ser um número positivo.' });
      }

      if (!/^\d+(\.\d{1,2})?$/.test(ped_preco_total.toString())) {
        return res
          .status(400)
          .json({ error: 'ped_preco_total deve ter até duas casas decimais.' });
      }

      const novoPedido = await pedidoRepository.create({
        com_id,
        ped_descricao: ped_descricao.trim(),
        ped_status: ped_status ?? 1,
        ped_preco_total: preco,
        fpa_id,
      });

      res.status(201).json(novoPedido);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar pedido.' });
    }
  },

  // Atualiza um pedido (nenhum campo obrigatório)
  update: async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) {
      return res
        .status(400)
        .json({ error: 'ID inválido. Deve ser um número inteiro positivo.' });
    }

    try {
      const updates = req.body;

      if (Object.keys(updates).length === 0) {
        return res
          .status(400)
          .json({ error: 'Nenhum campo fornecido para atualização.' });
      }

      // Validações se `ped_preco_total` estiver presente
      if (updates.ped_preco_total !== undefined) {
        const preco = Number(updates.ped_preco_total);
        if (isNaN(preco) || preco <= 0) {
          return res
            .status(400)
            .json({ error: 'ped_preco_total deve ser um número positivo.' });
        }

        if (!/^\d+(\.\d{1,2})?$/.test(updates.ped_preco_total.toString())) {
          return res.status(400).json({
            error: 'ped_preco_total deve ter até duas casas decimais.',
          });
        }

        updates.ped_preco_total = preco;
      }

      const pedidoAtualizado = await pedidoRepository.update(id, updates);

      if (pedidoAtualizado) {
        res.json(pedidoAtualizado);
      } else {
        res.status(404).json({ error: 'Pedido não encontrado.' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar pedido.' });
    }
  },

  // Deleta logicamente um pedido
  delete: async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) {
      return res
        .status(400)
        .json({ error: 'ID inválido. Deve ser um número inteiro positivo.' });
    }

    try {
      const pedidoDeletado = await pedidoRepository.delete(id);

      if (pedidoDeletado) {
        res.json({
          message: 'Pedido deletado com sucesso.',
          pedido: pedidoDeletado,
        });
      } else {
        res.status(404).json({ error: 'Pedido não encontrado.' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Erro ao deletar pedido.' });
    }
  },
};

module.exports = pedidoController;
