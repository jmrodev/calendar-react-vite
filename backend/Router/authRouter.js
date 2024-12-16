import { Router } from "express";
import {
  loginController,
  logoutController,
  registerController,
  refreshTokenController,
} from "../Controller/authController.js";

const router = Router();
router.post("/login", loginController);
router.post("/logout", logoutController);
router.post("/register", registerController);
router.post("/refresh-token", refreshTokenController);

export default router;
