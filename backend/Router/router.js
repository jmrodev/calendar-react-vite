import { Router } from "express";
import authRouter from "./authRouter.js";
import appointmentRouter from "./appointmentRouter.js";
import userRouter from "./userRouter.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/appointments", authMiddleware, appointmentRouter);
router.use("/users", authMiddleware, userRouter);

export default router;
