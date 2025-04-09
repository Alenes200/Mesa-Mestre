const express = require('express');
const locaisController = require('../controllers/locaisController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Locais
 *   description: Gerenciamento de locais
 */

/**
 * @swagger
 * /api/locais:
 *   get:
 *     summary: Lista todos os locais
 *     tags: [Locais]
 *     responses:
 *       200:
 *         description: Lista de locais retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Local'
 *       500:
 *         description: Erro ao listar locais
 */
router.get('/', locaisController.list);

/**
 * @swagger
 * /api/locais/Todasprimeiro:
 *   get:
 *     summary: Lista todos os locais com prioridade para "Todas"
 *     tags: [Locais]
 *     responses:
 *       200:
 *         description: Lista de locais com 'Todas' no topo retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Local'
 *       500:
 *         description: Erro ao listar locais
 */
router.get('/Todasprimeiro', locaisController.listTodasPrimeiro);

/**
 * @swagger
 * /api/locais/{id}:
 *   get:
 *     summary: Busca um local pelo ID
 *     tags: [Locais]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do local
 *     responses:
 *       200:
 *         description: Local encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Local'
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Local não encontrado
 *       500:
 *         description: Erro ao buscar local
 */
router.get('/:id', locaisController.get);

/**
 * @swagger
 * /api/locais:
 *   post:
 *     summary: Cria um novo local
 *     tags: [Locais]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descricao:
 *                 type: string
 *                 description: Descrição do local
 *     responses:
 *       201:
 *         description: Local criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Local'
 *       400:
 *         description: Todos os campos são obrigatórios
 *       500:
 *         description: Erro ao criar local
 */
router.post('/', locaisController.create);

/**
 * @swagger
 * /api/locais/{id}:
 *   put:
 *     summary: Atualiza um local existente
 *     tags: [Locais]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do local
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descricao:
 *                 type: string
 *                 description: Nova descrição do local
 *     responses:
 *       200:
 *         description: Local atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Local'
 *       400:
 *         description: ID inválido ou descrição inválida
 *       404:
 *         description: Local não encontrado
 *       500:
 *         description: Erro ao atualizar local
 */
router.put('/:id', locaisController.update);

/**
 * @swagger
 * /api/locais/{id}:
 *   delete:
 *     summary: Remove um local
 *     tags: [Locais]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do local
 *     responses:
 *       200:
 *         description: Local removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 Local:
 *                   $ref: '#/components/schemas/Local'
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Local não encontrado
 *       500:
 *         description: Erro ao remover local
 */
router.delete('/:id', locaisController.delete);

/**
 * @swagger
 * components:
 *   schemas:
 *     Local:
 *       type: object
 *       properties:
 *         codigo:
 *           type: string
 *           description: Código do local (LOC_ID)
 *         descricao:
 *           type: string
 *           description: Descrição do local
 *       example:
 *         codigo: "LOC_1"
 *         descricao: "Unidade Central"
 */

module.exports = router;
