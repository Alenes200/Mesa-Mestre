const client = require('../db/postgresql');

const formaPagamentoRepository = {
  getAll: async () => {
    try {
      const query = 'SELECT * FROM TBL_FORMA_PAGAMENTO ORDER BY FPA_ID';
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar formas de pagamento:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const query = 'SELECT * FROM TBL_FORMA_PAGAMENTO WHERE FPA_ID = $1';
      const result = await client.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao buscar forma de pagamento por ID:', error);
      throw error;
    }
  },

  create: async (descricao) => {
    try {
      const query = `
        INSERT INTO TBL_FORMA_PAGAMENTO (FPA_DESCRICAO)
        VALUES ($1)
        RETURNING *;
      `;
      const result = await client.query(query, [descricao]);
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao criar forma de pagamento:', error);
      throw error;
    }
  },

  update: async (id, descricao) => {
    try {
      const query = `
        UPDATE TBL_FORMA_PAGAMENTO
        SET FPA_DESCRICAO = $1
        WHERE FPA_ID = $2
        RETURNING *;
      `;
      const result = await client.query(query, [descricao, id]);
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao atualizar forma de pagamento:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const query = 'DELETE FROM TBL_FORMA_PAGAMENTO WHERE FPA_ID = $1 RETURNING *';
      const result = await client.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao deletar forma de pagamento:', error);
      throw error;
    }
  }
};

module.exports = formaPagamentoRepository;