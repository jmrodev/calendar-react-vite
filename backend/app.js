import express from "express";
import { config } from "dotenv";
import configExpress from "./config/express.js";
import router from "./Router/router.js";
import { createServer } from 'net';

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

function findAvailablePort(startPort) {
  return new Promise((resolve, reject) => {
    const server = createServer();
    
    server.listen(startPort, () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        findAvailablePort(startPort + 1).then(resolve, reject);
      } else {
        reject(err);
      }
    });
  });
}

const port = process.env.PORT || await findAvailablePort(3000);

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${port} is busy, trying ${port + 1}`);
    server.listen(port + 1);
  } else {
    console.error('Server error:', err);
  }
});

export default app;
