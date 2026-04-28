const express = require("express");
const router = express.Router();
const usuariosController = require("../controllers/usuariosController");
const authMiddleware = require("../middlewares/auth");

router.get("/", authMiddleware, usuariosController.list);
router.get("/:id", authMiddleware, usuariosController.getById);
router.post("/", usuariosController.create);
router.put("/:id", authMiddleware, usuariosController.update);
router.patch("/:id/senha", authMiddleware, usuariosController.updatePassword);
router.delete("/:id", authMiddleware, usuariosController.remove);

module.exports = router;