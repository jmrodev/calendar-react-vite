import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { authorize } from "../middleware/roles/authorize.js";
import rateLimit from 'express-rate-limit';
import {
  getAllAppointmentsController,
  getAppointmentByIdController,
  createAppointmentController,
  updateAppointmentController,
  deleteAppointmentController,
  confirmAppointmentController,
  completeAppointmentController,
  getAppointmentsByDateController,
  getAppointmentsByMonthController
} from "../Controller/appointmentController.js";

const router = Router();

// Rate limiting para citas
const appointmentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // límite de 100 peticiones
});

// Middleware común para todas las rutas
router.use(authMiddleware, appointmentLimiter);

// Rutas CRUD básicas
router.get("/", authorize("appointments", "read"), getAllAppointmentsController);
router.get("/:id", authorize("appointments", "read"), getAppointmentByIdController);
router.post("/", authorize("appointments", "create"), createAppointmentController);
router.put("/:id", authorize("appointments", "update"), updateAppointmentController);
router.delete("/:id", authorize("appointments", "delete"), deleteAppointmentController);

// Rutas de estado de citas
router.patch("/:id/confirm", authorize("appointments", "update"), confirmAppointmentController);
router.patch("/:id/complete", authorize("appointments", "update"), completeAppointmentController);

// Rutas de consulta por fecha
router.get("/date/:date", authorize("appointments", "read"), getAppointmentsByDateController);
router.get("/month/:year/:month", authorize("appointments", "read"), getAppointmentsByMonthController);

export default router;
