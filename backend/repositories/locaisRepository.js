const client = require('../db/postgresql');

const locaisRepository = {
  getAll: async () => {
    try {
      const query =
        "SELECT * FROM TBL_LOCAL WHERE LOC_DESCRICAO != 'Todas' ORDER BY LOC_ID";
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  getAllTodasPrimeiro: async () => {
    try {
      const query =
        "SELECT * FROM tbl_local ORDER BY CASE WHEN loc_descricao = 'Todas' THEN 0 ELSE 1 END,loc_id;";
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const query = 'SELECT * FROM TBL_LOCAL WHERE LOC_ID = $1';
      const result = await client.query(query, [id]);
      return result.rows[0];
    } catch (error) {
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
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const query = 'DELETE FROM TBL_LOCAL WHERE LOC_ID = $1 RETURNING *';
      const result = await client.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },
};

module.exports = locaisRepository;