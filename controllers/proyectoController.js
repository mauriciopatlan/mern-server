const Proyecto = require("../models/Proyecto");
const { validationResult } = require("express-validator");

exports.crearProyecto = async (req, res) => {
  // Revisar errores
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    return res.status(400).json({
      errores: errores.array(),
    });
  }
  try {
    const proyecto = new Proyecto(req.body);

    // Obtener creador
    proyecto.creador = req.usuario.id;
    // Guardar proyecto
    proyecto.save();
    res.json(proyecto);
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

// Obtener proyectos del usuario logeado
exports.obtenerProyectos = async (req, res) => {
  try {
    const proyectos = await Proyecto.find({ creador: req.usuario.id }).sort({
      creado: -1,
    });
    res.json({ proyectos });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error" });
  }
};

// Actualizar proyectos
exports.actualizarProyecto = async (req, res) => {
  // Revisar errores
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    return res.status(400).json({
      errores: errores.array(),
    });
  }
  // Extraer info del proyecto
  const { nombre } = req.body;
  const nuevoProyecto = {};
  if (nombre) {
    nuevoProyecto.nombre = nombre;
  }

  try {
    // Revisar id
    let proyecto = await Proyecto.findById(req.params.id);
    // Revisar proyecto
    if (!proyecto) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }
    // Verificar creador
    if (proyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }
    // Actualizar
    proyecto = await Proyecto.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: nuevoProyecto },
      { new: true }
    );

    res.json({ proyecto });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// Eliminar proyecto
exports.eliminarProyecto = async (req, res) => {
  try {
    // Revisar id
    let proyecto = await Proyecto.findById(req.params.id);
    // Revisar proyecto
    if (!proyecto) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }
    // Verificar creador
    if (proyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }
    // Eliminar
    await Proyecto.findOneAndRemove({ _id: req.params.id });
    res.json({ msg: "Proyecto eliminado" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};
