const client = require('../db/postgresql');

const locaisRepository = {
  getAll: async () => {
    try {
      const query =
        "SELECT * FROM TBL_LOCAL WHERE LOC_DESCRICAO != 'Todas' ORDER BY LOC_ID";
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar locais:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const query = 'SELECT * FROM TBL_LOCAL WHERE LOC_ID = $1';
      const result = await client.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao buscar local por ID:', error);
      throw error;
    }
  },

  create: async (local) => {
    const { descricao } = local;

    try {
      const query = `
                    INSERT INTO TBL_LOCAL (LOC_DESCRICAO)
                    VALUES ($1)
                    RETURNING *;
                `;

      const values = [descricao];
      const result = await client.query(query, values);

      return result.rows[0];
    } catch (error) {
      console.error('Erro ao criar local no banco de dados:', error);
      throw error;
    }
  },

  update: async (id, descricao) => {
    try {
      const query = `
        UPDATE TBL_LOCAL
        SET LOC_DESCRICAO = $1
        WHERE LOC_ID = $2
        RETURNING *;
      `;
      const result = await client.query(query, [descricao, id]);
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao atualizar local:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const query = 'DELETE FROM TBL_LOCAL WHERE LOC_ID = $1 RETURNING *';
      const result = await client.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao deletar local:', error);
      throw error;
    }
  },
};

module.exports = locaisRepository;
