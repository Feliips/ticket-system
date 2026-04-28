const { verifyToken } = require("../utils/jwt");

const auth = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({ erro: "Token ausente" });
  }

  const match = authorization.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    return res.status(401).json({ erro: "Token ausente" });
  }

  const token = match[1];

  try {
    const payload = verifyToken(token);
    req.user = {
      usuario_id: Number(payload.usuario_id || payload.sub),
      login: payload.login
    };

    return next();
  } catch (err) {
    return res.status(403).json({ erro: "Token invalido" });
  }
};

module.exports = auth;
