const client = require('../db/postgresql');

const produtosRepository = {
    getAll: async () => {
        try {
            const query = 'SELECT * FROM produtos WHERE status >= 1';
            const result = await client.query(query);
            return result.rows;
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            throw error;
        }
    },

    getById: async (id) => {
        try {
            const query = 'SELECT * FROM produtos WHERE id = $1 AND status >= 1';
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
                INSERT INTO produtos (nome, descricao, local, tipo, preco, imagem)
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
                UPDATE produtos
                SET nome = COALESCE($1, nome),
                    descricao = COALESCE($2, descricao),
                    local = COALESCE($3, local),
                    tipo = COALESCE($4, tipo),
                    preco = COALESCE($5, preco),
                    imagem = COALESCE($6, imagem),
                    status = COALESCE($7, status)
                WHERE id = $8
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
                UPDATE produtos
                SET status = -1
                WHERE id = $1
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
            const query = 'SELECT * FROM produtos WHERE id = $1';
            const result = await client.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            console.error('Erro ao buscar produto por ID (ignorando status):', error);
            throw error;
        }
    },

    getByTipo: async (tipo) => {
        try {
            const query = 'SELECT * FROM produtos WHERE tipo = $1 AND status >= 1';
            const result = await client.query(query, [tipo]);
            return result.rows;
        } catch (error) {
            console.error('Erro ao buscar produtos por tipo:', error);
            throw error;
        }
    },
};

module.exports = produtosRepository;