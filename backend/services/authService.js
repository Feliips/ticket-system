const db = require("../db");

const getUserWithPasswordByLogin = async (login) => {
  const sql = `
    SELECT usuario_id, nome, login, senha, atualizado_em, atualizado_por
    FROM tbUsuarios
    WHERE login = ?
    LIMIT 1
  `;

  const [rows] = await db.execute(sql, [login]);
  return rows[0] || null;
};

const getPublicUserById = async (id) => {
  const sql = `
    SELECT usuario_id, nome, login, atualizado_em, atualizado_por
    FROM tbUsuarios
    WHERE usuario_id = ?
    LIMIT 1
  `;

  const [rows] = await db.execute(sql, [id]);
  return rows[0] || null;
};

module.exports = {
  getUserWithPasswordByLogin,
  getPublicUserById
};
