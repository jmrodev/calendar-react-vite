import { deleteAppointmentRepository } from '../../Repository/Appointment/deleteAppointmentRepository.js';

export const deleteAppointmentService = async (id) => {    
    try {
        return await deleteAppointmentRepository(id);
    } catch (error) {
        throw new Error(`Error in delete appointment service: ${error.message}`);
    }
}; 