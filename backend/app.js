import express from "express";
import configExpress from "./config/express.js";
import appointmentRouter from "./Router/appointmentRouter.js";
import authRouter from "./Router/authRouter.js";
import { authMiddleware } from "./middleware/auth.js";

const app = express();

configExpress(app);

app.use("/api/auth", authRouter);
app.use("/api/appointments", authMiddleware, appointmentRouter);

export default app;
