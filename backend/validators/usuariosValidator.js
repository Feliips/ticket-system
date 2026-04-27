const toInt = (value) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
};

const validateCreateUser = (payload) => {
  const { nome, login, senha } = payload || {};

  if (!nome || !login || !senha) {
    return { valid: false, error: "nome, login e senha sao obrigatorios" };
  }

  if (String(nome).trim().length < 3) {
    return { valid: false, error: "nome deve ter ao menos 3 caracteres" };
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
      nome: String(nome).trim(),
      login: String(login).trim(),
      senha: String(senha)
    }
  };
};

const validateUpdateUser = (payload) => {
  const { nome, login } = payload || {};

  if (!nome || !login) {
    return { valid: false, error: "nome e login sao obrigatorios" };
  }

  if (String(nome).trim().length < 3) {
    return { valid: false, error: "nome deve ter ao menos 3 caracteres" };
  }

  if (String(login).trim().length < 3) {
    return { valid: false, error: "login deve ter ao menos 3 caracteres" };
  }

  return {
    valid: true,
    data: {
      nome: String(nome).trim(),
      login: String(login).trim()
    }
  };
};

const validateUpdatePassword = (payload) => {
  const { novaSenha } = payload || {};

  if (!novaSenha) {
    return { valid: false, error: "novaSenha e obrigatoria" };
  }

  if (String(novaSenha).length < 6) {
    return { valid: false, error: "novaSenha deve ter ao menos 6 caracteres" };
  }

  return {
    valid: true,
    data: {
      novaSenha: String(novaSenha)
    }
  };
};

const validateId = (idValue) => {
  const id = toInt(idValue);

  if (!id || id <= 0) {
    return { valid: false, error: "id invalido" };
  }

  return { valid: true, data: id };
};

const validateListParams = (query) => {
  const page = toInt(query?.page) || 1;
  const limit = toInt(query?.limit) || 10;
  const nome = query?.nome ? String(query.nome).trim() : "";
  const login = query?.login ? String(query.login).trim() : "";

  if (page <= 0) {
    return { valid: false, error: "page deve ser maior que zero" };
  }

  if (limit <= 0 || limit > 100) {
    return { valid: false, error: "limit deve estar entre 1 e 100" };
  }

  return {
    valid: true,
    data: {
      page,
      limit,
      offset: (page - 1) * limit,
      nome,
      login
    }
  };
};

module.exports = {
  validateCreateUser,
  validateUpdateUser,
  validateUpdatePassword,
  validateId,
  validateListParams
};
