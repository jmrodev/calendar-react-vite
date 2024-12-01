import { AppointmentSchema } from '../../Models/AppointmentSchema.js';

export const getAppointmentByDateRepository = async (date) => {
    try {
        return await AppointmentSchema.find({ date: date });
    } catch (error) {
        throw new Error(`Error in getAppointmentByDateRepository: ${error.message}`);
    }
}