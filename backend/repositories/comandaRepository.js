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

  getProdutosByMesaId: async (mesaId) => {
    try {
      const query = `
        SELECT 
          p.pro_id as id,
          p.pro_nome as nome,
          p.pro_preco as preco_unitario,
          pp.ppr_quantidade as quantidade,
          (p.pro_preco * pp.ppr_quantidade) as total,
          ped.ped_id as pedido_id
        FROM 
          tbl_pedido_produto pp
        JOIN 
          tbl_produto p ON pp.pro_id = p.pro_id
        JOIN 
          tbl_pedido ped ON pp.ped_id = ped.ped_id
        JOIN 
          tbl_comanda com ON ped.com_id = com.com_id
        WHERE 
          com.mes_id = $1 
          AND com.com_status >= 0
          AND ped.ped_status >= 0
          AND p.pro_status >= 0
        ORDER BY 
          pp.ped_id
      `;
      
      const result = await client.query(query, [mesaId]);
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar produtos da mesa:', error);
      throw error;
    }
  },

  // Adicione este método ao seu comandaRepository
  getPedidosByComandaAtiva: async (mesaId) => {
    // Defina a query fora do bloco try para poder usá-la no catch
    const queryText = `
        SELECT 
            p.ped_id as pedido_id,
            p.ped_created_at as data_pedido,
            json_agg(
                json_build_object(
                    'nome', prod.pro_nome,
                    'quantidade', pp.ppr_quantidade,
                    'preco_unitario', prod.pro_preco
                )
            ) as itens,
            SUM(prod.pro_preco * pp.ppr_quantidade)::float as total
        FROM 
            tbl_comanda c
        JOIN 
            tbl_pedido p ON c.com_id = p.com_id
        JOIN 
            tbl_pedido_produto pp ON p.ped_id = pp.ped_id
            
        JOIN 
            tbl_produto prod ON pp.pro_id = prod.pro_id
        WHERE 
            c.mes_id = $1
            AND c.com_status >= 0
            AND p.ped_status >= 0
            AND prod.pro_status >= 0
        GROUP BY 
            p.ped_id, p.ped_created_at
        ORDER BY 
            p.ped_created_at DESC
    `;

    try {
        if (!mesaId || isNaN(mesaId)) {
            throw new Error('ID da mesa inválido');
        }

        const result = await client.query(queryText, [parseInt(mesaId)]);
        
        return result.rows.map(row => ({
            pedido_id: row.pedido_id,
            data: row.data_pedido,
            total: row.total,
            itens: row.itens
        }));
        
    } catch (error) {
        console.error('Erro detalhado ao buscar pedidos:', {
            message: error.message,
            stack: error.stack,
            query: queryText,  // Agora queryText está definida
            params: [mesaId]
        });
        throw new Error(`Falha ao buscar pedidos: ${error.message}`);
    }
  }
};

module.exports = comandaRepository;
