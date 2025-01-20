import { Router } from "express";
import {
  loginController,
  logoutController,
  registerController,
  refreshTokenController,
} from "../Controller/authController.js";
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Rutas públicas
router.post('/login', loginController);
router.post('/register', registerController);

// Rutas protegidas
router.post('/logout', authMiddleware, logoutController);
router.post('/refresh-token', authMiddleware, refreshTokenController);

export default router;
