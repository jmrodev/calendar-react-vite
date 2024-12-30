import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const authMiddleware = (req, res, next) => {
  try {
    if (req.method === 'OPTIONS') {
      return next();
    }

    const authHeader = req.headers.authorization;
    console.log('Auth Header:', authHeader);

    if (!authHeader) {
      return res.status(401).json({ 
        error: "Unauthorized",
        message: 'No se proporcionó token de autenticación' 
      });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token extraído:', token);

    if (!token) {
      return res.status(401).json({ 
        error: "Unauthorized",
        message: 'Formato de token inválido' 
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token decodificado:', decoded);
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