import { AppointmentSchema } from '../../Models/AppointmentSchema.js';

export const deleteAppointmentRepository = async (id) => {
    try {
        const appointment = await AppointmentSchema.delete({ _id: Number(id) });
        if (!appointment) {
            throw new Error('Appointment not found');
        }
        return appointment;
    } catch (error) {
        throw new Error(`Error deleting appointment in repository: ${error.message}`);
    }
}; 