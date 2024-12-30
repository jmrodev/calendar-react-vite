import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { createStructuredDate } from "../../Utils/date/dateUtils.js";

dotenv.config();
const secretKey = process.env.JWT_SECRET;

export const authToken = async (req, res, next) => {
  const token = req.header('Authorization');
  
  console.log('Token recibido:', token); // Log para debugging
  
  if (!token) {
    console.log('No se proporcionó token'); // Log para debugging
    return res.status(403).json({
      error: 'Forbidden error',
      message: 'No token provided'
    });
  }

  try {
    const tokenValue = token.startsWith('Bearer ') ? token.slice(7) : token;
    console.log('Token a verificar:', tokenValue); // Log para debugging
    
    const decoded = jwt.verify(tokenValue, secretKey);
    console.log('Token decodificado:', decoded); // Log para debugging
    
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error de verificación:', error); // Log para debugging
    return res.status(403).json({
      error: 'Forbidden error',
      message: 'Error de autenticación authtoken'
    });
  }
};
