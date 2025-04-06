const client = require('../db/postgresql');

const locaisRepository = {
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
};

module.exports = locaisRepository;
