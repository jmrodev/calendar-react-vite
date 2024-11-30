import { AppointmentSchema } from '../../Models/AppointmentSchema.js';

export const getAllAppointmentsRepository = async () => {
    try {
        return await AppointmentSchema.find();
    } catch (error) {
        throw new Error(`Error en getAllAppointmentsRepository: al obtener todas las citas: ${error.message}`);
    }
}; 