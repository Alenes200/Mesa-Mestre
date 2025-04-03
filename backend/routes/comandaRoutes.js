const express = require('express');
const comandaController = require('../controllers/comandaController');

const router = express.Router();

// Rota para listar todas as comandas (ativos e inativos)
router.get('/all', comandaController.listAll);

// Rota para listar apenas as comandas ativas
router.get('/active', comandaController.listActive);

// Rota para buscar uma comanda pelo ID
router.get('/:id', comandaController.get);

// Rota para criar uma nova comanda
router.post('/', comandaController.create);

// Rota para atualizar uma comanda
router.put('/:id', comandaController.update);

// Rota para deletar uma comanda (delete lógico)
router.delete('/:id', comandaController.delete);

// GET /api/comandas/mesa/:mesaId/produtos
router.get('/mesa/:mesaId/produtos', comandaController.getProdutosByMesaId);

// Pedidos da comanda ativa por mesa
router.get('/mesas/:mesaId/pedidos-ativos', comandaController.getPedidosComandaAtiva);

module.exports = router;
