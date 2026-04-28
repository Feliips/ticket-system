const errorHandler = (err, req, res, next) => {
  console.error("Erro na API:", err);

  if (err && Number.isInteger(err.status)) {
    return res.status(err.status).json({
      erro: err.message,
      code: err.code || "APP_ERROR"
    });
  }

  if (err && err.code === "ER_DUP_ENTRY") {
    const duplicateLogin = typeof err.sqlMessage === "string" && err.sqlMessage.includes("login");
    return res.status(409).json({
      erro: duplicateLogin ? "Login ja cadastrado" : "Registro duplicado",
      code: "DUPLICATE_ENTRY"
    });
  }

  if (err && err.code === "ECONNREFUSED") {
    return res.status(503).json({
      erro: "Sem conexao com o banco de dados",
      code: "DB_UNAVAILABLE",
      detalhes: err.code
    });
  }

  return res.status(500).json({ erro: "Erro interno no servidor", code: "INTERNAL_SERVER_ERROR" });
};

module.exports = errorHandler;
