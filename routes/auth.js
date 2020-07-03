const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const authController = require("../controllers/authController");
const auth = require("../middlewares/auth");

// Iniciar sesion
router.post("/", authController.autenticarUsuario);

// Obtener usuario autenticado
router.get("/", auth, authController.usuarioAutenticado);

module.exports = router;
