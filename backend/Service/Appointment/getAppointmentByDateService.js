import { getAppointmentByDateRepository } from '../../Repository/Appointment/index.js';

export const getAppointmentByDateService = async (date) => {
    try {
        return await getAppointmentByDateRepository(date);
    } catch (error) {
        throw new Error(`Error in get appointment by date service: ${error.message}`);
    }
}