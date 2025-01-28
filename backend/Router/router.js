import { Router } from "express";
import authRouter from "./authRouter.js";
import appointmentRouter from "./appointmentRouter.js";
import userRouter from "./userRouter.js";
import { authMiddleware } from "../middleware/auth.js";
import rateLimit from "express-rate-limit";

const router = Router();

// Rate limiters
const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Demasiadas peticiones, intente más tarde"
  }
});

const authenticatedLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: {
    success: false,
    message: "Demasiadas peticiones, intente más tarde"
  }
});

// Rutas públicas
router.use("/auth", publicLimiter, authRouter);

// Health check
router.get("/health", publicLimiter, (req, res) => {
  res.status(200).json({
    success: true,
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Rutas protegidas
router.use("/appointments", authenticatedLimiter, authMiddleware, appointmentRouter);
router.use("/users", authenticatedLimiter, authMiddleware, userRouter);

router.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Ruta no encontrada",
  });
});

export default router;
