import { Router } from "express";
import {
  loginController,
  logoutController,
  registerController,
  refreshTokenController,
} from "../Controller/authController.js";
import { authMiddleware } from "../middleware/auth.js";
import { authorize } from "../middleware/roles/authorize.js";

const router = Router();

router.post("/login", loginController);
router.post("/register", registerController);

router.post(
  "/logout",
  authMiddleware,
  authorize("auth", "logout"),
  logoutController
);

router.post(
  "/refresh-token",
  authMiddleware,
  authorize("auth", "refresh"),
  refreshTokenController
);

export default router;
