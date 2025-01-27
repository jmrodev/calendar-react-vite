import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { authorize } from "../middleware/roles/authorize.js";
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

router.get("/", 
  authMiddleware,
  authorize("appointments", "read"),
  getAllAppointmentsController
);

router.get("/:id", 
  authMiddleware,
  authorize("appointments", "read"),
  getAppointmentByIdController
);

router.post("/", 
  authMiddleware,
  authorize("appointments", "create"),
  createAppointmentController
);

router.put("/:id", 
  authMiddleware,
  authorize("appointments", "update"),
  updateAppointmentController
);

router.delete("/:id", 
  authMiddleware,
  authorize("appointments", "delete"),
  deleteAppointmentController
);

router.patch("/:id/confirm", 
  authMiddleware,
  authorize("appointments", "update"),
  confirmAppointmentController
);

router.patch("/:id/complete", 
  authMiddleware,
  authorize("appointments", "update"),
  completeAppointmentController
);

router.get("/date/:date", 
  authMiddleware,
  authorize("appointments", "read"),
  getAppointmentsByDate
);

router.get("/month/:year/:month", 
  authMiddleware,
  authorize("appointments", "read"),
  getAppointmentsByMonth
);

export default router;
