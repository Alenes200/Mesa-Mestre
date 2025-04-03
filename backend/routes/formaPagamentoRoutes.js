const express = require('express');
const formaPagamentoController = require('../controllers/formaPagamentoController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: FormasPagamento
 *   description: Gerenciamento de formas de pagamento
 */

/**
 * @swagger
 * /api/formas-pagamento:
 *   get:
 *     summary: Lista todas as formas de pagamento
 *     tags: [FormasPagamento]
 *     responses:
 *       200:
 *         description: Lista de formas de pagamento retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FormaPagamento'
 *       500:
 *         description: Erro ao listar formas de pagamento
 */
router.get('/', formaPagamentoController.list);

/**
 * @swagger
 * /api/formas-pagamento/{id}:
 *   get:
 *     summary: Busca uma forma de pagamento pelo ID
 *     tags: [FormasPagamento]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da forma de pagamento
 *     responses:
 *       200:
 *         description: Forma de pagamento encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FormaPagamento'
 *       404:
 *         description: Forma de pagamento não encontrada
 *       500:
 *         description: Erro ao buscar forma de pagamento
 */
router.get('/:id', formaPagamentoController.get);

/**
 * @swagger
 * /api/formas-pagamento:
 *   post:
 *     summary: Cria uma nova forma de pagamento
 *     tags: [FormasPagamento]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descricao:
 *                 type: string
 *                 description: Descrição da forma de pagamento
 *     responses:
 *       201:
 *         description: Forma de pagamento criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FormaPagamento'
 *       400:
 *         description: Descrição é obrigatória
 *       500:
 *         description: Erro ao criar forma de pagamento
 */
router.post('/', formaPagamentoController.create);

/**
 * @swagger
 * /api/formas-pagamento/{id}:
 *   put:
 *     summary: Atualiza uma forma de pagamento existente
 *     tags: [FormasPagamento]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da forma de pagamento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descricao:
 *                 type: string
 *                 description: Nova descrição da forma de pagamento
 *     responses:
 *       200:
 *         description: Forma de pagamento atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FormaPagamento'
 *       400:
 *         description: Descrição é obrigatória
 *       404:
 *         description: Forma de pagamento não encontrada
 *       500:
 *         description: Erro ao atualizar forma de pagamento
 */
router.put('/:id', formaPagamentoController.update);

/**
 * @swagger
 * /api/formas-pagamento/{id}:
 *   delete:
 *     summary: Remove uma forma de pagamento
 *     tags: [FormasPagamento]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da forma de pagamento
 *     responses:
 *       200:
 *         description: Forma de pagamento removida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FormaPagamento'
 *       404:
 *         description: Forma de pagamento não encontrada
 *       500:
 *         description: Erro ao remover forma de pagamento
 */
router.delete('/:id', formaPagamentoController.delete);

/**
 * @swagger
 * components:
 *   schemas:
 *     FormaPagamento:
 *       type: object
 *       properties:
 *         codigo:
 *           type: string
 *           description: Código da forma de pagamento (FPA_ + ID)
 *         descricao:
 *           type: string
 *           description: Descrição da forma de pagamento
 *       example:
 *         codigo: "FPA_1"
 *         descricao: "DINHEIRO"
 */

module.exports = router;