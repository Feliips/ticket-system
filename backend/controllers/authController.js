const bcrypt = require("bcryptjs");
const authService = require("../services/authService");
const { validateLoginPayload } = require("../validators/authValidator");
const { signToken } = require("../utils/jwt");

const login = async (req, res, next) => {
  const parsedBody = validateLoginPayload(req.body);
  if (!parsedBody.valid) {
    return res.status(400).json({ erro: parsedBody.error });
  }

  try {
    const user = await authService.getUserWithPasswordByLogin(parsedBody.data.login);
    if (!user) {
      return res.status(401).json({ erro: "Login ou senha invalidos" });
    }

    const passwordMatches = await bcrypt.compare(parsedBody.data.senha, user.senha);
    if (!passwordMatches) {
      return res.status(401).json({ erro: "Login ou senha invalidos" });
    }

    const token = signToken({
      sub: String(user.usuario_id),
      usuario_id: user.usuario_id,
      login: user.login
    });

    return res.status(200).json({
      mensagem: "Login realizado com sucesso",
      data: {
        token,
        usuario: {
          usuario_id: user.usuario_id,
          nome: user.nome,
          login: user.login,
          atualizado_em: user.atualizado_em,
          atualizado_por: user.atualizado_por
        }
      }
    });
  } catch (err) {
    return next(err);
  }
};

const me = async (req, res, next) => {
  const usuarioId = req.user?.usuario_id;

  if (!usuarioId || usuarioId <= 0) {
    return res.status(403).json({ erro: "Token invalido" });
  }

  try {
    const user = await authService.getPublicUserById(usuarioId);
    if (!user) {
      return res.status(404).json({ erro: "Usuario nao encontrado" });
    }

    return res.status(200).json({
      mensagem: "Usuario autenticado",
      data: user
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  login,
  me
};
