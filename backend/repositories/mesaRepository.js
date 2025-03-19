const client = require('../db/postgresql');

const mesasRepository = {
  getAll: async () => {
    try {
      const query = 'SELECT * FROM TBL_MESA WHERE MES_STATUS >= 1';
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar mesas:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const query =
        'SELECT * FROM TBL_MESA WHERE MES_ID = $1 AND MES_STATUS >= 1';
      const result = await client.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao buscar mesa por ID:', error);
      throw error;
    }
  },

  create: async (mesa) => {
    const { capacidade, descricao, local } = mesa;

    try {
      const query = `
                INSERT INTO TBL_MESA (MES_CAPACIDADE, MES_DESCRICAO, MES_LOCAL)
                VALUES ($1, $2, $3)
                RETURNING *;
            `;

      const values = [capacidade, descricao, local];
      const result = await client.query(query, values);

      return result.rows[0];
    } catch (error) {
      console.error('Erro ao criar mesa no banco de dados:', error);
      throw error;
    }
  },

  update: async (id, mesa) => {
    const { capacidade, descricao, local, status } = mesa;

    try {
      const query = `
                UPDATE TBL_MESA
                SET MES_CAPACIDADE = COALESCE($1, MES_CAPACIDADE),
                    MES_DESCRICAO = COALESCE($2, MES_DESCRICAO),
                    MES_LOCAL = COALESCE($3, MES_LOCAL),
                    MES_STATUS = COALESCE($4, MES_STATUS)
                WHERE MES_ID = $5
                RETURNING *;
            `;

      const values = [capacidade, descricao, local, status, id];
      const result = await client.query(query, values);

      return result.rows[0];
    } catch (error) {
      console.error('Erro ao atualizar mesa:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const query = `
                UPDATE TBL_MESA
                SET MES_STATUS = -1
                WHERE MES_ID = $1
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
      const query = 'SELECT * FROM TBL_MESA WHERE MES_ID = $1';
      const result = await client.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao buscar mesa por ID (ignorando status):', error);
      throw error;
    }
  },

  getByLocal: async (local) => {
    try {
      const query = `
        SELECT * FROM TBL_MESA
        WHERE MES_LOCAL ILIKE '%' || $1 || '%'
        AND MES_STATUS >= 1
      `;
      const result = await client.query(query, [local]);
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar mesas por tipo:', error);
      throw error;
    }
  },
};

module.exports = mesasRepository;
