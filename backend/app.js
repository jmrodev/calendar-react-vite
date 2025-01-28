import express from "express";
import { config } from "dotenv";
import configExpress from "./config/express.js";
import router from "./Router/router.js";

// Cargar variables de entorno
config();

const app = express();

// Configuración de Express
configExpress(app);

// Rutas API
app.use("/api", router);

// Manejo de rutas no encontradas
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Ruta no encontrada"
  });
});

// Manejo de errores de sintaxis JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: "JSON inválido"
    });
  }
  next(err);
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  
  const errorMessage = process.env.NODE_ENV === "development" 
    ? err.message 
    : "Error interno del servidor";

  res.status(err.status || 500).json({
    success: false,
    message: errorMessage,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
});

// Configuración del puerto
const PORT = process.env.PORT || 3000;

// Iniciar servidor (excepto en pruebas)
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    console.log(`📝 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  });
}

export default app;
