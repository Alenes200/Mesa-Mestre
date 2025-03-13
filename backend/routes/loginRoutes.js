const express = require('express');
const loginController = require('../controllers/loginController');
const { ensureAuthenticated } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/login', loginController.login);
router.post('/logout', loginController.logout);
router.get('/auth', ensureAuthenticated, loginController.getCurrentUser);

module.exports = router;
