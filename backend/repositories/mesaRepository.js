const client = require('../db/postgresql');

const mesasRepository = {
  getAll: async () => {
    try {
      const query = `
        SELECT MES.*, LOC.LOC_DESCRICAO
        FROM TBL_MESA AS MES
        INNER JOIN TBL_LOCAL AS LOC ON LOC.LOC_ID = MES.LOC_ID
        WHERE MES.MES_STATUS >= 0 
        ORDER BY MES.MES_ID
      `;

      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar mesas:', error);
      throw error;
    }
  },

  getInativas: async () => {
    try {
      const query =
        'SELECT * FROM TBL_MESA WHERE MES_STATUS = -1 ORDER BY MES_ID';
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar mesas:', error);
      throw error;
    }
  },

  getPesquisaArea: async (mes_id, mes_descricao, loc_descricao) => {
    try {
      const query = `
      SELECT * FROM TBL_MESA AS MES
      INNER JOIN TBL_LOCAL AS LOC ON LOC.LOC_ID = MES.LOC_ID
      WHERE (CAST(MES_ID AS TEXT) LIKE $1 OR UPPER(MES_DESCRICAO) LIKE UPPER($2)) 
      AND LOC.LOC_DESCRICAO LIKE $3 
      AND MES.MES_STATUS >= 0
      ORDER BY MES_ID;
        `;

      const values = [
        `%${mes_id}%`,
        `%${mes_descricao}%`,
        `%${loc_descricao}%`,
      ];
      const result = await client.query(query, values);
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar mesas:', error);
      throw error;
    }
  },

  getPesquisaAtivas: async (mes_id, mes_descricao) => {
    try {
      const query = `
      SELECT * FROM TBL_MESA WHERE (CAST(MES_ID AS TEXT) LIKE $1 OR UPPER(MES_DESCRICAO) LIKE UPPER($2)) 
      AND MES_STATUS >= 0 ORDER BY MES_ID;
        `;

      const values = [`%${mes_id}%`, `%${mes_descricao}%`];
      const result = await client.query(query, values);
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar mesas:', error);
      throw error;
    }
  },

  getPesquisaInativas: async (mes_id, mes_descricao) => {
    try {
      const query = `
      SELECT * FROM TBL_MESA WHERE (CAST(MES_ID AS TEXT) LIKE $1 OR UPPER(MES_DESCRICAO) LIKE UPPER($2)) 
      AND MES_STATUS = -1  ORDER BY MES_ID;
        `;

      const values = [`%${mes_id}%`, `%${mes_descricao}%`];
      const result = await client.query(query, values);
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar mesas:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const query = 'SELECT * FROM TBL_MESA WHERE MES_ID = $1 ORDER BY MES_ID';
      const result = await client.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao buscar mesa por ID:', error);
      throw error;
    }
  },

  getLocaisRestritos: async () => {
    try {
      const query =
        "SELECT LOC_DESCRICAO FROM TBL_LOCAL WHERE LOC_DESCRICAO != 'Todas' AND LOC_DESCRICAO != 'Inativas' ORDER BY LOC_ID";
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar os locais:', error);
      throw error;
    }
  },

  getTodosLocais: async () => {
    try {
      const query = 'SELECT LOC_DESCRICAO FROM TBL_LOCAL ORDER BY LOC_ID DESC;';
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar os locais:', error);
      throw error;
    }
  },

  create: async (mesa) => {
    const { nome, codigo, status, capacidade, descricao, local } = mesa;

    try {
      const query = `
                INSERT INTO TBL_MESA (MES_NOME, MES_CODIGO, MES_STATUS, MES_CAPACIDADE, MES_DESCRICAO, LOC_ID)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *;
            `;

      const values = [nome, codigo, status, capacidade, descricao, local];
      const result = await client.query(query, values);

      return result.rows[0];
    } catch (error) {
      console.error('Erro ao criar mesa no banco de dados:', error);
      throw error;
    }
  },

  update: async (id, mesa) => {
    const { nome, codigo, capacidade, descricao, local, status } = mesa;

    try {
      const query = `
                UPDATE TBL_MESA
                SET MES_NOME = COALESCE($1, MES_NOME),
                    MES_CODIGO = COALESCE($2, MES_CODIGO),
                    MES_CAPACIDADE = COALESCE($3, MES_CAPACIDADE),
                    MES_DESCRICAO = COALESCE($4, MES_DESCRICAO),
                    LOC_ID = COALESCE($5, LOC_ID),
                    MES_STATUS = COALESCE($6, MES_STATUS)
                WHERE MES_ID = $7
                RETURNING *;
            `;

      const values = [nome, codigo, capacidade, descricao, local, status, id];
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
                FROM TBL_LOCAL
                WHERE TBL_MESA.MES_ID = $1
                AND TBL_MESA.LOC_ID = TBL_LOCAL.LOC_ID
                RETURNING TBL_MESA.*, TBL_LOCAL.LOC_DESCRICAO;
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
      const query = 'SELECT * FROM TBL_MESA WHERE MES_ID = $1 ORDER BY MES_ID';
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
        SELECT * 
        FROM TBL_MESA AS MES
        INNER JOIN TBL_LOCAL AS LOC ON LOC.LOC_ID = MES.LOC_ID
        WHERE UPPER(LOC.LOC_DESCRICAO) LIKE UPPER($1)
        AND MES.MES_STATUS >= 0
        ORDER BY MES.MES_ID;
      `;
      const result = await client.query(query, [`%${local}%`]);
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar mesas por tipo:', error);
      throw error;
    }
  },

  getLocalById: async (id) => {
    try {
      const query = `SELECT LOC_DESCRICAO FROM TBL_LOCAL WHERE LOC_ID = $1 ORDER BY LOC_ID`;
      const result = await client.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao buscar local por ID:', error);
      throw error;
    }
  },
};

module.exports = mesasRepository;
