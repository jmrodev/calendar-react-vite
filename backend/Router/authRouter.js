import { Router } from "express";
import {
  loginController,
  logoutController,
  registerController,
  refreshTokenController,
} from "../Controller/authController.js";
import { authMiddleware } from "../middleware/auth.js";
import { authorize } from "../middleware/roles/authorize.js";
import rateLimit from "express-rate-limit";

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
});

router.post("/login", authLimiter, loginController);
router.post("/refresh-token", authLimiter, refreshTokenController);

router.post("/logout", authMiddleware, logoutController);
router.post(
  "/register",
  authMiddleware,
  authorize("users", "create"),
  registerController
);

router.get("/check-account/:username", authLimiter, async (req, res) => {
  try {
    const { username } = req.params;
    const accountStatus = await authService.checkAccountStatus(username);
    res.json(accountStatus);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
