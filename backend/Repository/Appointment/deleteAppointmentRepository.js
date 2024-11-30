import { AppointmentSchema } from '../../Models/AppointmentSchema.js';

export const deleteAppointmentRepository = async (id) => {
    try {
        const appointment = await AppointmentSchema.delete({ _id: Number(id) });
        if (!appointment) {
            throw new Error('Error en deleteAppointmentRepository: Cita no encontrada para eliminar');
        }
        return appointment;
    } catch (error) {
        throw new Error(`Error en deleteAppointmentRepository: al eliminar la cita: ${error.message}`);
    }
}; 