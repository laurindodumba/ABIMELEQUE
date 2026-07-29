const db = require('../database/db');

exports.criarCadastro = async (req, res) => {
  const { nome, email, telefone, cidade, escolaridade, mensagem } = req.body || {};

  if (!nome || !email) {
    return res.status(400).json({ error: 'Missing required fields: nome and email' });
  }

  try {
    const query = `
      INSERT INTO cadastros (nome, email, telefone, cidade, escolaridade, mensagem)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [nome, email, telefone, cidade, escolaridade, mensagem];

    const result = await db.query(query, values);

    return res.status(201).json({ success: true, data: result.rows });
  } catch (err) {
    console.error('Error inserting cadastro:', err);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
};

exports.listarCadastros = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM cadastros ORDER BY id DESC');
    return res.status(200).json({ success: true, data: result.rows });
  } catch (err) {
    console.error('Error fetching cadastros:', err);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
};
