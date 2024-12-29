import dbLocal from "db-local";
const { Schema } = new dbLocal({ path: "../databases" });

const AppointmentSchema = Schema("Appointment", {
  _id: { type: Number, required: true },
  date: {
    type: Object,
    required: true,
    schema: {
      year: { type: Number, required: true },
      month: { type: Number, required: true },
      day: { type: Number, required: true },
      hours: { type: Number, required: true },
      minutes: { type: Number, required: true },
      seconds: { type: Number, required: true }
    }
  },
  appointmentTime: { type: String, required: true },
  realAppointmentTime: { type: String, required: true },
  available: { type: Boolean, required: true },
  status: { type: String, required: true, default: "pending" },
  appointment: {
    type: Object,
    required: true,
    schema: {
      confirmAppointment: { type: Boolean, required: true },
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
      date: {
        type: Object,
        required: true,
        schema: {
          year: { type: Number, required: true },
          month: { type: Number, required: true },
          day: { type: Number, required: true },
          hours: { type: Number, required: true },
          minutes: { type: Number, required: true },
          seconds: { type: Number, required: true }
        }
      },
      action: { type: String, required: true },
      description: { type: String, required: true },
      secretaryId: { type: Number, required: true },
      previousStatus: { type: String, required: false },
      newStatus: { type: String, required: false }
    }
  }
});

export { AppointmentSchema };
