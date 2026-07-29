const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Importar rotas e adicionar ao app aqui
const cadastroRoutes = require('./src/routes/cadastroRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const initDb = require('./src/database/initDb');
app.use('/api/cadastros', cadastroRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend is running' });
});

app.listen(port, async () => {
  console.log(`Backend server is running on http://localhost:${port}`);
  await initDb();
});
