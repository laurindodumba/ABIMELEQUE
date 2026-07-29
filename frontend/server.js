const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Servir configuração para o frontend
app.get('/config.js', (req, res) => {
  res.type('application/javascript');
  res.send(`window.ENV = { API_URL: "${process.env.API_URL || 'http://localhost:5000/api'}" };`);
});

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'src')));


app.listen(port, () => {
  console.log(`Frontend server is running on http://localhost:${port}`);
});
