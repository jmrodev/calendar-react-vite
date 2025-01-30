import { Schema } from "../config/database.js";
import DateSchema from "./DateSchema.js";

const AppointmentSchema = Schema("Appointment", {
  _id: { type: String, required: true },
  date: DateSchema,
  appointmentTime: { type: String, required: true },
  realAppointmentTime: { type: String, required: true },
  available: { type: Boolean, default: false },
  status: { 
    type: String, 
    default: "pending",
    enum: ["pending", "confirmed", "completed", "cancelled"]
  },
  details: {
    confirmAppointment: { type: Boolean, default: false },
    patientName: { type: String, required: true },
    reason: { type: String, required: true }
  },
  managedBy: { type: Number, ref: 'Users' },
  changeLog: [{ type: Number, ref: 'Logs' }],
  createdAt: DateSchema,
  updatedAt: DateSchema
});

export default AppointmentSchema;

