const express = require('express');
const locaisController = require('../controllers/locaisController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Locais
 *   description: Gerenciamento de locais (áreas do estabelecimento)
 */

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
 *             required:
 *               - descricao
 *             properties:
 *               descricao:
 *                 type: string
 *                 description: Nome/descrição do local
 *     responses:
 *       201:
 *         description: Local criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Local'
 *       400:
 *         description: Campos obrigatórios faltando
 *       500:
 *         description: Erro ao criar local
 */
router.post('/', locaisController.create);

/**
 * @swagger
 * components:
 *   schemas:
 *     Local:
 *       type: object
 *       properties:
 *         loc_id:
 *           type: integer
 *           description: ID do local
 *         loc_descricao:
 *           type: string
 *           description: Nome/descrição do local
 *       example:
 *         loc_id: 1
 *         loc_descricao: "Área Externa"
 */

module.exports = router;