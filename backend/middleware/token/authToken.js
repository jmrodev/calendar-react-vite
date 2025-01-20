import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { createStructuredDate } from "../../Utils/date/dateUtils.js";

dotenv.config();
const secretKey = process.env.JWT_SECRET;

export const authToken = async (req, res, next) => {
  const token = req.header('Authorization');
  
  
  if (!token) {
    return res.status(403).json({
      error: 'Forbidden error',
      message: 'No token provided'
    });
  }

  try {
    const tokenValue = token.startsWith('Bearer ') ? token.slice(7) : token;
    
    const decoded = jwt.verify(tokenValue, secretKey);
    
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
