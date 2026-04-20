const express = require("express");
const router = express.Router();
const db = require("../db");

// POST - cadastrar usuário
router
  .route("/")
  .post((req, res) => {
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

    db.query(sql, [nome, login, senha], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ erro: "Erro ao cadastrar usuário" });
      }

      return res.status(201).json({ mensagem: "Usuário cadastrado com sucesso!" });
    });
  })
  .all((req, res) => {
    return res
      .status(405)
      .set("Allow", "POST")
      .json({ erro: "Método não permitido nesta rota" });
  });

module.exports = router;
