const comandaRepository = require('../repositories/comandaRepository');

const comandaController = {
  // Lista todas as comandas
  listAll: async (req, res) => {
    try {
      const comandas = await comandaRepository.getAll();
      res.json(comandas);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao listar todas as comandas.' });
    }
  },

  listActive: async (req, res) => {
    try {
      const comandas = await comandaRepository.getActive();
      res.json(comandas);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao listar comandas ativas.' });
    }
  },

  get: async (req, res) => {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    try {
      const comanda = await comandaRepository.getById(id);
      if (comanda) {
        res.json(comanda);
      } else {
        res.status(404).json({ error: 'Comanda não encontrada.' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar comanda.' });
    }
  },

  create: async (req, res) => {
    try {
      const { mes_id, com_data_inicio, com_data_fim, com_status } = req.body;

      const errors = [];

      if (!mes_id || isNaN(mes_id)) {
        errors.push('ID da mesa inválido.');
      }

      if (!com_data_inicio || isNaN(Date.parse(com_data_inicio))) {
        errors.push('Data de início inválida.');
      }

      if (com_data_fim && isNaN(Date.parse(com_data_fim))) {
        errors.push('Data de fim inválida.');
      }

      if (
        com_status &&
        !['ativo', 'inativo'].includes(com_status.toLowerCase())
      ) {
        errors.push('Status da comanda deve ser "ativo" ou "inativo".');
      }

      if (errors.length > 0) {
        return res.status(400).json({ error: errors });
      }

      const novaComanda = await comandaRepository.create({
        mes_id,
        com_data_inicio,
        com_data_fim: com_data_fim || null,
        com_status: com_status?.toLowerCase() || 'ativo',
      });

      res.status(201).json(novaComanda);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar comanda.' });
    }
  },

  update: async (req, res) => {
    const { id } = req.params;
    const { mes_id, com_data_inicio, com_data_fim, com_status } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'ID da comanda inválido.' });
    }

    const errors = [];

    if (mes_id && isNaN(mes_id)) {
      errors.push('ID da mesa inválido.');
    }

    if (com_data_inicio && isNaN(Date.parse(com_data_inicio))) {
      errors.push('Data de início inválida.');
    }

    if (com_data_fim && isNaN(Date.parse(com_data_fim))) {
      errors.push('Data de fim inválida.');
    }

    if (
      com_status &&
      !['ativo', 'inativo'].includes(com_status.toLowerCase())
    ) {
      errors.push('Status da comanda deve ser "ativo" ou "inativo".');
    }

    if (errors.length > 0) {
      return res.status(400).json({ error: errors });
    }

    try {
      const comandaAtualizada = await comandaRepository.update(id, {
        mes_id,
        com_data_inicio,
        com_data_fim,
        com_status: com_status?.toLowerCase(),
      });

      if (comandaAtualizada) {
        res.json(comandaAtualizada);
      } else {
        res.status(404).json({ error: 'Comanda não encontrada.' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar comanda.' });
    }
  },

  delete: async (req, res) => {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    try {
      const comandaDeletada = await comandaRepository.delete(id);

      if (comandaDeletada) {
        res.json({
          message: 'Comanda deletada com sucesso.',
          comanda: comandaDeletada,
        });
      } else {
        res.status(404).json({ error: 'Comanda não encontrada.' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Erro ao deletar comanda.' });
    }
  },

  getProdutosByMesaId: async (req, res) => {
    const mesaId = req.params.mesaId;

    if (!mesaId || isNaN(mesaId)) {
      return res.status(400).json({ error: 'ID da mesa inválido' });
    }

    try {
      const produtos = await comandaRepository.getProdutosByMesaId(mesaId);

      if (!produtos || produtos.length === 0) {
        return res
          .status(404)
          .json({ message: 'Nenhum produto encontrado para esta mesa' });
      }

      res.json(produtos);
    } catch (error) {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  getPedidosComandaAtiva: async (req, res) => {
    const { mesaId } = req.params;

    if (!mesaId || isNaN(mesaId)) {
      return res.status(400).json({
        success: false,
        message: 'ID da mesa inválido',
      });
    }

    try {
      const pedidos = await comandaRepository.getPedidosByComandaAtiva(mesaId);

      return res.json({
        success: true,
        data: pedidos,
        message: 'Pedidos obtidos com sucesso',
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Erro interno ao buscar pedidos',
      });
    }
  },
};

module.exports = comandaController;
