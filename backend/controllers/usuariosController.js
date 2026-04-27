const usuariosService = require("../services/usuariosService");
const {
  validateCreateUser,
  validateUpdateUser,
  validateUpdatePassword,
  validateId,
  validateListParams
} = require("../validators/usuariosValidator");

const list = async (req, res, next) => {
  const parsed = validateListParams(req.query);
  if (!parsed.valid) {
    return res.status(400).json({ erro: parsed.error });
  }

  try {
    const data = await usuariosService.listUsers(parsed.data);
    return res.status(200).json({ mensagem: "Usuarios listados com sucesso", data });
  } catch (err) {
    return next(err);
  }
};

const getById = async (req, res, next) => {
  const parsedId = validateId(req.params.id);
  if (!parsedId.valid) {
    return res.status(400).json({ erro: parsedId.error });
  }

  try {
    const user = await usuariosService.getUserById(parsedId.data);
    if (!user) {
      return res.status(404).json({ erro: "Usuario nao encontrado" });
    }

    return res.status(200).json({ mensagem: "Usuario encontrado", data: user });
  } catch (err) {
    return next(err);
  }
};

const create = async (req, res, next) => {
  const parsedBody = validateCreateUser(req.body);
  if (!parsedBody.valid) {
    return res.status(400).json({ erro: parsedBody.error });
  }

  try {
    const id = await usuariosService.createUser(parsedBody.data);
    const createdUser = await usuariosService.getUserById(id);
    return res.status(201).json({ mensagem: "Usuario cadastrado com sucesso", data: createdUser });
  } catch (err) {
    return next(err);
  }
};

const update = async (req, res, next) => {
  const parsedId = validateId(req.params.id);
  if (!parsedId.valid) {
    return res.status(400).json({ erro: parsedId.error });
  }

  const parsedBody = validateUpdateUser(req.body);
  if (!parsedBody.valid) {
    return res.status(400).json({ erro: parsedBody.error });
  }

  try {
    const affectedRows = await usuariosService.updateUser(parsedId.data, parsedBody.data);
    if (affectedRows === 0) {
      return res.status(404).json({ erro: "Usuario nao encontrado" });
    }

    const updatedUser = await usuariosService.getUserById(parsedId.data);
    return res.status(200).json({ mensagem: "Usuario atualizado com sucesso", data: updatedUser });
  } catch (err) {
    return next(err);
  }
};

const updatePassword = async (req, res, next) => {
  const parsedId = validateId(req.params.id);
  if (!parsedId.valid) {
    return res.status(400).json({ erro: parsedId.error });
  }

  const parsedBody = validateUpdatePassword(req.body);
  if (!parsedBody.valid) {
    return res.status(400).json({ erro: parsedBody.error });
  }

  try {
    const affectedRows = await usuariosService.updatePassword(parsedId.data, parsedBody.data.novaSenha);
    if (affectedRows === 0) {
      return res.status(404).json({ erro: "Usuario nao encontrado" });
    }

    return res.status(200).json({ mensagem: "Senha atualizada com sucesso" });
  } catch (err) {
    return next(err);
  }
};

const remove = async (req, res, next) => {
  const parsedId = validateId(req.params.id);
  if (!parsedId.valid) {
    return res.status(400).json({ erro: parsedId.error });
  }

  try {
    const affectedRows = await usuariosService.deleteUser(parsedId.data);
    if (affectedRows === 0) {
      return res.status(404).json({ erro: "Usuario nao encontrado" });
    }

    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  list,
  getById,
  create,
  update,
  updatePassword,
  remove
};
