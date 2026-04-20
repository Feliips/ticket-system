const express = require('express');
const path = require('path');
const cors = require('cors');
const db = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

// rotas
const usuariosRoutes = require('./routes/usuarios');
app.use('/api/usuarios', usuariosRoutes);

// servir frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// rota principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await db.query('SELECT 1');
    console.log('Conectado ao MySQL!');
  } catch (err) {
    console.error('Falha no teste de conexao com MySQL:', err);
  }

  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
};

startServer();
