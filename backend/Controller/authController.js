import { authService } from "../Service/authService.js";
import jwt from "jsonwebtoken";

export const loginController = async (req, res) => {
  try {
    const { username, password } = req.body;
    const { rememberMe } = req.query;
    
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Usuario y contraseña son requeridos"
      });
    }

    const result = await authService.login(username, password, rememberMe, {
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });
    
    res.status(200).json({
      success: true,
      message: "Login successful",
      token: result.token,
      user: result.user,
      expiresIn: rememberMe ? '7d' : '1h'
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const logoutController = async (req, res) => {
  try {
    await authService.logout(req.session);
    res.status(200).json({ 
      success: true,
      message: "Logout successful" 
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

export const registerController = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Todos los campos son requeridos",
      });
    }

    const result = await authService.register(username, password, role);
    res.status(201).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const refreshTokenController = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ 
        success: false,
        message: "No authorization header" 
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: "No token provided" 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      ignoreExpiration: true,
    });
    
    const newToken = jwt.sign(
      { 
        id: decoded.id, 
        role: decoded.role,
        username: decoded.username 
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    
    res.json({ 
      success: true,
      token: newToken,
      user: {
        id: decoded.id,
        role: decoded.role,
        username: decoded.username
      }
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(403).json({ 
      success: false,
      message: "Token inválido o expirado" 
    });
  }
};
