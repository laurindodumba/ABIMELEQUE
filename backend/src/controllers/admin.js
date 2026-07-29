const db = require('../database/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: 'Preencha o usuário e a senha' });
  }

  try {
    // Procurar o utilizador na base de dados
    const result = await db.query('SELECT * FROM admins WHERE username = $1', [username]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const admin = result.rows[0];

    // Comparar a senha com o hash guardado
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { id: admin.id, user: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    return res.status(200).json({ success: true, token });
  } catch (err) {
    console.error('Erro no login do admin:', err);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
};
