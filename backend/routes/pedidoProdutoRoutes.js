const express = require('express');
const router = express.Router();
const pedidoProdutoController = require('../controllers/pedidoProdutoController');

/**
 * @swagger
 * tags:
 *   name: PedidoProdutos
 *   description: Gerenciamento de produtos em pedidos
 */

/**
 * @swagger
 * /api/pedidos-produtos:
 *   get:
 *     summary: Lista todos os produtos em pedidos
 *     tags: [PedidoProdutos]
 *     responses:
 *       200:
 *         description: Lista retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PedidoProduto'
 *       500:
 *         description: Erro ao listar produtos
 */
router.get('/', pedidoProdutoController.listAll);

/**
 * @swagger
 * /api/pedidos-produtos/{id}:
 *   get:
 *     summary: Busca um produto em pedido pelo ID
 *     tags: [PedidoProdutos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto em pedido
 *     responses:
 *       200:
 *         description: Produto em pedido encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PedidoProduto'
 *       404:
 *         description: Produto em pedido não encontrado
 */
router.get('/:id', pedidoProdutoController.getById);

/**
 * @swagger
 * /api/pedidos-produtos:
 *   post:
 *     summary: Adiciona um produto a um pedido
 *     tags: [PedidoProdutos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ped_id
 *               - pro_id
 *               - ppr_quantidade
 *             properties:
 *               ped_id:
 *                 type: integer
 *                 description: ID do pedido
 *               pro_id:
 *                 type: integer
 *                 description: ID do produto
 *               ppr_quantidade:
 *                 type: integer
 *                 description: Quantidade do produto
 *     responses:
 *       201:
 *         description: Produto adicionado ao pedido com sucesso
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro ao adicionar produto ao pedido
 */
router.post('/', pedidoProdutoController.create);

/**
 * @swagger
 * /api/pedidos-produtos/{id}:
 *   put:
 *     summary: Atualiza um produto em pedido
 *     tags: [PedidoProdutos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto em pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PedidoProdutoUpdate'
 *     responses:
 *       200:
 *         description: Produto em pedido atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Produto em pedido não encontrado
 */
router.put('/:id', pedidoProdutoController.update);

/**
 * @swagger
 * /api/pedidos-produtos/{id}:
 *   delete:
 *     summary: Remove um produto de um pedido
 *     tags: [PedidoProdutos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto em pedido
 *     responses:
 *       200:
 *         description: Produto removido do pedido com sucesso
 *       404:
 *         description: Produto em pedido não encontrado
 */
router.delete('/:id', pedidoProdutoController.delete);

/**
 * @swagger
 * /api/pedidos-produtos/pedido/{pedidoId}:
 *   get:
 *     summary: Lista produtos de um pedido específico
 *     tags: [PedidoProdutos]
 *     parameters:
 *       - in: path
 *         name: pedidoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do pedido
 *     responses:
 *       200:
 *         description: Lista de produtos do pedido retornada com sucesso
 *       404:
 *         description: Pedido não encontrado
 */
router.get('/pedido/:pedidoId', pedidoProdutoController.getByPedidoId);

/**
 * @swagger
 * components:
 *   schemas:
 *     PedidoProduto:
 *       type: object
 *       properties:
 *         ppr_id:
 *           type: integer
 *           description: ID do produto no pedido
 *         ped_id:
 *           type: integer
 *           description: ID do pedido
 *         pro_id:
 *           type: integer
 *           description: ID do produto
 *         ppr_quantidade:
 *           type: integer
 *           description: Quantidade do produto
 *       example:
 *         ppr_id: 1
 *         ped_id: 1
 *         pro_id: 1
 *         ppr_quantidade: 2
 *     PedidoProdutoUpdate:
 *       type: object
 *       properties:
 *         ppr_quantidade:
 *           type: integer
 *           description: Nova quantidade do produto
 *       example:
 *         ppr_quantidade: 3
 */

module.exports = router;
