const client = require('../db/postgresql');

const pedidoProdutoRepository = {
  // Lista todos os registros
  getAll: async () => {
    const query = 'SELECT * FROM TBL_PEDIDO_PRODUTO';
    const result = await client.query(query);
    return result.rows;
  },

  // Busca por ID do relacionamento
  getById: async (id) => {
    const query = 'SELECT * FROM TBL_PEDIDO_PRODUTO WHERE PPR_ID = $1';
    const result = await client.query(query, [id]);
    return result.rows[0];
  },

  // Busca produtos de um pedido específico
  getByPedidoId: async (pedidoId) => {
    const query = `
      SELECT p.*, pp.PPR_QUANTIDADE 
      FROM TBL_PRODUTO p
      JOIN TBL_PEDIDO_PRODUTO pp ON p.PRO_ID = pp.PRO_ID
      WHERE pp.PED_ID = $1
    `;
    const result = await client.query(query, [pedidoId]);
    return result.rows;
  },

  // Cria um novo registro
  create: async (pedidoProduto) => {
    const { ped_id, pro_id, ppr_quantidade } = pedidoProduto;
    const query = `
      INSERT INTO TBL_PEDIDO_PRODUTO (PED_ID, PRO_ID, PPR_QUANTIDADE)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const result = await client.query(query, [ped_id, pro_id, ppr_quantidade]);
    return result.rows[0];
  },

  // Atualiza quantidade ou relacionamento
  update: async (id, pedidoProduto) => {
    const { ped_id, pro_id, ppr_quantidade } = pedidoProduto;
    const query = `
      UPDATE TBL_PEDIDO_PRODUTO
      SET 
        PED_ID = COALESCE($1, PED_ID),
        PRO_ID = COALESCE($2, PRO_ID),
        PPR_QUANTIDADE = COALESCE($3, PPR_QUANTIDADE)
      WHERE PPR_ID = $4
      RETURNING *;
    `;
    const result = await client.query(query, [
      ped_id ?? null,
      pro_id ?? null,
      ppr_quantidade ?? null,
      id,
    ]);
    return result.rows[0];
  },

  // Remove um registro
  delete: async (id) => {
    const query =
      'DELETE FROM TBL_PEDIDO_PRODUTO WHERE PPR_ID = $1 RETURNING *';
    const result = await client.query(query, [id]);
    return result.rows[0];
  },
};

module.exports = pedidoProdutoRepository;
