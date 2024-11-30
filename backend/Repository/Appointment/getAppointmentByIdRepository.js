import { AppointmentSchema } from '../../Models/AppointmentSchema.js';

export const getAppointmentByIdRepository = async (id) => {
    try {
        const appointment = await AppointmentSchema.find({ _id: Number(id) });
        if (!appointment || appointment.length === 0) {
            throw new Error('Error en getAppointmentByIdRepository: Cita no encontrada');
        }
        return appointment[0];
    } catch (error) {
        throw new Error(`Error en getAppointmentByIdRepository: al obtener la cita por ID: ${error.message}`);
    }
}; 