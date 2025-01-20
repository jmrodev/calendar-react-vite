import dbLocal from "db-local";
const { Schema } = new dbLocal({ path: "../../databases" });

const AppointmentSchema = Schema("Appointment", {
  _id: { type: Number, required: true },
  date: {
    year: { type: Number, required: true },
    month: { type: Number, required: true },
    day: { type: Number, required: true },
    hours: { type: Number, default: 0 },
    minutes: { type: Number, default: 0 },
    seconds: { type: Number, default: 0 }
  },
  appointmentTime: { type: String, required: true },
  realAppointmentTime: { type: String, required: true },
  available: { type: Boolean, default: false },
  status: { type: String, default: "pending" },
  appointment: {
    confirmAppointment: { type: Boolean, default: false },
    name: { type: String, required: true },
    reason: { type: String, required: true }
  },
  secretary: {
    id: { type: Number, required: true },
    name: { type: String, required: true }
  },
  changeLog: { type: Array, default: [] }
});

export { AppointmentSchema };

