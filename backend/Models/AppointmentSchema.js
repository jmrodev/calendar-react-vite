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
  secretary: {
    type: Object,
    required: true,
    schema: {
      id: { type: Number, required: true },
      name: { type: String, required: true }
    }
  },
  changeLog: {
    type: Array,
    required: false,
    default: [],
    schema: {
      date: { type: Date, required: true },
      action: { type: String, required: true },
      description: { type: String, required: true },
      secretaryId: { type: Number, required: true },
      previousStatus: { type: String, required: false },
      newStatus: { type: String, required: false }
    }
  }
});

export { AppointmentSchema };
