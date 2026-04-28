const jwt = require("jsonwebtoken");

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret || !String(secret).trim()) {
    throw new Error("JWT_SECRET nao configurado");
  }

  return secret;
};

const getJwtExpiresIn = () => process.env.JWT_EXPIRES_IN || "1h";

const signToken = (payload) => {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: getJwtExpiresIn() });
};

const verifyToken = (token) => {
  return jwt.verify(token, getJwtSecret());
};

module.exports = {
  signToken,
  verifyToken
};
