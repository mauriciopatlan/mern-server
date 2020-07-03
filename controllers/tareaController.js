const Tarea = require("../models/Tarea");
const Proyecto = require("../models/Proyecto");
const { validationResult } = require("express-validator");

exports.crearTarea = async (req, res) => {
  // Revisar errores
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    return res.status(400).json({
      errores: errores.array(),
    });
  }

  try {
    const { proyecto } = req.body;
    // Revisar id
    const existeProyecto = await Proyecto.findById(proyecto);
    // Revisar proyecto
    if (!existeProyecto) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }
    // Verificar creador
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }

    // Crear tarea
    const tarea = new Tarea(req.body);
    await tarea.save();
    res.json({ tarea });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error" });
  }
};

exports.obtenerTareas = async (req, res) => {
  try {
    const { proyecto } = req.query;
    // Revisar id
    const existeProyecto = await Proyecto.findById(proyecto);
    // Revisar proyecto
    if (!existeProyecto) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }
    // Verificar creador
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }

    // Obtener tareas de proyecto
    const tareas = await Tarea.find({ proyecto }).sort({ creado: -1 });
    res.json({ tareas });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error" });
  }
};

exports.actualizarTarea = async (req, res) => {
  try {
    const { proyecto, nombre, estado } = req.body;
    // Revisar id
    let tarea = await Tarea.findById(req.params.id);
    // Revisar proyecto
    if (!tarea) {
      return res.status(404).json({ msg: "Tarea no encontrada" });
    }

    // Revisar id proyecto
    const existeProyecto = await Proyecto.findById(proyecto);
    // Verificar creador
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }

    // Crear objeto con nueva informacion
    const nuevaTarea = {};
    nuevaTarea.nombre = nombre;
    nuevaTarea.estado = estado;

    // Guardar tarea
    tarea = await Tarea.findOneAndUpdate({ _id: req.params.id }, nuevaTarea, {
      new: true,
    });
    res.json({ tarea });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error" });
  }
};

exports.eliminarTarea = async (req, res) => {
  try {
    const { proyecto } = req.query;
    // Revisar id
    let tarea = await Tarea.findById(req.params.id);
    // Revisar proyecto
    if (!tarea) {
      return res.status(404).json({ msg: "Tarea no encontrada" });
    }

    // Revisar id proyecto
    const existeProyecto = await Proyecto.findById(proyecto);
    // Verificar creador
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }

    // Eliminar tarea
    await Tarea.findOneAndRemove({ _id: req.params.id });
    res.json({ msg: "Tarea eliminada" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error" });
  }
};
