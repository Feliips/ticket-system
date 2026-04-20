const express = require("express");
const router = express.Router();
const db = require("../db");

// POST - cadastrar usuário
router
  .route("/")
  .post(async (req, res) => {
    const { nome, login, senha } = req.body;

    if (!nome || !login || !senha) {
      return res
        .status(400)
        .json({ erro: "nome, login e senha são obrigatórios" });
    }

    const sql = `
      INSERT INTO tbUsuarios (nome, login, senha)
      VALUES (?, ?, ?)
    `;

    try {
      await db.execute(sql, [nome, login, senha]);
      return res.status(201).json({ mensagem: "Usuário cadastrado com sucesso!" });
    } catch (err) {
      console.error("Erro ao cadastrar usuário:", err);

      if (err && err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ erro: "Login já cadastrado" });
      }

      return res.status(500).json({ erro: "Erro ao cadastrar usuário" });
    }
  })
  .all((req, res) => {
    return res
      .status(405)
      .set("Allow", "POST")
      .json({ erro: "Método não permitido nesta rota" });
  });

module.exports = router;
