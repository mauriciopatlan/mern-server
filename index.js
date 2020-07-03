const express = require("express");
const conectarDB = require("./config/db");
const cors = require("cors");

const usuariosRoutes = require("./routes/usuarios");
const authRoutes = require("./routes/auth");
const proyectosRoutes = require("./routes/proyectos");
const tareasRoutes = require("./routes/tareas");

const app = express();

conectarDB();

// Habilitar cors
app.use(cors());

// Habilitar express.json
app.use(express.json({ extended: true }));

const PORT = process.env.PORT || 4000;

app.use("/api/usuarios", usuariosRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/proyectos", proyectosRoutes);
app.use("/api/tareas", tareasRoutes);

app.listen(PORT, () => {
  console.log(`El servidor escucha en el puerto ${PORT}`);
});
