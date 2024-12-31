import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

export default (app) => {
  // Logging middleware
  app.use(morgan('dev'));

  // Configuración de CORS
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
      message: 'Error interno del servidor',
    });
  });

  // Middleware para logging
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
}