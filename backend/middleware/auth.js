import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { createStructuredDate, isDateLocked } from '../Utils/date/dateUtils.js';

dotenv.config();

export const authMiddleware = (req, res, next) => {
  try {
    if (req.method === 'OPTIONS') {
      return next();
    }

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

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

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

      req.user = decoded;
      next();
    } catch (error) {
      console.error('Error verificando token:', error);
      return res.status(401).json({ 
        error: "Unauthorized",
        message: 'Token inválido o expirado' 
      });
    }
  } catch (error) {
    console.error('Error en authMiddleware:', error);
    return res.status(500).json({ 
      error: "Server Error",
      message: 'Error en la autenticación' 
    });
  }
}; 