const chartRepository = require('../repositories/chartRepository');

const chartController = {
  // Gráfico 1: Comandas por dia da semana
  getComandasPorDiaSemana: async (req, res) => {
    try {
      const { dataInicio, dataFim } = req.query;
      const result = await chartRepository.getComandasPorDiaSemana(dataInicio, dataFim);
      res.json(result); // Retorna array de objetos: [{dia_semana: "Segunda", quantidade: 10}, ...]
    } catch (error) {
      console.error('Erro no chartController.getComandasPorDiaSemana:', error);
      res.status(500).json([]);
    }
  },

  // Gráfico 2: Top 10 produtos mais vendidos
  getTopProdutos: async (req, res) => {
    try {
      const { dataInicio, dataFim } = req.query;
      const result = await chartRepository.getTopProdutos(dataInicio, dataFim);
      res.json(result); // Retorna array de objetos: [{produto: "X-Burger", quantidade_vendida: 15, faturamento_total: 150.00}, ...]
    } catch (error) {
      console.error('Erro no chartController.getTopProdutos:', error);
      res.status(500).json([]);
    }
  },

  // Gráfico 3: Faturamento diário
  getFaturamentoDiario: async (req, res) => {
    try {
      const { dataInicio, dataFim } = req.query;
      const result = await chartRepository.getFaturamentoDiario(dataInicio, dataFim);
      res.json(result); // Retorna array de objetos: [{data: "2023-01-01", faturamento: 1000.50, comandas_atendidas: 15}, ...]
    } catch (error) {
      console.error('Erro no chartController.getFaturamentoDiario:', error);
      res.status(500).json([]);
    }
  },

  // Gráfico 4: Distribuição por formas de pagamento
  getFormasPagamento: async (req, res) => {
    try {
      const { dataInicio, dataFim } = req.query;
      const result = await chartRepository.getFormasPagamento(dataInicio, dataFim);
      res.json(result); // Retorna array de objetos: [{forma_pagamento: "Cartão", quantidade_pedidos: 20, total_faturado: 500.00, percentual: 50}, ...]
    } catch (error) {
      console.error('Erro no chartController.getFormasPagamento:', error);
      res.status(500).json([]);
    }
  },

  // Gráfico 5: Média de valor por comanda
  getMediaComanda: async (req, res) => {
    try {
      const { dataInicio, dataFim } = req.query;
      const result = await chartRepository.getMediaComanda(dataInicio, dataFim);
      res.json(result); // Retorna array de objetos: [{data: "2023-01-01", total_comandas: 10, faturamento_total: 1000.00, media_por_comanda: 100.00}, ...]
    } catch (error) {
      console.error('Erro no chartController.getMediaComanda:', error);
      res.status(500).json([]);
    }
  },

  // Gráfico 6: Ocupação de mesas
  getOcupacaoMesas: async (req, res) => {
    try {
      const { dataInicio, dataFim } = req.query;
      const result = await chartRepository.getOcupacaoMesas(dataInicio, dataFim);
      res.json(result); // Retorna array de objetos: [{local_mesa: "Área interna", total_comandas: 15, percentual: 60}, ...]
    } catch (error) {
      console.error('Erro no chartController.getOcupacaoMesas:', error);
      res.status(500).json([]);
    }
  },

  // Gráfico 7: Vendas por categoria de produto
  getVendasPorCategoria: async (req, res) => {
    try {
      const { dataInicio, dataFim } = req.query;
      const result = await chartRepository.getVendasPorCategoria(dataInicio, dataFim);
      res.json(result); // Retorna array de objetos: [{categoria: "Bebidas", quantidade_vendida: 50, faturamento: 500.00}, ...]
    } catch (error) {
      console.error('Erro no chartController.getVendasPorCategoria:', error);
      res.status(500).json([]);
    }
  }
};

module.exports = chartController;