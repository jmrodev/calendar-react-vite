import { deleteAppointmentRepository } from '../../Repository/Appointment/deleteAppointmentRepository.js';
import { getAppointmentByIdRepository } from '../../Repository/Appointment/getAppointmentByIdRepository.js';

export const deleteAppointment = async (id) => {
    try {
        await getAppointmentByIdRepository(id);
        return await deleteAppointmentRepository(id);
    } catch (error) {
        throw new Error(`Error in delete appointment service: ${error.message}`);
    }
}; 