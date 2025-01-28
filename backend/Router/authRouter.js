import { Router } from "express";
import {
  loginController,
  logoutController,
  registerController,
  refreshTokenController
} from "../Controller/authController.js";
import { authMiddleware } from "../middleware/auth.js";
import { authorize } from "../middleware/roles/authorize.js";
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiting para rutas de autenticación
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5 // límite de 5 intentos
});

// Rutas públicas
router.post("/login", authLimiter, loginController);
router.post("/refresh-token", authLimiter, refreshTokenController);

// Rutas protegidas
router.post("/logout", authMiddleware, logoutController);
router.post("/register", 
  authMiddleware, 
  authorize("users", "create"), 
  registerController
);

// Ruta para verificar estado de la cuenta
router.get("/check-account/:username", authLimiter, async (req, res) => {
  try {
    const { username } = req.params;
    const accountStatus = await authService.checkAccountStatus(username);
    res.json(accountStatus);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
