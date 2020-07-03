const express = require("express");
const router = express.Router();
const tareaController = require("../controllers/tareaController");
const auth = require("../middlewares/auth");
const { check } = require("express-validator");

// Crear tarea
router.post(
  "/",
  auth,
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("proyecto", "El proyecto es obligatorio").not().isEmpty(),
  ],
  tareaController.crearTarea
);

// Obtener tareas
router.get("/", auth, tareaController.obtenerTareas);

// Actualizar tarea
router.put("/:id", auth, tareaController.actualizarTarea);

// Eliminar tarea
router.delete("/:id", auth, tareaController.eliminarTarea);

module.exports = router;
