const express = require('express');
const router = express.Router();
const chartController = require('../controllers/chartController');
const { ensureAuthenticated } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Charts
 *   description: Endpoints para gráficos e análises estatísticas
 */

/**
 * @swagger
 * /api/charts/comandas-por-dia:
 *   get:
 *     summary: Retorna quantidade de comandas por dia da semana
 *     tags: [Charts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: dataInicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Data inicial para filtro
 *       - in: query
 *         name: dataFim
 *         schema:
 *           type: string
 *           format: date
 *         description: Data final para filtro
 *     responses:
 *       200:
 *         description: Dados retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ComandasPorDia'
 */
router.get(
  '/comandas-por-dia',
  ensureAuthenticated,
  chartController.getComandasPorDiaSemana
);

/**
 * @swagger
 * /api/charts/top-produtos:
 *   get:
 *     summary: Retorna os 10 produtos mais vendidos
 *     tags: [Charts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/DataFiltro'
 *     responses:
 *       200:
 *         description: Dados retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TopProdutos'
 */
router.get(
  '/top-produtos',
  ensureAuthenticated,
  chartController.getTopProdutos
);

/**
 * @swagger
 * /api/charts/faturamento-diario:
 *   get:
 *     summary: Retorna o faturamento diário
 *     tags: [Charts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/DataFiltro'
 *     responses:
 *       200:
 *         description: Dados retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FaturamentoDiario'
 */
router.get(
  '/faturamento-diario',
  ensureAuthenticated,
  chartController.getFaturamentoDiario
);

/**
 * @swagger
 * /api/charts/formas-pagamento:
 *   get:
 *     summary: Retorna a distribuição por formas de pagamento
 *     tags: [Charts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/DataFiltro'
 *     responses:
 *       200:
 *         description: Dados retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FormasPagamento'
 */
router.get(
  '/formas-pagamento',
  ensureAuthenticated,
  chartController.getFormasPagamento
);

/**
 * @swagger
 * /api/charts/media-comanda:
 *   get:
 *     summary: Retorna a média de valor por comanda
 *     tags: [Charts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/DataFiltro'
 *     responses:
 *       200:
 *         description: Dados retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MediaComanda'
 */
router.get(
  '/media-comanda',
  ensureAuthenticated,
  chartController.getMediaComanda
);

/**
 * @swagger
 * /api/charts/ocupacao-mesas:
 *   get:
 *     summary: Retorna a ocupação de mesas
 *     tags: [Charts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/DataFiltro'
 *     responses:
 *       200:
 *         description: Dados retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OcupacaoMesas'
 */
router.get(
  '/ocupacao-mesas',
  ensureAuthenticated,
  chartController.getOcupacaoMesas
);

/**
 * @swagger
 * /api/charts/vendas-categoria:
 *   get:
 *     summary: Retorna as vendas por categoria de produto
 *     tags: [Charts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/DataFiltro'
 *     responses:
 *       200:
 *         description: Dados retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VendasPorCategoria'
 */
router.get(
  '/vendas-categoria',
  ensureAuthenticated,
  chartController.getVendasPorCategoria
);

/**
 * @swagger
 * components:
 *   parameters:
 *     DataFiltro:
 *       in: query
 *       name: dataInicio
 *       schema:
 *         type: string
 *         format: date
 *       description: Data inicial para filtro
 *   schemas:
 *     ComandasPorDia:
 *       type: array
 *       items:
 *         type: object
 *         properties:
 *           dia_semana:
 *             type: string
 *             description: Nome do dia da semana
 *           quantidade:
 *             type: integer
 *             description: Quantidade de comandas
 *       example:
 *         - dia_semana: "Segunda-feira"
 *           quantidade: 25
 *         - dia_semana: "Terça-feira"
 *           quantidade: 30
 *     TopProdutos:
 *       type: array
 *       items:
 *         type: object
 *         properties:
 *           produto:
 *             type: string
 *             description: Nome do produto
 *           quantidade_vendida:
 *             type: integer
 *             description: Quantidade vendida
 *           faturamento_total:
 *             type: number
 *             description: Valor total vendido
 *       example:
 *         - produto: "X-Burger"
 *           quantidade_vendida: 150
 *           faturamento_total: 2250.00
 *     FaturamentoDiario:
 *       type: array
 *       items:
 *         type: object
 *         properties:
 *           data:
 *             type: string
 *             format: date
 *             description: Data do faturamento
 *           valor:
 *             type: number
 *             description: Valor faturado no dia
 *       example:
 *         - data: "2023-01-01"
 *           valor: 1500.00
 *     FormasPagamento:
 *       type: array
 *       items:
 *         type: object
 *         properties:
 *           forma_pagamento:
 *             type: string
 *             description: Nome da forma de pagamento
 *           quantidade:
 *             type: integer
 *             description: Quantidade de transações
 *           valor_total:
 *             type: number
 *             description: Valor total das transações
 *       example:
 *         - forma_pagamento: "Dinheiro"
 *           quantidade: 50
 *           valor_total: 5000.00
 *     MediaComanda:
 *       type: object
 *       properties:
 *         media:
 *           type: number
 *           description: Valor médio por comanda
 *       example:
 *         media: 75.00
 *     OcupacaoMesas:
 *       type: array
 *       items:
 *         type: object
 *         properties:
 *           mesa:
 *             type: string
 *             description: Identificação da mesa
 *           ocupacao:
 *             type: number
 *             description: Percentual de ocupação da mesa
 *       example:
 *         - mesa: "Mesa 1"
 *           ocupacao: 80
 *     VendasPorCategoria:
 *       type: array
 *       items:
 *         type: object
 *         properties:
 *           categoria:
 *             type: string
 *             description: Nome da categoria
 *           quantidade_vendida:
 *             type: integer
 *             description: Quantidade vendida
 *           faturamento_total:
 *             type: number
 *             description: Valor total vendido
 *       example:
 *         - categoria: "Bebidas"
 *           quantidade_vendida: 200
 *           faturamento_total: 3000.00
 */

module.exports = router;
