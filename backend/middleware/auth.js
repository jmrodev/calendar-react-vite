import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { createStructuredDate, isDateLocked } from '../Utils/date/dateUtils.js';

dotenv.config();
const secretKey = process.env.JWT_SECRET;

// Agregar blacklist de tokens
const tokenBlacklist = new Set();

export const invalidateToken = (token) => {
  tokenBlacklist.add(token);
};

export const authMiddleware = (req, res, next) => {
  try {
    if (req.method === 'OPTIONS') return next();

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ 
        error: "Unauthorized",
        message: 'No se proporcionó token de autenticación' 
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ 
        error: "Unauthorized",
        message: 'Formato de token inválido' 
      });
    }

    if (tokenBlacklist.has(token)) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Token invalidado"
      });
    }

    const decoded = jwt.verify(token, secretKey);
    
    // Verificación de bloqueo temporal
    if (decoded.lockUntil) {
      const currentDate = createStructuredDate(new Date());
      const lockUntil = createStructuredDate(decoded.lockUntil);
      
      if (isDateLocked(currentDate, lockUntil)) {
        return res.status(403).json({ 
          error: "Forbidden",
          message: 'Usuario bloqueado temporalmente',
          lockUntil: decoded.lockUntil
        });
      }
    }

    // Agregar información de auditoría base
    req.audit = {
      userId: decoded.id,
      username: decoded.username,
      timestamp: new Date()
    };

    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error en autenticación:', error);
    return res.status(401).json({ 
      error: "Unauthorized",
      message: 'Token inválido o expirado' 
    });
  }
};

// Función auxiliar para verificar token (para uso interno si es necesario)
export const verifyToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new Error("No se proporcionó token de autenticación");
  }

  const token = authHeader.split(" ")[1];
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    throw new Error("Token inválido o expirado");
  }
}; 