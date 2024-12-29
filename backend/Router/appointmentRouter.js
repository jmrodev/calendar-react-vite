import { Router } from "express";
import {
  createAppointmentController,
  deleteAppointmentController,
  getAllAppointmentsController,
  getAppointmentByDateController,
  getAppointmentByIdController,
  getConfirmedAppointmentsController,
  updateAppointmentController,
  confirmAppointmentController,
  completeAppointmentController,
  getAppointmentsByWeekDayController,
} from "../Controller/appointmentController.js";
import { authToken } from "../Middleware/token/authToken.js";

const router = Router();

router.use(authToken);

router.post("/", createAppointmentController);
router.delete("/:id", deleteAppointmentController);
router.get("/", getAllAppointmentsController);
router.get("/date/:date", getAppointmentByDateController);
router.get("/id/:id", getAppointmentByIdController);
router.get("/confirmed", getConfirmedAppointmentsController);
router.put("/update/:id", updateAppointmentController);
router.put("/confirm/:appointmentId", confirmAppointmentController);
router.put("/complete/:appointmentId", completeAppointmentController);
router.get("/weekday/:dayOfWeek", getAppointmentsByWeekDayController);

export default router;
