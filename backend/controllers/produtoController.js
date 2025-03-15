const produtosRepository = require('../repositories/produtoRepository');
const path = require('path');
const fs = require('fs');

const produtosController = {
    list: async (req, res) => {
        try {
            const produtos = await produtosRepository.getAll();
            res.json(produtos);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao listar produtos.' });
        }
    },

    get: async (req, res) => {
        try {
            const produto = await produtosRepository.getById(req.params.id);
            if (produto) {
                res.json(produto);
            } else {
                res.status(404).json({ error: 'Produto não encontrado.' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar produto.' });
        }
    },

    create: async (req, res) => {
        try {
            const { nome, descricao, local, tipo, preco } = req.body;
            const imagem = path.relative(path.join(__dirname, '..', 'uploads'), req.file.path);

            if (!nome || !descricao || !local || !tipo || !preco) {
                return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
            }

            const novoProduto = await produtosRepository.create({
                nome,
                descricao,
                local,
                tipo,
                preco,
                imagem,
            });

            res.status(201).json(novoProduto);
        } catch (error) {
            console.error('Erro ao criar produto:', error);
            res.status(500).json({ error: 'Erro ao criar produto.' });
        }
    },

    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { nome, descricao, local, tipo, preco, status } = req.body;

            const produtoExistente = await produtosRepository.getByIdIgnoreStatus(id);

            if (!produtoExistente) {
                return res.status(404).json({ error: 'Produto não encontrado.' });
            }
            if (produtoExistente.status < 1 && status < 1) {
                return res.status(400).json({ error: 'Produto desativado. Para reativar, defina um status válido (>= 1).' });
            }

            let imagem = produtoExistente.imagem;

            if (req.file) {
                const novaImagem = path.relative(path.join(__dirname, '..', 'uploads'), req.file.path);
                if (imagem !== novaImagem) {
                    if (imagem) {
                        const caminhoImagemAntiga = path.join(__dirname, '..', 'uploads', imagem);
                        if (fs.existsSync(caminhoImagemAntiga)) {
                            fs.unlinkSync(caminhoImagemAntiga);
                        }
                    }
                    imagem = novaImagem;
                } else {
                    fs.unlinkSync(req.file.path);
                }
            }
            const produtoAtualizado = await produtosRepository.update(id, {
                nome: nome || produtoExistente.nome,
                descricao: descricao || produtoExistente.descricao,
                local: local || produtoExistente.local,
                tipo: tipo || produtoExistente.tipo,
                preco: preco || produtoExistente.preco,
                imagem,
                status: status || produtoExistente.status
            });

            res.status(200).json(produtoAtualizado);
        } catch (error) {
            console.error('Erro ao atualizar produto:', error);
            res.status(500).json({ error: 'Erro ao atualizar produto.' });
        }
    },

    delete: async (req, res) => {
        try {
            const produtoAtualizado = await produtosRepository.delete(req.params.id);

            if (produtoAtualizado) {
                res.status(200).json({
                    message: 'Produto desativado com sucesso.',
                    produto: produtoAtualizado
                });
            } else {
                res.status(404).json({ error: 'Produto não encontrado.' });
            }
        } catch (error) {
            console.error('Erro ao desativar produto:', error);
            res.status(500).json({ error: 'Erro ao desativar produto.' });
        }
    },

    getByTipo: async (req, res) => {
        try {
            const { tipo } = req.params;
            const produtos = await produtosRepository.getByTipo(tipo);

            if (produtos.length > 0) {
                res.status(200).json(produtos);
            } else {
                res.status(404).json({ error: 'Nenhum produto encontrado para o tipo especificado.' });
            }
        } catch (error) {
            console.error('Erro ao buscar produtos por tipo:', error);
            res.status(500).json({ error: 'Erro ao buscar produtos por tipo.' });
        }
    },
};

module.exports = produtosController;