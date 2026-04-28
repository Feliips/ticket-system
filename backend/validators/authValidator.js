const validateLoginPayload = (payload) => {
  const { login, senha } = payload || {};

  if (!login || !senha) {
    return { valid: false, error: "login e senha sao obrigatorios" };
  }

  if (String(login).trim().length < 3) {
    return { valid: false, error: "login deve ter ao menos 3 caracteres" };
  }

  if (String(senha).length < 6) {
    return { valid: false, error: "senha deve ter ao menos 6 caracteres" };
  }

  return {
    valid: true,
    data: {
      login: String(login).trim().toLowerCase(),
      senha: String(senha)
    }
  };
};

module.exports = {
  validateLoginPayload
};
