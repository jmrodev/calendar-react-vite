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
    res.status(200).json(result);
  } catch (error) {
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
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });
    const newToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token: newToken });
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
};


