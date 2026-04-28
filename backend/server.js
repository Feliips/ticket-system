const express = require('express');
const path = require('path');
const cors = require('cors');
const db = require('./db');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

// rotas
const usuariosRoutes = require('./routes/usuarios');
const authRoutes = require('./routes/auth');
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/auth', authRoutes);

// servir frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// rota principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await db.query('SELECT 1');
    console.log('Conectado ao MySQL!');
  } catch (err) {
    console.error('Falha no teste de conexao com MySQL:', err);
    console.error(
      'Revise no Render as variaveis DB_HOST/DB_PORT/DB_USER/DB_PASSWORD/DB_NAME (ou MYSQL_ADDON_*)'
    );
  }

  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
};

module.exports = app;

if (require.main === module) {
  startServer();
}
