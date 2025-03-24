const client = require('../db/postgresql');

const chartRepository = {
  // Gráfico 1: Comandas por dia da semana
  getComandasPorDiaSemana: async (dataInicio, dataFim) => {
    try {
      const query = `
        WITH dias_semana AS (
          SELECT 0 AS dia_numero, 'Domingo' AS dia_semana
          UNION SELECT 1, 'Segunda-feira'
          UNION SELECT 2, 'Terça-feira'
          UNION SELECT 3, 'Quarta-feira'
          UNION SELECT 4, 'Quinta-feira'
          UNION SELECT 5, 'Sexta-feira'
          UNION SELECT 6, 'Sábado'
        ),
        comandas_filtradas AS (
          SELECT 
            EXTRACT(DOW FROM com_data_inicio) AS dia_numero,
            COUNT(*) AS quantidade
          FROM tbl_comanda
          ${dataInicio && dataFim ? `WHERE com_data_inicio BETWEEN $1 AND $2` : ''}
          GROUP BY EXTRACT(DOW FROM com_data_inicio)
        )
        SELECT 
          ds.dia_semana,
          ds.dia_numero,
          COALESCE(cf.quantidade, 0) AS quantidade
        FROM dias_semana ds
        LEFT JOIN comandas_filtradas cf ON ds.dia_numero = cf.dia_numero
        ORDER BY ds.dia_numero
      `;
      
      const params = [];
      if (dataInicio && dataFim) {
        params.push(dataInicio, dataFim);
      }

      const result = await client.query(query, params);
      return result.rows;

    } catch (error) {
      console.error('Erro no chartRepository.getComandasPorDiaSemana:', error);
      throw error;
    }
  },

  // Gráfico 2: Top 10 produtos mais vendidos
  getTopProdutos: async (dataInicio, dataFim) => {
    try {
      const query = `
        SELECT 
          p.pro_nome AS produto,
          p.pro_tipo AS categoria,
          SUM(pp.ppr_quantidade) AS quantidade_vendida,
          SUM(pp.ppr_quantidade * p.pro_preco) AS faturamento_total
        FROM tbl_pedido_produto pp
        JOIN tbl_produto p ON pp.pro_id = p.pro_id
        JOIN tbl_pedido ped ON pp.ped_id = ped.ped_id
        ${dataInicio && dataFim ? `WHERE ped.ped_created_at BETWEEN $1 AND $2` : ''}
        GROUP BY p.pro_nome, p.pro_tipo
        ORDER BY quantidade_vendida DESC
        LIMIT 10
      `;
      
      const params = [];
      if (dataInicio && dataFim) {
        params.push(dataInicio, dataFim);
      }

      const result = await client.query(query, params);
      return result.rows;

    } catch (error) {
      console.error('Erro no chartRepository.getTopProdutos:', error);
      throw error;
    }
  },

  // Gráfico 3: Faturamento diário
  getFaturamentoDiario: async (dataInicio, dataFim) => {
    try {
      const query = `
        SELECT 
          DATE_TRUNC('day', ped.ped_created_at) AS data,
          SUM(ped.ped_preco_total) AS faturamento,
          COUNT(DISTINCT ped.com_id) AS comandas_atendidas
        FROM tbl_pedido ped
        ${dataInicio && dataFim ? `WHERE ped.ped_created_at BETWEEN $1 AND $2` : ''}
        GROUP BY DATE_TRUNC('day', ped.ped_created_at)
        ORDER BY data
      `;
      
      const params = [];
      if (dataInicio && dataFim) {
        params.push(dataInicio, dataFim);
      }

      const result = await client.query(query, params);
      return result.rows;

    } catch (error) {
      console.error('Erro no chartRepository.getFaturamentoDiario:', error);
      throw error;
    }
  },

  // Gráfico 4: Distribuição por formas de pagamento
  getFormasPagamento: async (dataInicio, dataFim) => {
    try {
      const query = `
        SELECT 
          fp.fpa_descricao AS forma_pagamento,
          COUNT(ped.ped_id) AS quantidade_pedidos,
          SUM(ped.ped_preco_total) AS total_faturado,
          ROUND(100.0 * SUM(ped.ped_preco_total) / 
            NULLIF((SELECT SUM(ped2.ped_preco_total) 
             FROM tbl_pedido ped2
             ${dataInicio && dataFim ? `WHERE ped2.ped_created_at BETWEEN $3 AND $4` : ''}), 0), 2) AS percentual
        FROM tbl_pedido ped
        JOIN tbl_forma_pagamento fp ON ped.fpa_id = fp.fpa_id
        ${dataInicio && dataFim ? `WHERE ped.ped_created_at BETWEEN $1 AND $2` : ''}
        GROUP BY fp.fpa_descricao
        ORDER BY total_faturado DESC
      `;
      
      const params = [];
      if (dataInicio && dataFim) {
        params.push(dataInicio, dataFim, dataInicio, dataFim);
      }
  
      const result = await client.query(query, params);
      return result.rows;
  
    } catch (error) {
      console.error('Erro no chartRepository.getFormasPagamento:', error);
      throw error;
    }
  },

  // Gráfico 5: Média de valor por comanda
  getMediaComanda: async (dataInicio, dataFim) => {
    try {
      const query = `
        SELECT
          DATE_TRUNC('day', c.com_data_inicio) AS data,
          COUNT(DISTINCT c.com_id) AS total_comandas,
          SUM(p.ped_preco_total) AS faturamento_total,
          ROUND(SUM(p.ped_preco_total) / COUNT(DISTINCT c.com_id), 2) AS media_por_comanda
        FROM tbl_comanda c
        LEFT JOIN tbl_pedido p ON c.com_id = p.com_id
        ${dataInicio && dataFim ? `WHERE c.com_data_inicio BETWEEN $1 AND $2` : ''}
        GROUP BY DATE_TRUNC('day', c.com_data_inicio)
        ORDER BY data
      `;
      
      const params = [];
      if (dataInicio && dataFim) {
        params.push(dataInicio, dataFim);
      }

      const result = await client.query(query, params);
      return result.rows;

    } catch (error) {
      console.error('Erro no chartRepository.getMediaComanda:', error);
      throw error;
    }
  },

  // Gráfico 6: Ocupação de mesas
  getOcupacaoMesas: async (dataInicio, dataFim) => {
    try {
      const query = `
        SELECT
          m.mes_local AS local_mesa,
          COUNT(c.com_id) AS total_comandas,
          ROUND(100.0 * COUNT(c.com_id) / 
            (SELECT COUNT(*) FROM tbl_comanda c2
             ${dataInicio && dataFim ? `WHERE c2.com_data_inicio BETWEEN $3 AND $4` : ''}), 2) AS percentual
        FROM tbl_comanda c
        JOIN tbl_mesa m ON c.mes_id = m.mes_id
        ${dataInicio && dataFim ? `WHERE c.com_data_inicio BETWEEN $1 AND $2` : ''}
        GROUP BY m.mes_local
        ORDER BY total_comandas DESC
      `;
      
      const params = [];
      if (dataInicio && dataFim) {
        params.push(dataInicio, dataFim, dataInicio, dataFim);
      }

      const result = await client.query(query, params);
      return result.rows;

    } catch (error) {
      console.error('Erro no chartRepository.getOcupacaoMesas:', error);
      throw error;
    }
  },

  // Gráfico 7: Vendas por categoria de produto
  getVendasPorCategoria: async (dataInicio, dataFim) => {
    try {
      const query = `
        SELECT
          p.pro_tipo AS categoria,
          SUM(pp.ppr_quantidade) AS quantidade_vendida,
          SUM(pp.ppr_quantidade * p.pro_preco) AS faturamento
        FROM tbl_pedido_produto pp
        JOIN tbl_produto p ON pp.pro_id = p.pro_id
        JOIN tbl_pedido ped ON pp.ped_id = ped.ped_id
        ${dataInicio && dataFim ? `WHERE ped.ped_created_at BETWEEN $1 AND $2` : ''}
        GROUP BY p.pro_tipo
        ORDER BY faturamento DESC
      `;
      
      const params = [];
      if (dataInicio && dataFim) {
        params.push(dataInicio, dataFim);
      }

      const result = await client.query(query, params);
      return result.rows;

    } catch (error) {
      console.error('Erro no chartRepository.getVendasPorCategoria:', error);
      throw error;
    }
  }
};

module.exports = chartRepository;