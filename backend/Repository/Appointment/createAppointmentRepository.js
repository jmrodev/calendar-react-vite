import { AppointmentSchema } from '../../Models/AppointmentSchema.js';

export const createAppointmentRepository = async (appointmentData) => {
    try {
        const appointment = await AppointmentSchema.create(appointmentData);
        return await appointment.save();
    } catch (error) {
        throw new Error(`Error en createAppointmentRepository: al crear la cita: ${error.message}`);
    }
}; 