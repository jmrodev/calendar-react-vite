import {
  loginService,
  logoutService,
  registerService,
} from "../Service/authService.js";

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
