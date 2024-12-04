import { createAppointmentRepository } from '../../Repository/Appointment/createAppointmentRepository.js';
import { newAppointmentId } from '../../Utils/id/appointment.js';

export const createAppointmentService = async (appointmentData) => {
    try {
        const { date, appointmentTime, appointment } = appointmentData;
        
        if (!date || !appointmentTime || !appointment.name) {
            throw new Error('Date, appointment time and patient name are required');
        }

        const newAppointment = {
            _id: newAppointmentId(),
            ...appointmentData
        };

        return await createAppointmentRepository(newAppointment);
    } catch (error) {
        throw new Error(`Error in create appointment service: ${error.message}`);
    }
}; 