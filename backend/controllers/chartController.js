const chartRepository = require('../repositories/chartRepository');

const chartController = {
  // Gráfico 1: Comandas por dia da semana
  getComandasPorDiaSemana: async (req, res) => {
    try {
      const { dataInicio, dataFim } = req.query;
      
      const result = await chartRepository.getComandasPorDiaSemana(dataInicio, dataFim);
      
      // Formatar os dados para o frontend
      const formattedData = {
        labels: result.map(item => item.dia_semana),
        datasets: [{
          label: 'Comandas por Dia',
          data: result.map(item => item.quantidade),
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      };
      
      res.json(formattedData);
    } catch (error) {
      console.error('Erro no chartController.getComandasPorDiaSemana:', error);
      res.status(500).json({ error: 'Erro ao buscar comandas por dia da semana.' });
    }
  },

  // Gráfico 2: Top 10 produtos mais vendidos
  getTopProdutos: async (req, res) => {
    try {
      const { dataInicio, dataFim } = req.query;
      const result = await chartRepository.getTopProdutos(dataInicio, dataFim);
      
      const formattedData = {
        labels: result.map(item => item.produto),
        datasets: [
          {
            label: 'Quantidade Vendida',
            data: result.map(item => item.quantidade_vendida),
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            yAxisID: 'y'
          },
          {
            label: 'Faturamento (R$)',
            data: result.map(item => item.faturamento_total),
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            yAxisID: 'y1',
            type: 'line'
          }
        ]
      };
      
      res.json(formattedData);
    } catch (error) {
      console.error('Erro no chartController.getTopProdutos:', error);
      res.status(500).json({ error: 'Erro ao buscar top produtos.' });
    }
  },

  // Gráfico 3: Faturamento diário
  getFaturamentoDiario: async (req, res) => {
    try {
      const { dataInicio, dataFim } = req.query;
      const result = await chartRepository.getFaturamentoDiario(dataInicio, dataFim);
      
      const formattedData = {
        labels: result.map(item => new Date(item.data).toLocaleDateString()),
        datasets: [
          {
            label: 'Faturamento (R$)',
            data: result.map(item => item.faturamento),
            backgroundColor: 'rgba(153, 102, 255, 0.5)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1
          },
          {
            label: 'Comandas Atendidas',
            data: result.map(item => item.comandas_atendidas),
            backgroundColor: 'rgba(255, 159, 64, 0.5)',
            borderColor: 'rgba(255, 159, 64, 1)',
            borderWidth: 1,
            type: 'line'
          }
        ]
      };
      
      res.json(formattedData);
    } catch (error) {
      console.error('Erro no chartController.getFaturamentoDiario:', error);
      res.status(500).json({ error: 'Erro ao buscar faturamento diário.' });
    }
  },

  // Gráfico 4: Distribuição por formas de pagamento
  getFormasPagamento: async (req, res) => {
    try {
      const { dataInicio, dataFim } = req.query;
      const result = await chartRepository.getFormasPagamento(dataInicio, dataFim);
      
      const formattedData = {
        labels: result.map(item => item.forma_pagamento),
        datasets: [
          {
            label: 'Total Faturado (R$)',
            data: result.map(item => item.total_faturado),
            backgroundColor: [
              'rgba(255, 99, 132, 0.7)',
              'rgba(54, 162, 235, 0.7)',
              'rgba(255, 206, 86, 0.7)',
              'rgba(75, 192, 192, 0.7)',
              'rgba(153, 102, 255, 0.7)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 1
          },
          {
            label: 'Percentual (%)',
            data: result.map(item => item.percentual),
            backgroundColor: 'rgba(201, 203, 207, 0.5)',
            borderColor: 'rgba(201, 203, 207, 1)',
            borderWidth: 1,
            type: 'bar'
          }
        ]
      };
      
      res.json(formattedData);
    } catch (error) {
      console.error('Erro no chartController.getFormasPagamento:', error);
      res.status(500).json({ error: 'Erro ao buscar formas de pagamento.' });
    }
  },

  // Gráfico 5: Média de valor por comanda
  getMediaComanda: async (req, res) => {
    try {
      const { dataInicio, dataFim } = req.query;
      const result = await chartRepository.getMediaComanda(dataInicio, dataFim);
      
      const formattedData = {
        labels: result.map(item => new Date(item.data).toLocaleDateString()),
        datasets: [
          {
            label: 'Média por Comanda (R$)',
            data: result.map(item => item.media_por_comanda),
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            tension: 0.1
          },
          {
            label: 'Total Comandas',
            data: result.map(item => item.total_comandas),
            backgroundColor: 'rgba(255, 159, 64, 0.5)',
            borderColor: 'rgba(255, 159, 64, 1)',
            borderWidth: 1,
            type: 'bar'
          }
        ]
      };
      
      res.json(formattedData);
    } catch (error) {
      console.error('Erro no chartController.getMediaComanda:', error);
      res.status(500).json({ error: 'Erro ao buscar média por comanda.' });
    }
  },

  // Gráfico 6: Ocupação de mesas
  getOcupacaoMesas: async (req, res) => {
    try {
      const { dataInicio, dataFim } = req.query;
      const result = await chartRepository.getOcupacaoMesas(dataInicio, dataFim);
      
      const formattedData = {
        labels: result.map(item => item.local_mesa),
        datasets: [{
          label: 'Ocupação de Mesas (%)',
          data: result.map(item => item.percentual),
          backgroundColor: 'rgba(255, 206, 86, 0.5)',
          borderColor: 'rgba(255, 206, 86, 1)',
          borderWidth: 1
        }]
      };
      
      res.json(formattedData);
    } catch (error) {
      console.error('Erro no chartController.getOcupacaoMesas:', error);
      res.status(500).json({ error: 'Erro ao buscar ocupação de mesas.' });
    }
  },

  // Gráfico 7: Vendas por categoria de produto
  getVendasPorCategoria: async (req, res) => {
    try {
      const { dataInicio, dataFim } = req.query;
      const result = await chartRepository.getVendasPorCategoria(dataInicio, dataFim);
      
      const formattedData = {
        labels: result.map(item => item.categoria),
        datasets: [
          {
            label: 'Faturamento (R$)',
            data: result.map(item => item.faturamento),
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          },
          {
            label: 'Quantidade Vendida',
            data: result.map(item => item.quantidade_vendida),
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            type: 'bar'
          }
        ]
      };
      
      res.json(formattedData);
    } catch (error) {
      console.error('Erro no chartController.getVendasPorCategoria:', error);
      res.status(500).json({ error: 'Erro ao buscar vendas por categoria.' });
    }
  }
};

module.exports = chartController;