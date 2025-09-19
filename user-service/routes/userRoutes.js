const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");

// Usuarios
router.get("/", UserController.getAllUsuarios);
router.get("/email/:correo_electronico", UserController.findByCorreo);
router.get("/:id", UserController.getUsuarioById);
router.post("/", UserController.createUsuario);
router.put("/:id", UserController.updateUsuario);
router.delete("/:id", UserController.deleteUsuario);
router.post("/validate", UserController.validateUsuario);

module.exports = router;