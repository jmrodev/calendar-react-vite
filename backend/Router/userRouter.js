import { Router } from "express";
import {
  createUserController,
  deleteUserController,
  getAllUsersController,
  getUserByIdController,
  updateUserController
} from "../Controller/userController.js";
import { authorize } from "../middleware/roles/authorize.js";
import { authMiddleware } from "../middleware/auth.js";
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiting para rutas de usuarios
const userLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // límite de 100 peticiones
});

router.get(
  "/",
  authMiddleware,
  authorize("users", "read"),
  userLimiter,
  getAllUsersController
);

router.get(
  "/:id",
  authMiddleware,
  authorize("users", "read"),
  userLimiter,
  getUserByIdController
);

router.post(
  "/",
  authMiddleware,
  authorize("users", "create"),
  userLimiter,
  createUserController
);

router.put(
  "/:id",
  authMiddleware,
  authorize("users", "update"),
  userLimiter,
  updateUserController
);

router.delete(
  "/:id",
  authMiddleware,
  authorize("users", "delete"),
  userLimiter,
  deleteUserController
);

export default router;
