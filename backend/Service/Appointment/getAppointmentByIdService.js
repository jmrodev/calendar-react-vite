import { getAppointmentByIdRepository } from '../../Repository/Appointment/index.js';

export const getAppointmentById = async (id) => {
    try {
        return await getAppointmentByIdRepository(id);
    } catch (error) {
        throw new Error(`Error in get appointment by id service: ${error.message}`);
    }
}; 