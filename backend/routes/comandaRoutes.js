const express = require('express');
const comandaController = require('../controllers/comandaController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Comandas
 *   description: Gerenciamento de comandas
 */

/**
 * @swagger
 * /api/comandas/all:
 *   get:
 *     summary: Lista todas as comandas (ativas e inativas)
 *     tags: [Comandas]
 *     responses:
 *       200:
 *         description: Lista de comandas retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comanda'
 *       500:
 *         description: Erro ao listar comandas
 */
router.get('/all', comandaController.listAll);

/**
 * @swagger
 * /api/comandas/active:
 *   get:
 *     summary: Lista apenas as comandas ativas
 *     tags: [Comandas]
 *     responses:
 *       200:
 *         description: Lista de comandas ativas retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comanda'
 *       500:
 *         description: Erro ao listar comandas ativas
 */
router.get('/active', comandaController.listActive);

/**
 * @swagger
 * /api/comandas/{id}:
 *   get:
 *     summary: Busca uma comanda pelo ID
 *     tags: [Comandas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da comanda
 *     responses:
 *       200:
 *         description: Comanda encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comanda'
 *       404:
 *         description: Comanda não encontrada
 *       500:
 *         description: Erro ao buscar comanda
 */
router.get('/:id', comandaController.get);

/**
 * @swagger
 * /api/comandas:
 *   post:
 *     summary: Cria uma nova comanda
 *     tags: [Comandas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mes_id:
 *                 type: integer
 *                 description: ID da mesa
 *               com_data_inicio:
 *                 type: string
 *                 format: date-time
 *                 description: Data de início da comanda
 *               com_data_fim:
 *                 type: string
 *                 format: date-time
 *                 description: Data de fim da comanda
 *               com_status:
 *                 type: integer
 *                 description: Status da comanda (1 para ativa, -1 para inativa)
 *     responses:
 *       201:
 *         description: Comanda criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comanda'
 *       400:
 *         description: Campos obrigatórios faltando
 *       500:
 *         description: Erro ao criar comanda
 */
router.post('/', comandaController.create);

/**
 * @swagger
 * /api/comandas/{id}:
 *   put:
 *     summary: Atualiza uma comanda existente
 *     tags: [Comandas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da comanda
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ComandaUpdate'
 *     responses:
 *       200:
 *         description: Comanda atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comanda'
 *       404:
 *         description: Comanda não encontrada
 *       500:
 *         description: Erro ao atualizar comanda
 */
router.put('/:id', comandaController.update);

/**
 * @swagger
 * /api/comandas/{id}:
 *   delete:
 *     summary: Desativa uma comanda (delete lógico)
 *     tags: [Comandas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da comanda
 *     responses:
 *       200:
 *         description: Comanda desativada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comanda'
 *       404:
 *         description: Comanda não encontrada
 *       500:
 *         description: Erro ao desativar comanda
 */
router.delete('/:id', comandaController.delete);

/**
 * @swagger
 * /api/comandas/mesa/{mesaId}/produtos:
 *   get:
 *     summary: Lista produtos de uma mesa específica
 *     tags: [Comandas]
 *     parameters:
 *       - in: path
 *         name: mesaId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da mesa
 *     responses:
 *       200:
 *         description: Lista de produtos retornada com sucesso
 *       404:
 *         description: Nenhum produto encontrado
 *       500:
 *         description: Erro ao buscar produtos
 */
router.get('/mesa/:mesaId/produtos', comandaController.getProdutosByMesaId);

/**
 * @swagger
 * /api/comandas/mesas/{mesaId}/pedidos-ativos:
 *   get:
 *     summary: Lista pedidos ativos de uma mesa
 *     tags: [Comandas]
 *     parameters:
 *       - in: path
 *         name: mesaId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da mesa
 *     responses:
 *       200:
 *         description: Lista de pedidos retornada com sucesso
 *       404:
 *         description: Nenhum pedido encontrado
 *       500:
 *         description: Erro ao buscar pedidos
 */
router.get(
  '/mesas/:mesaId/pedidos-ativos',
  comandaController.getPedidosComandaAtiva
);

/**
 * @swagger
 * components:
 *   schemas:
 *     Comanda:
 *       type: object
 *       properties:
 *         com_id:
 *           type: integer
 *           description: ID da comanda
 *         mes_id:
 *           type: integer
 *           description: ID da mesa
 *         com_data_inicio:
 *           type: string
 *           format: date-time
 *           description: Data de início da comanda
 *         com_data_fim:
 *           type: string
 *           format: date-time
 *           description: Data de fim da comanda
 *         com_status:
 *           type: integer
 *           description: Status da comanda (1 para ativa, -1 para inativa)
 *       example:
 *         com_id: 1
 *         mes_id: 1
 *         com_data_inicio: "2023-10-10T12:00:00.000Z"
 *         com_data_fim: "2023-10-10T14:00:00.000Z"
 *         com_status: 1
 *     ComandaUpdate:
 *       type: object
 *       properties:
 *         mes_id:
 *           type: integer
 *           description: ID da mesa
 *         com_data_inicio:
 *           type: string
 *           format: date-time
 *           description: Data de início da comanda
 *         com_data_fim:
 *           type: string
 *           format: date-time
 *           description: Data de fim da comanda
 *         com_status:
 *           type: integer
 *           description: Status da comanda
 */

module.exports = router;
