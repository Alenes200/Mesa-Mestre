const express = require('express');
const router = express.Router();
const chartController = require('../controllers/chartController');
const { ensureAuthenticated } = require('../middlewares/authMiddleware');

// Gráfico 1: Comandas por dia da semana
router.get('/comandas-por-dia', ensureAuthenticated, chartController.getComandasPorDiaSemana);

// Gráfico 2: Top 10 produtos mais vendidos
router.get('/top-produtos', ensureAuthenticated, chartController.getTopProdutos);

// Gráfico 3: Faturamento diário
router.get('/faturamento-diario', ensureAuthenticated, chartController.getFaturamentoDiario);

// Gráfico 4: Distribuição por formas de pagamento
router.get('/formas-pagamento', ensureAuthenticated, chartController.getFormasPagamento);

// Gráfico 5: Média de valor por comanda
router.get('/media-comanda', ensureAuthenticated, chartController.getMediaComanda);

// Gráfico 6: Ocupação de mesas
router.get('/ocupacao-mesas', ensureAuthenticated, chartController.getOcupacaoMesas);

// Gráfico 7: Vendas por categoria de produto
router.get('/vendas-categoria', ensureAuthenticated, chartController.getVendasPorCategoria);

module.exports = router;