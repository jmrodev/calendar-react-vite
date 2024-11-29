import { AppointmentSchema } from '../../Models/AppointmentSchema.js';

export const getAllAppointmentsRepository = async () => {
    try {
        return await AppointmentSchema.find();
    } catch (error) {
        throw new Error(`Error getting all appointments in repository: ${error.message}`);
    }
}; 