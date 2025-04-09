const client = require('../db/postgresql');

const pedidoRepository = {
  // Retorna todos os pedidos (ativos e inativos)
  getAll: async () => {
    try {
      const query = 'SELECT * FROM TBL_PEDIDO';
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  // Retorna apenas os pedidos ativos
  getActive: async () => {
    try {
      const query = 'SELECT * FROM TBL_PEDIDO WHERE PED_STATUS >= 1';
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  // Busca um pedido pelo ID
  getById: async (id) => {
    try {
      const query =
        'SELECT * FROM TBL_PEDIDO WHERE PED_ID = $1 AND PED_STATUS >= 1';
      const result = await client.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Cria um novo pedido
  create: async (pedido) => {
    const { com_id, ped_descricao, ped_status, ped_preco_total, fpa_id } =
      pedido;

    try {
      const query = `
        INSERT INTO TBL_PEDIDO (
          COM_ID, PED_DESCRICAO, PED_STATUS, PED_PRECO_TOTAL, FPA_ID
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `;
      const values = [
        com_id,
        ped_descricao,
        ped_status,
        ped_preco_total,
        fpa_id,
      ];
      const result = await client.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Atualiza um pedido (nenhum campo é obrigatório)
  update: async (id, pedido) => {
    try {
      const query = `
        UPDATE TBL_PEDIDO
        SET 
          COM_ID = COALESCE($1, COM_ID),
          PED_DESCRICAO = COALESCE($2, PED_DESCRICAO),
          PED_STATUS = COALESCE($3, PED_STATUS),
          PED_PRECO_TOTAL = COALESCE($4, PED_PRECO_TOTAL),
          FPA_ID = COALESCE($5, FPA_ID)
        WHERE PED_ID = $6
        RETURNING *;
      `;

      const values = [
        pedido.com_id ?? null,
        pedido.ped_descricao ?? null,
        pedido.ped_status ?? null,
        pedido.ped_preco_total ?? null,
        pedido.fpa_id ?? null,
        id,
      ];

      const result = await client.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Deleta logicamente um pedido
  delete: async (id) => {
    try {
      const query = `
        UPDATE TBL_PEDIDO
        SET PED_STATUS = -1
        WHERE PED_ID = $1
        RETURNING *;
      `;
      const result = await client.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },
};

module.exports = pedidoRepository;
