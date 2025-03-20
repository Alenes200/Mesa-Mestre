const client = require('../db/postgresql');

const comandaRepository = {
  // Retorna todas as comandas (ativos e inativos)
  getAll: async () => {
    try {
      const query = 'SELECT * FROM TBL_COMANDA'; // Remove a condição de status
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar todas as comandas:', error);
      throw error;
    }
  },

  // Retorna apenas as comandas ativas
  getActive: async () => {
    try {
      const query = 'SELECT * FROM TBL_COMANDA WHERE COM_STATUS >= 1'; // Apenas comandas ativas
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar comandas ativas:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const query =
        'SELECT * FROM TBL_COMANDA WHERE COM_ID = $1 AND COM_STATUS >= 1';
      const result = await client.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao buscar comanda por ID:', error);
      throw error;
    }
  },

  create: async (comanda) => {
    const { mes_id, com_data_inicio, com_data_fim, com_status } = comanda;

    try {
      const query = `
        INSERT INTO TBL_COMANDA (MES_ID, COM_DATA_INICIO, COM_DATA_FIM, COM_STATUS)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;
      const values = [mes_id, com_data_inicio, com_data_fim, com_status];
      const result = await client.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao criar comanda:', error);
      throw error;
    }
  },

  update: async (id, comanda) => {
    const { mes_id, com_data_inicio, com_data_fim, com_status } = comanda;

    try {
      const query = `
        UPDATE TBL_COMANDA
        SET 
          MES_ID = COALESCE($1, MES_ID),
          COM_DATA_INICIO = COALESCE($2, COM_DATA_INICIO),
          COM_DATA_FIM = COALESCE($3, COM_DATA_FIM),
          COM_STATUS = COALESCE($4, COM_STATUS)
        WHERE COM_ID = $5
        RETURNING *;
      `;
      const values = [mes_id, com_data_inicio, com_data_fim, com_status, id];
      const result = await client.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao atualizar comanda:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const query = `
        UPDATE TBL_COMANDA
        SET COM_STATUS = -1
        WHERE COM_ID = $1
        RETURNING *;
      `;
      const result = await client.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao deletar comanda:', error);
      throw error;
    }
  },
};

module.exports = comandaRepository;
