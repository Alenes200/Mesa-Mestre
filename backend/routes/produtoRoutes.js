const express = require('express');
const produtosController = require('../controllers/produtoController');
const upload = require('../utils/upload');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Produtos
 *   description: Gerenciamento de produtos
 */

/**
 * @swagger
 * /api/produtos:
 *   get:
 *     summary: Lista todos os produtos ativos
 *     tags: [Produtos]
 *     responses:
 *       200:
 *         description: Lista de produtos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Produto'
 *       500:
 *         description: Erro ao listar produtos
 */
router.get('/', produtosController.list);

/**
 * @swagger
 * /api/produtos/{id}:
 *   get:
 *     summary: Busca um produto pelo ID
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produto'
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro ao buscar produto
 */
router.get('/:id', produtosController.get);

/**
 * @swagger
 * /api/produtos:
 *   post:
 *     summary: Cria um novo produto
 *     tags: [Produtos]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome do produto
 *               descricao:
 *                 type: string
 *                 description: Descrição do produto
 *               local:
 *                 type: string
 *                 description: Local do produto
 *               tipo:
 *                 type: string
 *                 description: Tipo do produto (sobremesa, lanche)
 *               preco:
 *                 type: number
 *                 description: Preço do produto
 *               status:
 *                 type: integer
 *                 description: Status do produto (1 para ativo, -1 para desativado)
 *               imagem:
 *                 type: string
 *                 format: binary
 *                 description: Imagem do produto
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produto'
 *       400:
 *         description: Campos obrigatórios faltando ou inválidos
 *       500:
 *         description: Erro ao criar produto
 */
router.post('/', upload.single('imagem'), produtosController.create);

/**
 * @swagger
 * /api/produtos/{id}:
 *   put:
 *     summary: Atualiza um produto existente
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome do produto
 *               descricao:
 *                 type: string
 *                 description: Descrição do produto
 *               local:
 *                 type: string
 *                 description: Local do produto
 *               tipo:
 *                 type: string
 *                 description: Tipo do produto (sobremesa, lanche)
 *               preco:
 *                 type: number
 *                 description: Preço do produto
 *               status:
 *                 type: integer
 *                 description: Status do produto (1 para ativo, -1 para desativado)
 *               imagem:
 *                 type: string
 *                 format: binary
 *                 description: Nova imagem do produto (opcional)
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produto'
 *       400:
 *         description: Campos inválidos ou produto desativado
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro ao atualizar produto
 */
router.put('/:id', upload.single('imagem'), produtosController.update);

/**
 * @swagger
 * /api/produtos/{id}:
 *   delete:
 *     summary: Desativa um produto (delete lógico)
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produto desativado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produto'
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro ao desativar produto
 */
router.delete('/:id', produtosController.delete);

/**
 * @swagger
 * /api/produtos/tipo/{tipo}:
 *   get:
 *     summary: Busca produtos por tipo
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: tipo
 *         required: true
 *         schema:
 *           type: string
 *         description: Tipo do produto (sobremesa, lanche)
 *     responses:
 *       200:
 *         description: Lista de produtos do tipo especificado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Produto'
 *       404:
 *         description: Nenhum produto encontrado para o tipo especificado
 *       500:
 *         description: Erro ao buscar produtos por tipo
 */
router.get('/tipo/:tipo', produtosController.getByTipo);

/**
 * @swagger
 * components:
 *   schemas:
 *     Produto:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID do produto
 *         nome:
 *           type: string
 *           description: Nome do produto
 *         descricao:
 *           type: string
 *           description: Descrição do produto
 *         local:
 *           type: string
 *           description: Local do produto
 *         tipo:
 *           type: string
 *           description: Tipo do produto (sobremesa, lanche)
 *         preco:
 *           type: number
 *           description: Preço do produto
 *         imagem:
 *           type: string
 *           description: Caminho da imagem do produto
 *         status:
 *           type: integer
 *           description: Status do produto (1 para ativo, -1 para desativado)
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Data de criação do produto
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Data de atualização do produto
 *       example:
 *         id: 1
 *         nome: "Banana Crocante"
 *         descricao: "Banana crocante, com auxíthos, com caídas de morango e chocolate..."
 *         local: "conferiaria"
 *         tipo: "sobremesa"
 *         preco: 46.90
 *         imagem: "uploads/1741980063205.png"
 *         status: 1
 *         created_at: "2023-10-10T12:00:00.000Z"
 *         updated_at: "2023-10-10T12:00:00.000Z"
 */

module.exports = router;
