import { Router } from "express";
import {
  loginController,
  logoutController,
  registerController,
  refreshTokenController
} from "../Controller/authController.js";
import { authMiddleware } from "../middleware/auth.js";
import { authorize } from "../middleware/roles/authorize.js";

const router = Router();

// Rutas públicas (no requieren autenticación)
router.post("/login", loginController);
router.post("/refresh-token", refreshTokenController);

// Rutas protegidas
router.post("/logout", authMiddleware, logoutController);
router.post("/register", 
  authMiddleware, 
  authorize("users", "create"), 
  registerController
);

export default router;
