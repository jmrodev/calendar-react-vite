import {updateAppointmentRepository} from '../../Repository/Appointment/index.js';

export const updateAppointmentService = async (id, data) => {
    try {
        return await updateAppointmentRepository(id, data);
    } catch (error) {
        throw new Error(`Error in update appointment service: ${error.message}`);
    }
}