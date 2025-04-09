const formaPagamentoRepository = require('../repositories/formaPagamentoRepository');

const formaPagamentoController = {
  list: async (req, res) => {
    try {
      const formasPagamento = await formaPagamentoRepository.getAll();
      const formattedData = formasPagamento.map((item) => ({
        codigo: `FPA_${item.fpa_id}`,
        descricao: item.fpa_descricao,
      }));
      res.json(formattedData);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao listar formas de pagamento.' });
    }
  },

  get: async (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido.' });
    }

    try {
      const formaPagamento = await formaPagamentoRepository.getById(id);
      if (formaPagamento) {
        res.json({
          codigo: `FPA_${formaPagamento.fpa_id}`,
          descricao: formaPagamento.fpa_descricao,
        });
      } else {
        res.status(404).json({ error: 'Forma de pagamento não encontrada.' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar forma de pagamento.' });
    }
  },

  create: async (req, res) => {
    try {
      const { descricao } = req.body;

      const validationError = validateDescricao(descricao);
      if (validationError) {
        return res.status(400).json({ error: validationError });
      }

      const novaFormaPagamento =
        await formaPagamentoRepository.create(descricao);
      res.status(201).json({
        codigo: `FPA_${novaFormaPagamento.fpa_id}`,
        descricao: novaFormaPagamento.fpa_descricao,
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar forma de pagamento.' });
    }
  },

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
      const formaPagamentoAtualizada = await formaPagamentoRepository.update(
        id,
        descricao
      );
      if (formaPagamentoAtualizada) {
        res.json({
          codigo: `FPA_${formaPagamentoAtualizada.fpa_id}`,
          descricao: formaPagamentoAtualizada.fpa_descricao,
        });
      } else {
        res.status(404).json({ error: 'Forma de pagamento não encontrada.' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar forma de pagamento.' });
    }
  },

  delete: async (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido.' });
    }

    try {
      const formaPagamentoDeletada = await formaPagamentoRepository.delete(id);
      if (formaPagamentoDeletada) {
        res.json({
          message: 'Forma de pagamento removida com sucesso.',
          formaPagamento: {
            codigo: `FPA_${formaPagamentoDeletada.fpa_id}`,
            descricao: formaPagamentoDeletada.fpa_descricao,
          },
        });
      } else {
        res.status(404).json({ error: 'Forma de pagamento não encontrada.' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Erro ao remover forma de pagamento.' });
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

module.exports = formaPagamentoController;
