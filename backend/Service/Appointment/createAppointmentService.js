import { createAppointmentRepository } from '../../Repository/Appointment/createAppointmentRepository.js';
import { newAppointmentId } from '../../Utils/id/appointment.js';

export const createAppointment = async (date, time, patientName, description) => {
    try {
        if (!date || !time || !patientName) {
            throw new Error('Date, time and patient name are required');
        }

        const appointmentData = {
            _id: newAppointmentId(),
            date,
            time,
            patientName,
            description
        };

        return await createAppointmentRepository(appointmentData);
    } catch (error) {
        throw new Error(`Error in create appointment service: ${error.message}`);
    }
}; 