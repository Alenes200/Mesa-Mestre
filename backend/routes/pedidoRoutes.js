const express = require('express');
const pedidoController = require('../controllers/pedidoController');

const router = express.Router();

// Rota para listar todos os pedidos (ativos e inativos)
router.get('/all', pedidoController.listAll);

// Rota para listar apenas os pedidos ativos
router.get('/active', pedidoController.listActive);

// Rota para buscar um pedido pelo ID
router.get('/:id', pedidoController.get);

// Rota para criar um novo pedido
router.post('/', pedidoController.create);

// Rota para atualizar um pedido
router.put('/:id', pedidoController.update);

// Rota para deletar um pedido (delete lógico)
router.delete('/:id', pedidoController.delete);

module.exports = router;
