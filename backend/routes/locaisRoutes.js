const express = require('express');
const locaisController = require('../controllers/locaisController');

const router = express.Router();

router.get('/', locaisController.list);

router.get('/:id', locaisController.get);

router.post('/', locaisController.create);

router.put('/:id', locaisController.update);

router.delete('/:id', locaisController.delete);

module.exports = router;
