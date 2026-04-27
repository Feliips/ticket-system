const express = require("express");
const router = express.Router();
const usuariosController = require("../controllers/usuariosController");

router.get("/", usuariosController.list);
router.get("/:id", usuariosController.getById);
router.post("/", usuariosController.create);
router.put("/:id", usuariosController.update);
router.patch("/:id/senha", usuariosController.updatePassword);
router.delete("/:id", usuariosController.remove);

module.exports = router;
