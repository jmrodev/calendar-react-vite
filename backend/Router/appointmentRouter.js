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
  getAppointmentsByDate,
  getAppointmentsByMonth
} from "../Controller/appointmentController.js";

const router = Router();

// Rate limiting para citas
const appointmentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // límite de 100 peticiones
});

// Rutas protegidas con autenticación y autorización
router.get("/", 
  authMiddleware,
  authorize("appointments", "read"),
  appointmentLimiter,
  getAllAppointmentsController
);

router.get("/:id", 
  authMiddleware,
  authorize("appointments", "read"),
  appointmentLimiter,
  getAppointmentByIdController
);

router.post("/", 
  authMiddleware,
  authorize("appointments", "create"),
  appointmentLimiter,
  createAppointmentController
);

router.put("/:id", 
  authMiddleware,
  authorize("appointments", "update"),
  appointmentLimiter,
  updateAppointmentController
);

router.delete("/:id", 
  authMiddleware,
  authorize("appointments", "delete"),
  appointmentLimiter,
  deleteAppointmentController
);

// Rutas especiales
router.patch("/:id/confirm", 
  authMiddleware,
  authorize("appointments", "update"),
  appointmentLimiter,
  confirmAppointmentController
);

router.patch("/:id/complete", 
  authMiddleware,
  authorize("appointments", "update"),
  appointmentLimiter,
  completeAppointmentController
);

// Rutas de consulta por fecha
router.get("/date/:date", 
  authMiddleware,
  authorize("appointments", "read"),
  appointmentLimiter,
  getAppointmentsByDate
);

router.get("/month/:year/:month", 
  authMiddleware,
  authorize("appointments", "read"),
  appointmentLimiter,
  getAppointmentsByMonth
);

export default router;
