import { getAllAppointmentsRepository } from '../../Repository/Appointment/index.js';

export const getAllAppointments = async () => {
    try {
        return await getAllAppointmentsRepository();
    } catch (error) {
        throw new Error(`Error in get all appointments service: ${error.message}`);
    }
}; 