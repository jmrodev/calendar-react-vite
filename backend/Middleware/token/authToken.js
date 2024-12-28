import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { standardizeDate } from "../../Utils/date/dateUtils.js";

dotenv.config();
const secretKey = process.env.JWT_SECRET;

export const authToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log("AUTH HEADER:", authHeader);
  console.log("REQUEST PATH:", req.path);
  console.log("REQUEST METHOD:", req.method);

  if (!authHeader) {
    return res.status(401).json({ 
      error: "No token provided", 
      message: "Por favor, inicie sesión." 
    });
  }

  const token = authHeader.split(" ")[1];
  console.log("EXTRACTED TOKEN:", token);

  if (!token) {
    return res.status(401).json({ 
      error: "Invalid token format", 
      message: "Formato de token inválido" 
    });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    console.log("DECODED TOKEN:", decoded);

    // Verificar la fecha si existe en el token
    if (decoded.date) {
      const tokenDate = decoded.date;
      const currentDate = standardizeDate(new Date());
      console.log("Token date:", tokenDate);
      console.log("Current date:", currentDate);
    }

    req.user = {
      id: decoded.id,
      role: decoded.role,
      username: decoded.username
    };

    next();
  } catch (err) {
    console.error("Error de verificación de token:", err);
    
    if (err.name === "JsonWebTokenError") {
      return res.status(403).json({ 
        error: "Forbidden", 
        message: "Token inválido o malformado" 
      });
    }
    if (err.name === "TokenExpiredError") {
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
