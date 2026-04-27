const errorHandler = (err, req, res, next) => {
  console.error("Erro na API:", err);

  if (err && err.code === "ER_DUP_ENTRY") {
    return res.status(409).json({ erro: "Login ja cadastrado" });
  }

  if (err && err.code === "ECONNREFUSED") {
    return res.status(503).json({ erro: "Sem conexao com o banco de dados", detalhes: err.code });
  }

  return res.status(500).json({ erro: "Erro interno no servidor" });
};

module.exports = errorHandler;
