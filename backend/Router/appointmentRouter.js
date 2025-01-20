import { Router } from "express";
import {
  createAppointmentController,
  deleteAppointmentController,
  getAllAppointmentsController,
  getAppointmentByIdController,
  updateAppointmentController,
  confirmAppointmentController,
  completeAppointmentController,
} from "../Controller/appointmentController.js";
import { authorize } from "../middleware/roles/authorize.js";

const router = Router();

router.get(
  "/",
  authorize("appointments", "read"),
  getAllAppointmentsController
);

router.get(
  "/:id",
  authorize("appointments", "read"),
  getAppointmentByIdController
);

router.post(
  "/",
  authorize("appointments", "create"),
  createAppointmentController
);

router.put(
  "/:id",
  authorize("appointments", "update"),
  updateAppointmentController
);

router.delete(
  "/:id",
  authorize("appointments", "delete"),
  deleteAppointmentController
);

router.put(
  "/:id/confirm",
  authorize("appointments", "update"),
  confirmAppointmentController
);

router.put(
  "/:id/complete",
  authorize("appointments", "update"),
  completeAppointmentController
);

export default router;
