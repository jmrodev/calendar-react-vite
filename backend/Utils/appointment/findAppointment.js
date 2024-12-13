import { AppointmentSchema } from '../../Models/AppointmentSchema.js';

export async function findAppointment({ date, appointmentTime }) {
    if (!date || !appointmentTime) {
        throw new Error('Fecha y hora de la cita son obligatorios');
    }

    try {
        const appointment = await AppointmentSchema.findOne({ date, appointmentTime });
        
        if (appointment) {
            throw new Error('La cita ya existe');
        }

        return null;
    } catch (error) {
        throw new Error(error.message);
    }
}