import { AppointmentSchema } from '../../Models/AppointmentSchema.js';

export const getAppointmentByIdRepository = async (id) => {
    try {
        const appointment = await AppointmentSchema.find({ _id: Number(id) });
        if (!appointment || appointment.length === 0) {
            throw new Error('Appointment not found');
        }
        return appointment[0];
    } catch (error) {
        throw new Error(`Error getting appointment by id in repository: ${error.message}`);
    }
}; 