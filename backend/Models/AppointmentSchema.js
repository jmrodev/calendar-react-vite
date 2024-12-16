import dbLocal from "db-local";
import { standardizeDate } from "../Utils/date/dateUtils.js";
const { Schema } = new dbLocal({ path: "../databases" });

const AppointmentSchema = Schema("Appointment", {
  _id: { type: Number, required: true },
  date: { type: Date, required: true },
  appointmentTime: { type: Date, required: true },
  realAppointmentTime: { type: Date, required: true },
  available: { type: Boolean, required: true },
  status: { type: String, required: true, default: "pending" },
  appointment: {
    type: Object,
    required: true,
    schema: {
      confirmAppointment: {
        type: Boolean,
        required: true,
      },
      name: { type: String, required: true },
      reason: { type: String, required: true },
    },
  },
});

export { AppointmentSchema };
