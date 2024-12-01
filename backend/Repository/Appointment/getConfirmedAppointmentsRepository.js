import { AppointmentSchema } from '../../Models/AppointmentSchema.js';

export const getConfirmedAppointmentsRepository = async () => {
    try {
        const confirmedAppointments = await AppointmentSchema.find({ confirmAppointment: true });
        return confirmedAppointments;
    } catch (error) {
        throw new Error(`Error in getConfirmedAppointmentsRepository: ${error.message}`);
    }
}