import {
  loginService,
  logoutService,
  registerService,
} from "../Service/authService.js";
import jwt from "jsonwebtoken";

export const loginController = async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await loginService(username, password, req);
    
    if (!result.token) {
      throw new Error("Token no generado");
    }

    console.log("Login successful, token:", result.token);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token: result.token,
      user: result.user
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const logoutController = async (req, res) => {
  try {
    await logoutService(req.session);
    res.json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const registerController = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Error en registerController: Todos los campos son requeridos",
      });
    }

    const result = await registerService(username, password, role);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const refreshTokenController = async (req, res) => {
  const authHeader = req.headers["authorization"];
  console.log("Refresh token - Auth header:", authHeader);

  if (!authHeader) {
    return res.status(401).json({ message: "No authorization header" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      ignoreExpiration: true,
    });

    console.log("Refresh token - Decoded token:", decoded);

    const newToken = jwt.sign(
      { 
        id: decoded.id, 
        role: decoded.role,
        username: decoded.username 
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("Refresh token - New token generated:", newToken);

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
