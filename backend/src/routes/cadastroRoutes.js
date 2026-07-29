const express = require('express');
const router = express.Router();
const cadastroController = require('../controllers/cadastro');
const authMiddleware = require('../middlewares/auth');

router.post('/', cadastroController.criarCadastro);
router.get('/', authMiddleware, cadastroController.listarCadastros);

module.exports = router;
