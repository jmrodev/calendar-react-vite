import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { createStructuredDate, isDateLocked } from '../Utils/date/dateUtils.js';

dotenv.config();

export const authMiddleware = (req, res, next) => {
  console.log('Headers:', req.headers);
  console.log('Method:', req.method);

  try {
    if (req.method === 'OPTIONS') {
      return next();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.log('No authorization header');
      return res.status(401).json({ message: 'No se proporcionó token de autenticación' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      console.log('No token found in header');
      return res.status(401).json({ message: 'Formato de token inválido' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token decoded:', decoded);

      // Verificar bloqueo de usuario
      if (decoded.lockUntil) {
        const currentDate = createStructuredDate(new Date());
        const lockUntil = createStructuredDate(decoded.lockUntil);
        
        if (isDateLocked(currentDate, lockUntil)) {
          return res.status(403).json({ 
            message: 'Usuario bloqueado temporalmente',
            lockUntil: decoded.lockUntil
          });
        }
      }

      req.user = decoded;
      next();
    } catch (error) {
      console.error('Error verificando token:', error);
      return res.status(401).json({ message: 'Token inválido o expirado' });
    }
  } catch (error) {
    console.error('Error en authMiddleware:', error);
    return res.status(500).json({ message: 'Error en la autenticación' });
  }
}; 