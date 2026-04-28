const bcrypt = require("bcryptjs");
const db = require("../db");
const AppError = require("../utils/appError");

const SALT_ROUNDS = 10;

const buildFilters = ({ nome, login }) => {
  const filters = [];
  const values = [];

  if (nome) {
    filters.push("nome LIKE ?");
    values.push(`%${nome}%`);
  }

  if (login) {
    filters.push("login LIKE ?");
    values.push(`%${login}%`);
  }

  const whereClause = filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";
  return { whereClause, values };
};

const listUsers = async ({ page, limit, offset, nome, login }) => {
  const { whereClause, values } = buildFilters({ nome, login });

  const countSql = `SELECT COUNT(*) AS total FROM tbUsuarios ${whereClause}`;
  const [countRows] = await db.execute(countSql, values);
  const total = countRows[0]?.total || 0;

  const listSql = `
    SELECT usuario_id, nome, login, atualizado_em, atualizado_por
    FROM tbUsuarios
    ${whereClause}
    ORDER BY usuario_id DESC
    LIMIT ? OFFSET ?
  `;

  const [rows] = await db.execute(listSql, [...values, limit, offset]);

  return {
    items: rows,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1
    }
  };
};

const getUserById = async (id) => {
  const sql = `
    SELECT usuario_id, nome, login, atualizado_em, atualizado_por
    FROM tbUsuarios
    WHERE usuario_id = ?
    LIMIT 1
  `;

  const [rows] = await db.execute(sql, [id]);
  return rows[0] || null;
};

const getUserByLogin = async (login) => {
  const sql = `
    SELECT usuario_id, nome, login, atualizado_em, atualizado_por
    FROM tbUsuarios
    WHERE login = ?
    LIMIT 1
  `;

  const [rows] = await db.execute(sql, [login]);
  return rows[0] || null;
};

const createUser = async ({ nome, login, senha }) => {
  const existingUser = await getUserByLogin(login);
  if (existingUser) {
    throw new AppError("Login ja cadastrado", 409, "LOGIN_DUPLICATE");
  }

  const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);
  const sql = `
    INSERT INTO tbUsuarios (nome, login, senha)
    VALUES (?, ?, ?)
  `;

  const [result] = await db.execute(sql, [nome, login, senhaHash]);
  return result.insertId;
};

const updateUser = async (id, { nome, login }) => {
  const currentUser = await getUserById(id);
  if (!currentUser) {
    return 0;
  }

  const existingUser = await getUserByLogin(login);
  if (existingUser && existingUser.usuario_id !== id) {
    throw new AppError("Login ja cadastrado", 409, "LOGIN_DUPLICATE");
  }

  const sql = `
    UPDATE tbUsuarios
    SET nome = ?, login = ?, atualizado_em = CURRENT_TIMESTAMP
    WHERE usuario_id = ?
  `;

  const [result] = await db.execute(sql, [nome, login, id]);
  return result.affectedRows;
};

const updatePassword = async (id, novaSenha) => {
  const senhaHash = await bcrypt.hash(novaSenha, SALT_ROUNDS);
  const sql = `
    UPDATE tbUsuarios
    SET senha = ?, atualizado_em = CURRENT_TIMESTAMP
    WHERE usuario_id = ?
  `;

  const [result] = await db.execute(sql, [senhaHash, id]);
  return result.affectedRows;
};

const deleteUser = async (id) => {
  const sql = "DELETE FROM tbUsuarios WHERE usuario_id = ?";
  const [result] = await db.execute(sql, [id]);
  return result.affectedRows;
};

module.exports = {
  listUsers,
  getUserById,
  getUserByLogin,
  createUser,
  updateUser,
  updatePassword,
  deleteUser
};
