const express = require('express');
const loginController = require('../controllers/loginController');
const { ensureAuthenticated } = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Autenticação
 *   description: Rotas relacionadas à autenticação de usuários
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Autenticação]
 *     summary: Autentica um usuário
 *     description: Realiza o login do usuário e retorna um token JWT.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: senha123
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login realizado com sucesso.
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: E-mail ou senha incorretos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: E-mail ou senha incorretos.
 *       500:
 *         description: Erro no servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Erro ao fazer login.
 */
router.post('/login', loginController.login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     tags: [Autenticação]
 *     summary: Realiza o logout do usuário
 *     description: Remove o cookie de sessão e realiza o logout.
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logout realizado com sucesso.
 */
router.post('/logout', loginController.logout);

/**
 * @swagger
 * /api/auth/:
 *   get:
 *     tags: [Autenticação]
 *     summary: Retorna o usuário atualmente autenticado
 *     description: Retorna as informações do usuário autenticado com base no token JWT.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuário autenticado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 email:
 *                   type: string
 *                   example: admin@example.com
 *                 nome:
 *                   type: string
 *                   example: Admin
 *                 telefone:
 *                   type: string
 *                   example: "123456789"
 *                 funcao:
 *                   type: string
 *                   example: "Administrador"
 *                 userType:
 *                   type: integer
 *                   example: 1
 *                 status:
 *                   type: integer
 *                   example: 1
 *       401:
 *         description: Não autorizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Token não fornecido ou inválido.
 */
router.get('/', ensureAuthenticated, loginController.getCurrentUser);

module.exports = router;
