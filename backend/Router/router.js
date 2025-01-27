import { Router } from "express";
import authRouter from "./authRouter.js";
import appointmentRouter from "./appointmentRouter.js";
import userRouter from "./userRouter.js";

const router = Router();

router.use("/auth", authRouter);

router.use("/appointments", appointmentRouter);
router.use("/users", userRouter);

router.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

router.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Ruta no encontrada",
  });
});

export default router;
