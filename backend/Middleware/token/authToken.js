import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { createStructuredDate } from "../../Utils/date/dateUtils.js";

dotenv.config();
const secretKey = process.env.JWT_SECRET;

export const authToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ 
      error: "Unauthorized", 
      message: "Token no proporcionado" 
    });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ 
      error: "Unauthorized", 
      message: "Token no válido" 
    });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    
    // Verificar si el token ha expirado
    const currentDate = createStructuredDate(new Date());
    const expDate = createStructuredDate(new Date(decoded.exp * 1000));
    
    if (compareStructuredDates(currentDate, expDate) > 0) {
      return res.status(401).json({ 
        error: "Token Expired", 
        message: "La sesión ha expirado, por favor inicie sesión nuevamente" 
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ 
        error: "Token Expired", 
        message: "La sesión ha expirado, por favor inicie sesión nuevamente" 
      });
    }
    return res.status(403).json({ 
      error: "Forbidden", 
      message: "Error de autenticación" 
    });
  }
};
