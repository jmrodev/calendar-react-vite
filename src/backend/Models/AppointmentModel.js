import dbLocal from 'db-local';
const { Schema } = new dbLocal({ path: "./databases" });

// Define el esquema para las citas
const Appointment = Schema("Appointment", {
    _id: { type: Number, required: true },
    date: { type: String, required: true },
    appointmentTime: { type: String, required: true },
    realAppointmentTime: { type: String, required: true },
    available: { type: Boolean, required: true },
    status: { type: String, required: true, default: 'pending' }, // pending, confirmed, completed
    appointment: {
        type: Object,
        required: true,
        schema: {    
            confirmAppointment: { type: Boolean, required: true },
            name: { type: String, required: true },
            reason: { type: String, required: true }
        }
    }
});

export { Appointment };