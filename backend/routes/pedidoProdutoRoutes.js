const express = require('express');
const router = express.Router();
const pedidoProdutoController = require('../controllers/pedidoProdutoController');

// CRUD Básico
router.get('/', pedidoProdutoController.listAll);
router.get('/:id', pedidoProdutoController.getById);
router.post('/', pedidoProdutoController.create);
router.put('/:id', pedidoProdutoController.update);
router.delete('/:id', pedidoProdutoController.delete);

// Rota customizada (produtos de um pedido)
router.get('/pedido/:pedidoId', pedidoProdutoController.getByPedidoId);

module.exports = router;
