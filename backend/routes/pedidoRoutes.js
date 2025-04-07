const express = require('express');
const pedidoController = require('../controllers/pedidoController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Pedidos
 *   description: Gerenciamento de pedidos
 */

/**
 * @swagger
 * /api/pedidos/all:
 *   get:
 *     summary: Lista todos os pedidos (ativos e inativos)
 *     tags: [Pedidos]
 *     responses:
 *       200:
 *         description: Lista de pedidos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pedido'
 *       500:
 *         description: Erro ao listar pedidos
 */
router.get('/all', pedidoController.listAll);

/**
 * @swagger
 * /api/pedidos/active:
 *   get:
 *     summary: Lista apenas os pedidos ativos
 *     tags: [Pedidos]
 *     responses:
 *       200:
 *         description: Lista de pedidos ativos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pedido'
 *       500:
 *         description: Erro ao listar pedidos ativos
 */
router.get('/active', pedidoController.listActive);

/**
 * @swagger
 * /api/pedidos/{id}:
 *   get:
 *     summary: Busca um pedido pelo ID
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do pedido
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pedido'
 *       404:
 *         description: Pedido não encontrado
 *       500:
 *         description: Erro ao buscar pedido
 */
router.get('/:id', pedidoController.get);

/**
 * @swagger
 * /api/pedidos:
 *   post:
 *     summary: Cria um novo pedido
 *     tags: [Pedidos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - com_id
 *               - ped_descricao
 *               - ped_preco_total
 *             properties:
 *               com_id:
 *                 type: integer
 *                 description: ID da comanda
 *               ped_descricao:
 *                 type: string
 *                 description: Descrição do pedido
 *               ped_status:
 *                 type: integer
 *                 description: Status do pedido (1 para ativo)
 *               ped_preco_total:
 *                 type: number
 *                 description: Preço total do pedido
 *               fpa_id:
 *                 type: integer
 *                 description: ID da forma de pagamento
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro ao criar pedido
 */
router.post('/', pedidoController.create);

/**
 * @swagger
 * /api/pedidos/{id}:
 *   put:
 *     summary: Atualiza um pedido
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do pedido
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PedidoUpdate'
 *     responses:
 *       200:
 *         description: Pedido atualizado com sucesso
 *       404:
 *         description: Pedido não encontrado
 *       500:
 *         description: Erro ao atualizar pedido
 */
router.put('/:id', pedidoController.update);

/**
 * @swagger
 * /api/pedidos/{id}:
 *   delete:
 *     summary: Desativa um pedido (delete lógico)
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do pedido
 *     responses:
 *       200:
 *         description: Pedido desativado com sucesso
 *       404:
 *         description: Pedido não encontrado
 *       500:
 *         description: Erro ao desativar pedido
 */
router.delete('/:id', pedidoController.delete);

/**
 * @swagger
 * components:
 *   schemas:
 *     Pedido:
 *       type: object
 *       properties:
 *         ped_id:
 *           type: integer
 *           description: ID do pedido
 *         com_id:
 *           type: integer
 *           description: ID da comanda
 *         ped_descricao:
 *           type: string
 *           description: Descrição do pedido
 *         ped_status:
 *           type: integer
 *           description: Status do pedido (1 ativo, -1 inativo)
 *         ped_preco_total:
 *           type: number
 *           description: Preço total do pedido
 *         fpa_id:
 *           type: integer
 *           description: ID da forma de pagamento
 *         ped_created_at:
 *           type: string
 *           format: date-time
 *           description: Data de criação do pedido
 *       example:
 *         ped_id: 1
 *         com_id: 1
 *         ped_descricao: "Pedido mesa 5"
 *         ped_status: 1
 *         ped_preco_total: 150.00
 *         fpa_id: 1
 *         ped_created_at: "2023-10-10T12:00:00.000Z"
 *     PedidoUpdate:
 *       type: object
 *       properties:
 *         ped_descricao:
 *           type: string
 *           description: Nova descrição do pedido
 *         ped_status:
 *           type: integer
 *           description: Novo status do pedido
 *         ped_preco_total:
 *           type: number
 *           description: Novo preço total
 *         fpa_id:
 *           type: integer
 *           description: Nova forma de pagamento
 */

module.exports = router;
