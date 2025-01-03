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
  getAppointmentsByMonth
} from "../Controller/appointmentController.js";
import { authToken } from "../Middleware/token/authToken.js";

const router = Router();

router.use(authToken);

router.get("/month/:year/:month", getAppointmentsByMonth);
router.get("/date/:date", getAppointmentByDateController);
router.get("/weekday/:dayOfWeek", getAppointmentsByWeekDayController);
router.get("/confirmed", getConfirmedAppointmentsController);
router.get("/id/:id", getAppointmentByIdController);
router.get("/", getAllAppointmentsController);

router.post("/", createAppointmentController);
router.put("/update/:id", updateAppointmentController);
router.put("/confirm/:appointmentId", confirmAppointmentController);
router.put("/complete/:appointmentId", completeAppointmentController);
router.delete("/:id", deleteAppointmentController);

export default router;
