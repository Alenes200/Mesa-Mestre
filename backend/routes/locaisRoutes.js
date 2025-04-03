const express = require('express');
const locaisController = require('../controllers/locaisController');

const router = express.Router();

router.post('/', locaisController.create);

module.exports = router;
