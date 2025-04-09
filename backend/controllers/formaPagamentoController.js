const formaPagamentoRepository = require('../repositories/formaPagamentoRepository');

const formaPagamentoController = {
  list: async (req, res) => {
    try {
      const formasPagamento = await formaPagamentoRepository.getAll();
      
      // Mapeia os dados para o formato esperado pelo frontend
      const formattedData = formasPagamento.map(item => ({
        codigo: `FPA_${item.fpa_id}`, // Prefixo FPA_ + ID
        descricao: item.fpa_descricao
      }));
      
      res.json(formattedData);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao listar formas de pagamento.' });
    }
  },

  get: async (req, res) => {
    try {
      const formaPagamento = await formaPagamentoRepository.getById(req.params.id);
      if (formaPagamento) {
        res.json({
          codigo: `FPA_${formaPagamento.fpa_id}`,
          descricao: formaPagamento.fpa_descricao
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
      
      if (!descricao) {
        return res.status(400).json({ error: 'A descrição é obrigatória.' });
      }

      const novaFormaPagamento = await formaPagamentoRepository.create(descricao);
      res.status(201).json({
        codigo: `FPA_${novaFormaPagamento.fpa_id}`,
        descricao: novaFormaPagamento.fpa_descricao
      });
    } catch (error) {
      console.error('Erro ao criar forma de pagamento:', error);
      res.status(500).json({ error: 'Erro ao criar forma de pagamento.' });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { descricao } = req.body;

      if (!descricao) {
        return res.status(400).json({ error: 'A descrição é obrigatória.' });
      }

      const formaPagamentoAtualizada = await formaPagamentoRepository.update(id, descricao);
      
      if (formaPagamentoAtualizada) {
        res.json({
          codigo: `FPA_${formaPagamentoAtualizada.fpa_id}`,
          descricao: formaPagamentoAtualizada.fpa_descricao
        });
      } else {
        res.status(404).json({ error: 'Forma de pagamento não encontrada.' });
      }
    } catch (error) {
      console.error('Erro ao atualizar forma de pagamento:', error);
      res.status(500).json({ error: 'Erro ao atualizar forma de pagamento.' });
    }
  },

  delete: async (req, res) => {
    try {
      const formaPagamentoDeletada = await formaPagamentoRepository.delete(req.params.id);
      
      if (formaPagamentoDeletada) {
        res.json({
          message: 'Forma de pagamento removida com sucesso.',
          formaPagamento: {
            codigo: `FPA_${formaPagamentoDeletada.fpa_id}`,
            descricao: formaPagamentoDeletada.fpa_descricao
          }
        });
      } else {
        res.status(404).json({ error: 'Forma de pagamento não encontrada.' });
      }
    } catch (error) {
      console.error('Erro ao remover forma de pagamento:', error);
      res.status(500).json({ error: 'Erro ao remover forma de pagamento.' });
    }
  }
};

module.exports = formaPagamentoController;