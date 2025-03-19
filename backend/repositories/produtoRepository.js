const client = require('../db/postgresql');

const produtosRepository = {
  getAll: async () => {
    try {
      const query = 'SELECT * FROM TBL_PRODUTO WHERE PRO_STATUS >= 1';
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const query =
        'SELECT * FROM TBL_PRODUTO WHERE PRO_ID = $1 AND PRO_STATUS >= 1';
      const result = await client.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao buscar produto por ID:', error);
      throw error;
    }
  },

  create: async (produto) => {
    const { nome, descricao, local, tipo, preco, imagem } = produto;

    try {
      const query = `
                INSERT INTO TBL_PRODUTO (PRO_NOME, PRO_DESCRICAO, PRO_LOCAL, PRO_TIPO, PRO_PRECO, PRO_IMAGEM)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *;
            `;

      const values = [nome, descricao, local, tipo, preco, imagem];
      const result = await client.query(query, values);

      return result.rows[0];
    } catch (error) {
      console.error('Erro ao criar produto no banco de dados:', error);
      throw error;
    }
  },

  update: async (id, produto) => {
    const { nome, descricao, local, tipo, preco, imagem, status } = produto;

    try {
      const query = `
                UPDATE TBL_PRODUTO
                SET PRO_NOME = COALESCE($1, PRO_NOME),
                    PRO_DESCRICAO = COALESCE($2, PRO_DESCRICAO),
                    PRO_LOCAL = COALESCE($3, PRO_LOCAL),
                    PRO_TIPO = COALESCE($4, PRO_TIPO),
                    PRO_PRECO = COALESCE($5, PRO_PRECO),
                    PRO_IMAGEM = COALESCE($6, PRO_IMAGEM),
                    PRO_STATUS = COALESCE($7, PRO_STATUS)
                WHERE PRO_ID = $8
                RETURNING *;
            `;

      const values = [nome, descricao, local, tipo, preco, imagem, status, id];
      const result = await client.query(query, values);

      return result.rows[0];
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const query = `
                UPDATE TBL_PRODUTO
                SET PRO_STATUS = -1
                WHERE PRO_ID = $1
                RETURNING *;
            `;
      const result = await client.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao realizar delete lógico:', error);
      throw error;
    }
  },

  getByIdIgnoreStatus: async (id) => {
    try {
      const query = 'SELECT * FROM TBL_PRODUTO WHERE PRO_ID = $1';
      const result = await client.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao buscar produto por ID (ignorando status):', error);
      throw error;
    }
  },

  getByTipo: async (tipo) => {
    try {
      const query =
        'SELECT * FROM TBL_PRODUTO WHERE PRO_TIPO = $1 AND PRO_STATUS >= 1';
      const result = await client.query(query, [tipo]);
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar produtos por tipo:', error);
      throw error;
    }
  },
};

module.exports = produtosRepository;
