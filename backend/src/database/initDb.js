const db = require('./db');
const bcrypt = require('bcryptjs');

const initDb = async () => {
  try {
    // 1. Criar a tabela de administradores se não existir
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await db.query(createTableQuery);

    // 2. Verificar se já existe algum administrador
    const countQuery = 'SELECT COUNT(*) FROM admins';
    const result = await db.query(countQuery);
    const count = parseInt(result.rows[0].count, 10);

    // 3. Se não houver, criar o administrador inicial a partir do .env
    if (count === 0) {
      const username = process.env.ADMIN_USER || 'admin';
      const password = process.env.ADMIN_PASSWORD || 'admin123';
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const insertQuery = `
        INSERT INTO admins (username, password)
        VALUES ($1, $2)
      `;
      await db.query(insertQuery, [username, hashedPassword]);
      console.log(`Utilizador administrador '${username}' criado com sucesso.`);
    } else {
      console.log('Tabela admins já contém utilizadores. Inicialização ignorada.');
    }
  } catch (error) {
    console.error('Erro ao inicializar a base de dados:', error);
  }
};

module.exports = initDb;
